import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property

print("Attempting to count Property records...")
try:
    count = Property.objects.count()
    print(f"Property count: {count}")
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
