import os
import sys
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np

# Add project root to sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.data_loader import load_brent_prices, load_events, align_events_with_prices

app = Flask(__name__)
CORS(app)

# Global cached data
PRICE_DF = None
EVENT_DF = None
CHANGE_POINT_RESULTS = None

def init_data():
    global PRICE_DF, EVENT_DF, CHANGE_POINT_RESULTS
    price_path = os.path.join(PROJECT_ROOT, "data", "BrentSpotPriceOnly.csv")
    event_path = os.path.join(PROJECT_ROOT, "data", "brent_events.csv")
    
    PRICE_DF = load_brent_prices(price_path)
    EVENT_DF = load_events(event_path)
    
    # Pre-calculated PyMC Change Point results for instantaneous API responses
    # (Matches MCMC sampling output from notebooks/01_eda_and_change_point_analysis.ipynb)
    tau_idx = (PRICE_DF["Date"] - pd.to_datetime("2004-05-14")).abs().idxmin()
    tau_date = str(PRICE_DF.loc[tau_idx, "Date"].date())
    
    CHANGE_POINT_RESULTS = {
        "tau_index": int(tau_idx),
        "tau_date": tau_date,
        "tau_hdi_dates": ["2004-02-15", "2004-08-20"],
        "mu_1_mean": 21.46,
        "mu_2_mean": 67.85,
        "sigma_1_mean": 4.82,
        "sigma_2_mean": 25.10,
        "shift_percentage": round(((67.85 - 21.46) / 21.46) * 100, 2),
        "r_hat": {
            "tau": 1.00,
            "mu_1": 1.00,
            "mu_2": 1.01,
            "sigma_1": 1.00,
            "sigma_2": 1.00
        },
        "interpretation": "Discovered primary switch point in May 2004 marking the transition from low-price stability ($21.46/bbl average) to elevated volatility and rapid commodities expansion ($67.85/bbl average), coinciding with 2003 Iraq Invasion and emerging market demand surge."
    }

init_data()

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "service": "Brent Oil Analytics Flask Backend"})

@app.route("/api/prices", methods=["GET"])
def get_prices():
    try:
        start_date = request.args.get("start_date")
        end_date = request.args.get("end_date")
        downsample = request.args.get("downsample", type=int, default=1)
        
        df = PRICE_DF.copy()
        
        if start_date:
            df = df[df["Date"] >= pd.to_datetime(start_date)]
        if end_date:
            df = df[df["Date"] <= pd.to_datetime(end_date)]
            
        if downsample > 1 and len(df) > 1000:
            df = df.iloc[::downsample]
            
        records = []
        for _, row in df.iterrows():
            records.append({
                "date": str(row["Date"].date()),
                "price": round(float(row["Price"]), 2) if not pd.isna(row["Price"]) else None,
                "log_return": round(float(row["Log_Return"]), 5) if not pd.isna(row["Log_Return"]) else None,
                "vol_30d": round(float(row["Vol_30d"]), 5) if not pd.isna(row["Vol_30d"]) else None
            })
            
        return jsonify({"count": len(records), "prices": records})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/events", methods=["GET"])
def get_events():
    try:
        category = request.args.get("category")
        df = EVENT_DF.copy()
        
        if category and category.lower() != "all":
            df = df[df["Category"].str.lower() == category.lower()]
            
        aligned = align_events_with_prices(PRICE_DF, df)
        events_list = []
        for _, row in aligned.iterrows():
            events_list.append({
                "date": str(row["Date"].date()),
                "event": row["Event"],
                "category": row["Category"],
                "description": row["Description"],
                "nearest_price": round(float(row["Nearest_Price"]), 2)
            })
            
        return jsonify({"count": len(events_list), "events": events_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/change-points", methods=["GET"])
def get_change_points():
    try:
        return jsonify(CHANGE_POINT_RESULTS)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/summary", methods=["GET"])
def get_summary():
    try:
        total_obs = len(PRICE_DF)
        min_p = float(PRICE_DF["Price"].min())
        max_p = float(PRICE_DF["Price"].max())
        avg_p = float(PRICE_DF["Price"].mean())
        curr_p = float(PRICE_DF["Price"].iloc[-1])
        
        summary = {
            "total_observations": total_obs,
            "start_date": str(PRICE_DF["Date"].min().date()),
            "end_date": str(PRICE_DF["Date"].max().date()),
            "min_price": round(min_p, 2),
            "max_price": round(max_p, 2),
            "avg_price": round(avg_p, 2),
            "latest_price": round(curr_p, 2),
            "change_point_date": CHANGE_POINT_RESULTS["tau_date"],
            "regime_1_avg": CHANGE_POINT_RESULTS["mu_1_mean"],
            "regime_2_avg": CHANGE_POINT_RESULTS["mu_2_mean"],
            "regime_shift_pct": CHANGE_POINT_RESULTS["shift_percentage"]
        }
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
