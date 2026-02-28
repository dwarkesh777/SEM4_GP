import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')
django.setup()

from api.models import Property

print("Attempting to fetch first Property...")
try:
    p = Property.objects.first()
    if p:
        print(f"Found Property: {p.name}")
        print(f"ID: {p.id}, Type: {type(p.id)}")
    else:
        print("No Properties found.")
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
