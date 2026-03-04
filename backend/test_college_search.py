import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_colleges_endpoint():
    print("Testing /api/colleges/...")
    try:
        response = requests.get(f"{BASE_URL}/colleges/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} colleges.")
            if data:
                print(f"First college: {data[0]['Name']} (Lat: {data[0]['Latitude']}, Lng: {data[0]['Longitude']})")
                return data[0]
    except Exception as e:
        print(f"Error: {e}")
    return None

def test_radius_search(lat, lng):
    print(f"\nTesting radius search for Lat: {lat}, Lng: {lng}...")
    try:
        response = requests.get(f"{BASE_URL}/properties/?lat={lat}&lng={lng}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} properties within 30km.")
            for i, p in enumerate(data[:3]):
                print(f"{i+1}. {p['name']} - Distance: {p.get('distance')} km")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    first_college = test_colleges_endpoint()
    if first_college:
        test_radius_search(first_college['Latitude'], first_college['Longitude'])
