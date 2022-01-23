from .base import *

ENVIRON_TYPE = 'development'
DEBUG = True

# ==============================================================================
# DATABASE SETTINGS
# ==============================================================================
DATABASES = {
    'default': {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        "PORT": "5432",
    }
}



# ==============================================================================
# EMAIL SETTINGS
# ==============================================================================

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"