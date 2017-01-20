from django.conf.urls import include, url
from django.conf import settings
from django.contrib import admin

from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailcore import urls as wagtail_urls
from .views import ListShows, DetailShow

from apps.server import views as sever_views
from apps.search import views as search_views
from apps.schedule import views as schedule_views
from apps.player import urls as player_urls
from apps.shows import urls as show_urls


api = [
    url(r'^$', ListShows.as_view(), name='api_list_shows'),
    url(r'^(?P<slug>[-\w]+)$', DetailShow.as_view(), name='api_detail_show'),
]
