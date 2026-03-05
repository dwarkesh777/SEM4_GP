import os
import django
import sys

# Add the project directory to sys.path
sys.path.append(os.getcwd())

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings

print(f"BASE_DIR: {settings.BASE_DIR}")
cred_path = os.path.join(settings.BASE_DIR, 'firebase-service-account.json')
print(f"Checking for credentials at: {cred_path}")
print(f"File exists: {os.path.exists(cred_path)}")

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    print("Firebase initialized successfully!")
    # Test getting an app
    app = firebase_admin.get_app()
    print(f"Active App Name: {app.name}")
except Exception as e:
    print(f"Initialization Failed: {e}")
