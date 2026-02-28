import os
import sys
from wsgiref.simple_server import make_server
from django.core.wsgi import get_wsgi_application

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')

def run():
    print("Starting simple server on http://0.0.0.0:8000...")
    try:
        application = get_wsgi_application()
        httpd = make_server('0.0.0.0', 8000, application)
        print("Server is running. Press Ctrl+C to stop.")
        httpd.serve_forever()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run()
