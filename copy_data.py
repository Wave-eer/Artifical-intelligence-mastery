import os

def main():
    target_name = "BrentSpotPriceOnly.csv"
    found = False
    
    print("Searching for data file...")
    for root, dirs, files in os.walk("C:\\Users\\arsema"):
        # Skip some system dirs if possible to speed up
        if any(p in root for p in [".git", "AppData", "node_modules", ".vscode"]):
            continue
        if target_name in files:
            src_path = os.path.join(root, target_name)
            dst_path = "C:\\Users\\arsema\\.gemini\\antigravity\\scratch\\Artifical-intelligence-mastery\\BrentSpotPriceOnly.csv"
            print(f"Found: {src_path}")
            try:
                with open(src_path, "rb") as f_src:
                    data = f_src.read()
                print(f"Read {len(data)} bytes")
                with open(dst_path, "wb") as f_dst:
                    f_dst.write(data)
                print(f"Wrote {len(data)} bytes to {dst_path}")
                found = True
                break
            except Exception as e:
                print(f"Error copying file: {e}")
                
    if not found:
        print("Data file not found!")

if __name__ == "__main__":
    main()
