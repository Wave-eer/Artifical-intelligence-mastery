import unittest
import numpy as np
import pandas as pd
from src.change_point_model import BayesianChangePointModel

class TestChangePointModel(unittest.TestCase):
    def setUp(self):
        np.random.seed(42)
        # Create synthetic time series with artificial change point at index 50
        part1 = np.random.normal(loc=20.0, scale=2.0, size=50)
        part2 = np.random.normal(loc=60.0, scale=5.0, size=50)
        self.data = np.concatenate([part1, part2])
        self.dates = pd.date_range(start="2020-01-01", periods=100, freq="D")

    def test_model_build_and_fit(self):
        model = BayesianChangePointModel(self.data, self.dates)
        pymc_model = model.build_model()
        self.assertIsNotNone(pymc_model)
        
        # Fit with quick sample for testing speed
        trace = model.fit(draws=100, tune=100, chains=2, random_seed=42)
        self.assertIsNotNone(trace)
        
        results = model.get_results()
        self.assertIn("tau_index", results)
        self.assertIn("mu_1_mean", results)
        self.assertIn("mu_2_mean", results)
        self.assertIn("r_hat", results)
        self.assertIn("tau_date", results)
        
        # Verify detected switch point is near index 50
        self.assertTrue(35 <= results["tau_index"] <= 65)

if __name__ == "__main__":
    unittest.main()
