from apps.shows.models import ShowPage, ShowIndexPage
from django import template
from wagtail.wagtailcore.models import Page

register = template.Library()


@register.simple_tag()
def get_show(page):
    if type(page) is not ShowPage:
        page = Page.objects.ancestor_of(page).type(ShowPage).first()

    page = page.specific

    return page
