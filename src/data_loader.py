import os
import pandas as pd
import numpy as np
import warnings

def load_brent_prices(filepath="data/BrentSpotPriceOnly.csv"):
    """
    Loads daily Brent Crude spot price dataset and cleans dates and numerical values.
    
    Parameters:
        filepath (str): Relative or absolute path to the CSV file.
        
    Returns:
        pd.DataFrame: DataFrame containing 'Date', 'Price', and 'Log_Return'.
    """
    if not os.path.exists(filepath):
        alt_path = os.path.join(os.path.dirname(__file__), "..", filepath)
        if os.path.exists(alt_path):
            filepath = alt_path
        else:
            raise FileNotFoundError(f"Brent price dataset not found at: {filepath}")

    try:
        df = pd.read_csv(filepath)
        if "Date" not in df.columns or "Price" not in df.columns:
            raise ValueError("CSV file missing required columns 'Date' and 'Price'.")
            
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
            
        df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
        
        # Drop invalid rows
        df = df.dropna(subset=["Date", "Price"]).sort_values("Date").reset_index(drop=True)
        
        # Compute Log Returns: ln(P_t / P_{t-1})
        df["Log_Return"] = np.log(df["Price"] / df["Price"].shift(1))
        
        # Compute 30-day and 90-day rolling volatility (std dev of log returns)
        df["Vol_30d"] = df["Log_Return"].rolling(window=30).std()
        df["Vol_90d"] = df["Log_Return"].rolling(window=90).std()
        
        return df
    except Exception as e:
        raise RuntimeError(f"Error loading Brent price dataset: {str(e)}")

def load_events(filepath="data/brent_events.csv"):
    """
    Loads historical geopolitical, OPEC, and economic event dataset.
    
    Parameters:
        filepath (str): Relative or absolute path to the event CSV file.
        
    Returns:
        pd.DataFrame: DataFrame containing 'Date', 'Event', 'Category', 'Description'.
    """
    if not os.path.exists(filepath):
        alt_path = os.path.join(os.path.dirname(__file__), "..", filepath)
        if os.path.exists(alt_path):
            filepath = alt_path
        else:
            raise FileNotFoundError(f"Event dataset not found at: {filepath}")

    try:
        df = pd.read_csv(filepath)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        df = df.dropna(subset=["Date", "Event"]).sort_values("Date").reset_index(drop=True)
        return df
    except Exception as e:
        raise RuntimeError(f"Error loading event dataset: {str(e)}")

def align_events_with_prices(price_df, event_df):
    """
    Aligns events with the closest price observation index for change point mapping.
    
    Parameters:
        price_df (pd.DataFrame): Cleaned price dataframe with 'Date'.
        event_df (pd.DataFrame): Cleaned event dataframe with 'Date'.
        
    Returns:
        pd.DataFrame: Event dataframe enriched with 'Nearest_Price_Date', 'Nearest_Price', and 'Price_Index'.
    """
    aligned = event_df.copy()
    indices = []
    prices = []
    
    for _, row in event_df.iterrows():
        event_date = row["Date"]
        idx = (price_df["Date"] - event_date).abs().idxmin()
        indices.append(idx)
        prices.append(price_df.loc[idx, "Price"])
        
    aligned["Price_Index"] = indices
    aligned["Nearest_Price"] = prices
    return aligned
