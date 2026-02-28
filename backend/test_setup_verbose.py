import os
import django
from django.conf import settings
from django.utils.log import configure_logging
from django.urls import set_script_prefix
from django.apps import apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nestnode_backend.settings')

print("Configuring settings manually...")
if not settings.configured:
    settings._setup()

print("Step 1: configure_logging...")
try:
    configure_logging(settings.LOGGING_CONFIG, settings.LOGGING)
    print("configure_logging successful")
except Exception as e:
    print(f"configure_logging error: {e}")

print("Step 2: set_script_prefix...")
try:
    set_script_prefix("/" if settings.FORCE_SCRIPT_NAME is None else settings.FORCE_SCRIPT_NAME)
    print("set_script_prefix successful")
except Exception as e:
    print(f"set_script_prefix error: {e}")

print("Step 3: apps.populate...")
try:
    apps.populate(settings.INSTALLED_APPS)
    print("apps.populate successful")
except Exception as e:
    print(f"apps.populate error: {e}")

print("All steps finished. Now trying django.setup() directly...")
django.setup()
print("django.setup() successful!")
