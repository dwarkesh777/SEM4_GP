import requests
import json

def test_registration():
    url = "http://localhost:8000/api/auth/register/"
    payload = {
        "email": "testuser_unique@example.com",
        "password": "testpassword123",
        "full_name": "Test User",
        "is_owner": False
    }
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_registration()
