import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')

from django.apps import apps
from django.conf import settings as django_settings

print("Loading apps one by one...")
for app in django_settings.INSTALLED_APPS:
    print(f"Loading {app}...")
    try:
        # This is a bit simplified, but let's see
        import importlib
        importlib.import_module(app)
        print(f"Successfully imported {app}")
    except Exception as e:
        print(f"Error importing {app}: {e}")

print("Now attempting apps.populate()...")
# We need to configure settings first
if not django_settings.configured:
    django_settings._setup()

try:
    apps.populate(django_settings.INSTALLED_APPS)
    print("Apps populated successfully!")
except Exception as e:
    print(f"Error populating apps: {e}")
