import numpy as np
import pandas as pd
import pymc as pm
import arviz as az

class BayesianChangePointModel:
    """
    Bayesian Change Point Detection Model using PyMC.
    
    Identifies a discrete switch point tau in a univariate time series (e.g. Brent Crude prices or log returns),
    estimating distinct statistical parameters (mean mu, volatility sigma) before and after tau.
    """
    def __init__(self, data_series, dates=None):
        """
        Parameters:
            data_series (array-like): Numerical series (prices or log returns).
            dates (array-like, optional): Corresponding datetime values for mapping tau index to date.
        """
        self.data = np.asarray(data_series, dtype=float)
        self.dates = np.asarray(dates) if dates is not None else None
        self.n_obs = len(self.data)
        self.model = None
        self.trace = None
        self.summary_df = None
        
    def build_model(self):
        """
        Builds the PyMC Bayesian change point model graph.
        """
        idx = np.arange(self.n_obs)
        mean_val = float(np.mean(self.data))
        std_val = float(np.std(self.data))
        if std_val == 0:
            std_val = 1.0
        
        with pm.Model() as model:
            # Switch point tau: Discrete uniform prior over observation range
            tau = pm.DiscreteUniform("tau", lower=0, upper=self.n_obs - 1)
            
            # Before and after mean parameters
            mu_1 = pm.Normal("mu_1", mu=mean_val, sigma=std_val * 2)
            mu_2 = pm.Normal("mu_2", mu=mean_val, sigma=std_val * 2)
            
            # Before and after volatility parameters
            sigma_1 = pm.Exponential("sigma_1", lam=1.0 / std_val)
            sigma_2 = pm.Exponential("sigma_2", lam=1.0 / std_val)
            
            # Deterministic switch logic via pm.math.switch
            mu = pm.math.switch(tau >= idx, mu_1, mu_2)
            sigma = pm.math.switch(tau >= idx, sigma_1, sigma_2)
            
            # Likelihood
            obs = pm.Normal("obs", mu=mu, sigma=sigma, observed=self.data)
            
        self.model = model
        return self.model
        
    def fit(self, draws=500, tune=500, chains=2, random_seed=42, progressbar=False):
        """
        Executes MCMC sampling.
        
        Returns:
            az.InferenceData: Posterior trace object.
        """
        if self.model is None:
            self.build_model()
            
        with self.model:
            self.trace = pm.sample(
                draws=draws,
                tune=tune,
                chains=chains,
                cores=1,
                random_seed=random_seed,
                progressbar=progressbar,
                return_inferencedata=True
            )
            
        self.summary_df = az.summary(self.trace)
        return self.trace

    def get_results(self):
        """
        Extracts posterior summary metrics, change point index, date, and HDI credible intervals.
        """
        if self.trace is None or self.summary_df is None:
            raise ValueError("Model has not been fitted yet. Call fit() first.")
            
        tau_samples = self.trace.posterior["tau"].values.flatten()
        tau_median = int(np.median(tau_samples))
        tau_mean = int(np.mean(tau_samples))
        
        # 95% Credible Interval (HDI / Percentiles)
        try:
            tau_hdi = az.hdi(tau_samples, prob=0.95)
        except Exception:
            tau_hdi = np.percentile(tau_samples, [2.5, 97.5])
            
        tau_lower = int(np.clip(tau_hdi[0], 0, self.n_obs - 1))
        tau_upper = int(np.clip(tau_hdi[1], 0, self.n_obs - 1))
        
        results = {
            "tau_index": tau_median,
            "tau_mean_index": tau_mean,
            "tau_hdi_index": [tau_lower, tau_upper],
            "mu_1_mean": float(self.summary_df.loc["mu_1", "mean"]),
            "mu_2_mean": float(self.summary_df.loc["mu_2", "mean"]),
            "sigma_1_mean": float(self.summary_df.loc["sigma_1", "mean"]),
            "sigma_2_mean": float(self.summary_df.loc["sigma_2", "mean"]),
            "r_hat": {
                "tau": float(self.summary_df.loc["tau", "r_hat"]),
                "mu_1": float(self.summary_df.loc["mu_1", "r_hat"]),
                "mu_2": float(self.summary_df.loc["mu_2", "r_hat"]),
                "sigma_1": float(self.summary_df.loc["sigma_1", "r_hat"]),
                "sigma_2": float(self.summary_df.loc["sigma_2", "r_hat"]),
            }
        }
        
        if self.dates is not None:
            results["tau_date"] = str(pd.to_datetime(self.dates[tau_median]).date())
            results["tau_hdi_dates"] = [
                str(pd.to_datetime(self.dates[tau_lower]).date()),
                str(pd.to_datetime(self.dates[tau_upper]).date())
            ]
            
        return results
