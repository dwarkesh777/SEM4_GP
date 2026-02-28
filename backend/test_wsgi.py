import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()
print("Django setup successful!")

print("Importing get_wsgi_application...")
from django.core.wsgi import get_wsgi_application
print("Calling get_wsgi_application()...")
try:
    application = get_wsgi_application()
    print("get_wsgi_application() successful!")
except Exception as e:
    print(f"Error calling get_wsgi_application(): {e}")

print("Importing make_server...")
from wsgiref.simple_server import make_server
print("make_server imported successful!")
