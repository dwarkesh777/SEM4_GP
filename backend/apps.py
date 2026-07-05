from django.contrib.auth.apps import AuthConfig
from django.contrib.contenttypes.apps import ContentTypesConfig


class MongoAuthConfig(AuthConfig):
    """auth app config that uses MongoDB's ObjectIdAutoField as the
    default primary key instead of Django's default AutoField, which
    MongoDB does not support (mongodb.E001)."""
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"


class MongoContentTypesConfig(ContentTypesConfig):
    """contenttypes app config that uses MongoDB's ObjectIdAutoField as
    the default primary key instead of Django's default AutoField, which
    MongoDB does not support (mongodb.E001)."""
    default_auto_field = "django_mongodb_backend.fields.ObjectIdAutoField"
