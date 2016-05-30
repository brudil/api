from .base import *
import dj_database_url
import os
import raven

DEBUG = False

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

STATICFILES_DIRS = [
    ('assets', os.path.join(BASE_DIR, 'assets/dist')),
]

SECRET_KEY = os.environ['APP_SECRET_KEY']

ALLOWED_HOSTS = ['.herokuapp.com', ]


INSTALLED_APPS += (
    'raven.contrib.django.raven_compat',
)

RAVEN_CONFIG = {
    'dsn': 'https://bd9d7b99d3ab42888922c50d4e72e195:85e192d037ef4c66836436cedc4d74b9@app.getsentry.com/80573',
    # If you are using git, you can also automatically configure the
    # release based on the git info.
    'release': os.environ['HEROKU_SLUG_COMMIT'],
}

manifest = open(os.path.join(BASE_DIR, 'assets/dist/assets.json'))
WEBPACK_ASSET_MANIFEST = json.load(manifest)

def asset_resolver(name):
    bundle, file = name.split('.')
    return WEBPACK_ASSET_MANIFEST[bundle][file]


WEBPACK_ASSET_RESOLVER = asset_resolver

try:
    from .local import *
except ImportError:
    pass
