from .base import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

for template_engine in TEMPLATES:
    template_engine['OPTIONS']['debug'] = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '-gkm71@qund10=%&wiosj@rt@#4z9g1dpck^ws(=jz36atdpxg'


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


def asset_resolver(name):
    return 'http://localhost:8080/build/{}'.format(name)


WEBPACK_ASSET_RESOLVER = asset_resolver

try:
    from .local import *
except ImportError:
    pass
