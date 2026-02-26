import os
import sys
from django.core.wsgi import get_wsgi_application
from wsgiref.simple_server import make_server

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')

try:
    # Initialize Django
    import django
    django.setup()
    
    # Get the WSGI application
    application = get_wsgi_application()
    
    # Port to listen on
    port = 8000
    
    print(f"Starting server on port {port}...")
    httpd = make_server('0.0.0.0', port, application)
    httpd.serve_forever()
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
except KeyboardInterrupt:
    print("Stopping server...")
    sys.exit(0)
