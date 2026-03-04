import requests
import json

BASE_URL = 'http://localhost:8000/api/properties/'

def test_search(query=None):
    params = {}
    if query:
        params['search'] = query
    
    print(f"Testing search with query: '{query}'")
    try:
        response = requests.get(BASE_URL, params=params)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Number of results: {len(data)}")
            if len(data) > 0:
                print("First result name:", data[0].get('name'))
                print("First result city:", data[0].get('city'))
        else:
            print("Error response:", response.text)
    except Exception as e:
        print(f"Request failed: {e}")
    print("-" * 30)

if __name__ == "__main__":
    # Test all
    test_search()
    
    # Test with a query that might exist (Ahmedabad is the default city)
    test_search("Ahmedabad")
    
    # Test with a specific name snippet if known
    # test_search("Hostel")
    
    # Test with a non-existent query
    test_search("NonExistentPlaceXYZ")
