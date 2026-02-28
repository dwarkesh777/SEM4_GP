from nestnode_backend.settings import *

# Stripped down version
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'rest_framework',
    'api',
]

MIDDLEWARE = [
    'django.contrib.auth.middleware.AuthenticationMiddleware',
]

DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_backend',
        'NAME': 'nestnode_db_v2',
        'HOST': os.getenv('MONGODB_URI'),
    }
}
