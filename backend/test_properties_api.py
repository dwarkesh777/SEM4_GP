import requests
import json

try:
    response = requests.get('http://localhost:8000/api/properties/')
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
    except:
        print(response.text[:1000])
except Exception as e:
    print(f"Error: {e}")
