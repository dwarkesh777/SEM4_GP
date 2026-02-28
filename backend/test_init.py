import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property, Room
print("Django setup successful")

try:
    p_count = Property.objects.count()
    print(f"Property count: {p_count}")
except Exception as e:
    print(f"Database access error: {e}")

try:
    from django.core.servers.basehttp import get_internal_wsgi_application
    app = get_internal_wsgi_application()
    print("WSGI application initialized")
except Exception as e:
    print(f"WSGI error: {e}")
