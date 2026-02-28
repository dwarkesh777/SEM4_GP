import os
import django
import sys

print("Setting environment...")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')

print("Calling django.setup()...")
try:
    django.setup()
    print("django.setup() successful")
except Exception as e:
    print(f"django.setup() failed: {e}")
    sys.exit(1)

print("Attempting get_wsgi_application()...")
try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    print("get_wsgi_application() successful")
except Exception as e:
    print(f"get_wsgi_application() failed: {e}")
    sys.exit(1)

print("Attempting a simple query...")
from api.models import Property
try:
    print(f"Property count: {Property.objects.count()}")
except Exception as e:
    print(f"Query failed: {e}")

print("All initialization steps completed!")
