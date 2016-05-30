from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag()
def webpack_asset(name):
    resolver = settings.WEBPACK_ASSET_RESOLVER
    return resolver(name)
