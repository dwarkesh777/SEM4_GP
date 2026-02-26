import os
import django
import sys
from django.test import Client
from django.urls import reverse
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

client = Client()

def test_login(email, password):
    print(f"Testing login for {email}...")
    try:
        url = reverse('token_obtain_pair')
        response = client.post(url, data=json.dumps({'email': email, 'password': password}), content_type='application/json')
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
             # Try to find the error in common locations
             if hasattr(response, 'context') and response.context and 'exception' in response.context:
                 print(f"Exception: {response.context['exception']}")
             else:
                 # Print the first 500 chars of content
                 print(f"Content Start: {response.content.decode()[:1000]}")
        else:
            print(f"Success! Response: {response.json()}")
    except Exception as e:
        import traceback
        print(f"Internal Test Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_login('student@test.com', 'testpass123')
