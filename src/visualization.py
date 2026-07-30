import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
import arviz as az

def plot_price_and_returns(df, title_prefix="Brent Crude Oil"):
    """
    Plots raw price series and daily log returns side by side or stacked.
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8), sharex=True)
    
    ax1.plot(df["Date"], df["Price"], color="#0088FE", linewidth=1.2, label="Spot Price ($/bbl)")
    ax1.set_ylabel("Price ($/bbl)", fontsize=11, fontweight="bold")
    ax1.set_title(f"{title_prefix} - Spot Price (1987-2022)", fontsize=13, fontweight="bold")
    ax1.grid(True, linestyle="--", alpha=0.5)
    ax1.legend(loc="upper left")
    
    ax2.plot(df["Date"], df["Log_Return"], color="#00C49F", linewidth=0.8, alpha=0.7, label="Daily Log Return")
    ax2.axhline(0, color="black", linestyle="--", alpha=0.7)
    ax2.set_ylabel("Log Return", fontsize=11, fontweight="bold")
    ax2.set_xlabel("Date", fontsize=11, fontweight="bold")
    ax2.set_title(f"{title_prefix} - Daily Log Returns", fontsize=13, fontweight="bold")
    ax2.grid(True, linestyle="--", alpha=0.5)
    ax2.legend(loc="upper left")
    
    plt.tight_layout()
    return fig

def plot_change_point_overlay(df, model_results, events_df=None):
    """
    Plots Brent Crude prices with detected Bayesian change point line, HDI interval, and historical events.
    """
    fig, ax = plt.subplots(figsize=(14, 7))
    
    ax.plot(df["Date"], df["Price"], color="#1f77b4", linewidth=1.2, label="Brent Spot Price")
    
    tau_date = pd.to_datetime(model_results.get("tau_date"))
    tau_hdi = [pd.to_datetime(d) for d in model_results.get("tau_hdi_dates", [])]
    
    # Change point line
    if tau_date:
        ax.axvline(tau_date, color="#d62728", linestyle="--", linewidth=2.5, label=f"Detected Change Point ({tau_date.date()})")
        
    # Shaded HDI interval
    if len(tau_hdi) == 2:
        ax.axvspan(tau_hdi[0], tau_hdi[1], color="#ff7f0e", alpha=0.25, label="95% Tau Credible Interval")
        
    # Before / After regime mean lines
    mu1 = model_results["mu_1_mean"]
    mu2 = model_results["mu_2_mean"]
    tau_idx = model_results["tau_index"]
    
    ax.hlines(mu1, df["Date"].iloc[0], df["Date"].iloc[tau_idx], colors="#2ca02c", linestyles="-", linewidth=2.5, label=f"Regime 1 Mean (${mu1:.2f})")
    ax.hlines(mu2, df["Date"].iloc[tau_idx], df["Date"].iloc[-1], colors="#9467bd", linestyles="-", linewidth=2.5, label=f"Regime 2 Mean (${mu2:.2f})")
    
    # Optional Event Overlays
    if events_df is not None:
        colors = {"Geopolitical": "#e377c2", "OPEC": "#8c564b", "Economic": "#bcbd22"}
        for _, row in events_df.iterrows():
            cat = row.get("Category", "Geopolitical")
            col = colors.get(cat, "gray")
            ax.axvline(row["Date"], color=col, linestyle=":", alpha=0.6, linewidth=1.0)
            
    ax.set_title("Brent Spot Price with PyMC Bayesian Change Point & Regime Shift", fontsize=14, fontweight="bold")
    ax.set_ylabel("Price ($/bbl)", fontsize=12, fontweight="bold")
    ax.set_xlabel("Date", fontsize=12, fontweight="bold")
    ax.grid(True, linestyle="--", alpha=0.5)
    ax.legend(loc="upper left", framealpha=0.9)
    
    plt.tight_layout()
    return fig

def plot_mcmc_trace(trace):
    """
    Plots PyMC trace diagnostics using ArviZ.
    """
    fig = az.plot_trace(trace, var_names=["tau", "mu_1", "mu_2", "sigma_1", "sigma_2"], compact=False)
    plt.tight_layout()
    return fig

def plot_posteriors(trace):
    """
    Plots posterior distribution for parameters.
    """
    try:
        fig = az.plot_posterior(trace, var_names=["tau", "mu_1", "mu_2", "sigma_1", "sigma_2"], point_estimate="median")
    except Exception:
        fig = az.plot_posterior(trace, var_names=["tau", "mu_1", "mu_2", "sigma_1", "sigma_2"])
    plt.tight_layout()
    return fig
