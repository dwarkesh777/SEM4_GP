import os
import django
from django.core.wsgi import get_wsgi_application
from wsgiref.simple_server import make_server

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()
application = get_wsgi_application()

print("Manual WSGI server starting on port 8000...")
try:
    httpd = make_server('', 8000, application)
    print("Serving on port 8000. Press Ctrl+C to stop.")
    httpd.serve_forever()
except Exception as e:
    print(f"Server error: {e}")
