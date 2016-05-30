from .base import *
import dj_database_url
import os

DEBUG = False

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

AWS_QUERYSTRING_AUTH = False
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')

STATICFILES_DIRS = [
    ('assets', os.path.join(BASE_DIR, 'assets/dist')),
]

SECRET_KEY = os.environ['APP_SECRET_KEY']

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = ['.herokuapp.com', ]

INSTALLED_APPS += (
    'raven.contrib.django.raven_compat',
    'storages',
)

RAVEN_CONFIG = {
    'dsn': 'https://bd9d7b99d3ab42888922c50d4e72e195:85e192d037ef4c66836436cedc4d74b9@app.getsentry.com/80573',
    # If you are using git, you can also automatically configure the
    # release based on the git info.
    'release': os.environ.get('HEROKU_SLUG_COMMIT', 'unknown'),
}

manifest = open(os.path.join(BASE_DIR, 'assets/dist/assets.json'))
WEBPACK_ASSET_MANIFEST = json.load(manifest)

STATIC_URL = '{}/static/'.format(os.environ['ASSETS_URL'])
MEDIA_URL = '{}/media/'.format(os.environ['ASSETS_URL'])


def asset_resolver(name):
    bundle, file = name.split('.')
    return WEBPACK_ASSET_MANIFEST[bundle][file]


WEBPACK_ASSET_RESOLVER = asset_resolver

try:
    from .local import *
except ImportError:
    pass
