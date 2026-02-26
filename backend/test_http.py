import requests
import json

def test_http_login(email, password):
    url = "http://localhost:8000/api/auth/login/"
    print(f"Testing HTTP login at {url} for {email}...")
    try:
        response = requests.post(
            url, 
            json={'email': email, 'password': password},
            headers={'Content-Type': 'application/json'}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"HTTP Request Failed: {e}")

if __name__ == "__main__":
    test_http_login('student@test.com', 'testpass123')
