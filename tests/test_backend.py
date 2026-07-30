import unittest
import json
from backend.app import app

class TestFlaskBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_endpoint(self):
        res = self.app.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "ok")

    def test_prices_endpoint(self):
        res = self.app.get("/api/prices?start_date=2000-01-01&end_date=2005-01-01")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("prices", data)
        self.assertGreater(data["count"], 0)

    def test_events_endpoint(self):
        res = self.app.get("/api/events?category=OPEC")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("events", data)
        self.assertGreater(data["count"], 0)
        for ev in data["events"]:
            self.assertEqual(ev["category"], "OPEC")

    def test_change_points_endpoint(self):
        res = self.app.get("/api/change-points")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("tau_date", data)
        self.assertIn("mu_1_mean", data)
        self.assertIn("mu_2_mean", data)

    def test_summary_endpoint(self):
        res = self.app.get("/api/summary")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("total_observations", data)
        self.assertIn("latest_price", data)

if __name__ == "__main__":
    unittest.main()
