import os
import django
from django.conf import settings

print("Setting environment variable...")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')

print("Calling django.setup()...")
try:
    django.setup()
    print("Django setup successful!")
except Exception as e:
    print(f"Error during django.setup(): {e}")
