import unittest
import pandas as pd
import numpy as np
import os
from src.data_loader import load_brent_prices, load_events, align_events_with_prices

class TestDataLoader(unittest.TestCase):
    def setUp(self):
        self.price_path = "data/BrentSpotPriceOnly.csv"
        self.event_path = "data/brent_events.csv"

    def test_load_brent_prices(self):
        df = load_brent_prices(self.price_path)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertIn("Date", df.columns)
        self.assertIn("Price", df.columns)
        self.assertIn("Log_Return", df.columns)
        self.assertGreater(len(df), 1000)
        self.assertFalse(df["Price"].isnull().any())

    def test_load_events(self):
        df = load_events(self.event_path)
        self.assertIsInstance(df, pd.DataFrame)
        self.assertIn("Date", df.columns)
        self.assertIn("Event", df.columns)
        self.assertGreaterEqual(len(df), 10)

    def test_align_events_with_prices(self):
        prices = load_brent_prices(self.price_path)
        events = load_events(self.event_path)
        aligned = align_events_with_prices(prices, events)
        self.assertIn("Price_Index", aligned.columns)
        self.assertIn("Nearest_Price", aligned.columns)
        self.assertEqual(len(aligned), len(events))

if __name__ == "__main__":
    unittest.main()
