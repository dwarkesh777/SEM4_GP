import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_filters():
    print("Testing Property Filters...")
    
    # 1. Test Gender Filter
    print("\n1. Testing Gender Filter (Boys)...")
    resp = requests.get(f"{BASE_URL}/properties/?gender=Boys")
    if resp.status_code == 200:
        data = resp.json()
        print(f"Found {len(data)} properties.")
        all_boys = all(p['gender'] == 'Boys' for p in data)
        print(f"All results are Boys: {all_boys}")
    
    # 2. Test Multi-Value Filter (Gender: Boys & Girls)
    print("\n2. Testing Multi-Value Filter (Boys & Girls)...")
    resp = requests.get(f"{BASE_URL}/properties/?gender=Boys&gender=Girls")
    if resp.status_code == 200:
        data = resp.json()
        print(f"Found {len(data)} properties.")
        all_correct = all(p['gender'] in ['Boys', 'Girls'] for p in data)
        print(f"All results are Boys or Girls: {all_correct}")

    # 3. Test Type Filter (Hostel)
    print("\n3. Testing Type Filter (Hostel)...")
    resp = requests.get(f"{BASE_URL}/properties/?type=Hostel")
    if resp.status_code == 200:
        data = resp.json()
        print(f"Found {len(data)} properties.")
        all_hostels = all(p['type'] == 'Hostel' for p in data)
        print(f"All results are Hostels: {all_hostels}")

    # 4. Test Sorting (Price Low to High)
    print("\n4. Testing Price Sort (Low to High)...")
    resp = requests.get(f"{BASE_URL}/properties/?ordering=price_asc")
    if resp.status_code == 200:
        data = resp.json()
        prices = [p['price'] for p in data]
        is_sorted = all(prices[i] <= prices[i+1] for i in range(len(prices)-1))
        print(f"Prices: {prices[:5]}...")
        print(f"Correctly sorted: {is_sorted}")

if __name__ == "__main__":
    test_filters()
