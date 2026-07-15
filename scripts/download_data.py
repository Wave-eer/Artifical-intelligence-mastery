import csv
import urllib.request
import os
from datetime import datetime

def download_brent_data():
    url = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU"
    raw_path = "brent_raw.csv"
    clean_path = "BrentSpotPriceOnly.csv"
    
    print(f"Downloading raw Brent oil prices from FRED: {url} ...")
    try:
        urllib.request.urlretrieve(url, raw_path)
        print("Download successful.")
    except Exception as e:
        print(f"Failed to download data: {e}")
        return False
        
    print("Processing and cleaning data...")
    try:
        rows = []
        with open(raw_path, mode="r", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader)
            for row in reader:
                if len(row) < 2:
                    continue
                date_str, price_str = row[0], row[1]
                if price_str == ".":
                    continue
                try:
                    price = float(price_str)
                except ValueError:
                    continue
                
                try:
                    dt = datetime.strptime(date_str, "%Y-%m-%d")
                except ValueError:
                    continue
                
                # Filter date range: May 20, 1987, to September 30, 2022
                start_date = datetime(1987, 5, 20)
                end_date = datetime(2022, 9, 30)
                if start_date <= dt <= end_date:
                    rows.append((dt, price))
        
        # Sort values by Date ascending
        rows.sort(key=lambda x: x[0])
        
        # Month mapping to ensure locale independence
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        
        # Save to target CSV
        with open(clean_path, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Price"])
            for dt, price in rows:
                date_formatted = f"{dt.day:02d}-{months[dt.month - 1]}-{dt.year % 100:02d}"
                writer.writerow([date_formatted, price])
                
        print(f"Cleaned dataset saved to {clean_path} ({len(rows)} rows).")
        
        # Clean up raw file
        if os.path.exists(raw_path):
            os.remove(raw_path)
        return True
    except Exception as e:
        print(f"Failed to process data: {e}")
        return False

if __name__ == "__main__":
    download_brent_data()
