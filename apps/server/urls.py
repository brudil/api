from django.conf.urls import include, url
from django.conf import settings
from django.contrib import admin

from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailcore import urls as wagtail_urls
from .api import api_router

from apps.server import views as sever_views
from apps.search import views as search_views
from apps.schedule import views as schedule_views
from apps.player import urls as player_urls
from apps.shows import urls as show_urls


urlpatterns = [
    url(r'^django-admin/', include(admin.site.urls)),

    url(r'^admin/', include(wagtailadmin_urls)),
    url(r'^documents/', include(wagtaildocs_urls)),
    url(r'^player/', include(player_urls)),

    url(r'^404/$', sever_views.four_oh_four, name='404'),
    url(r'^api/shows/', include(show_urls.api), name='api_shows'),
    url(r'^api/schedule$', schedule_views.api_schedule, name='api_schedule'),
    url(r'^api/current_show$', schedule_views.api_current_show, name='api_current_show'),
    url(r'^api/v2/', api_router.urls),

    url(r'^search/$', search_views.search, name='search'),

    url(r'', include(wagtail_urls)),
]


if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    from django.views.generic import TemplateView

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
