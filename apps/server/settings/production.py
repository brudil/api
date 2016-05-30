from .base import *
import dj_database_url
import os


DEBUG = False

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

STATICFILES_DIRS = [
    ('assets', os.path.join(BASE_DIR, 'assets/dist')),
]

SECRET_KEY = os.environ['APP_SECRET_KEY']

ALLOWED_HOSTS = ['.herokuapp.com', ]



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
