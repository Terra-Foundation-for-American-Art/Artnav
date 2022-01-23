from .base import *

ENVIRON_TYPE = 'production'
DEBUG = False

# ==============================================================================
# DATABASE SETTINGS
# ==============================================================================
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL')
    )
}


# ==============================================================================
# MEDIA / FILE STORAGE
# ==============================================================================
MEDIAFILES_LOCATION = 'media'
DEFAULT_FILE_STORAGE = 'artnav.custom_storages.MediaStorage'
MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)

STATICFILES_DIRS = (
  os.path.join(BASE_DIR, "../artnav/static"),
  os.path.join(BASE_DIR, '../dist')
)
STATIC_URL = '/static/'


# ==============================================================================
# SECURITY SETTINGS
# ==============================================================================

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

SECURE_HSTS_SECONDS = 60 * 60 * 24 * 7 * 52  # one year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_SSL_REDIRECT = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SESSION_COOKIE_SECURE = True


# ==============================================================================
# heroku logging
# ==============================================================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'ERROR'),
        },
    },
}
