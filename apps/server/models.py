from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.wagtailadmin.edit_handlers import InlinePanel, FieldPanel, PageChooserPanel
from wagtail.wagtailcore.models import Orderable, Page
from wagtail.wagtailsearch import index
from wagtail.wagtailsnippets.models import register_snippet


class SingletonPage(object):
    @classmethod
    def can_exist_under(cls, parent):
        has_singleton_already = cls in [child.specific_class for child in parent.get_children()]
        return cls in parent.specific_class.allowed_subpage_models() and not has_singleton_already


@register_setting
class SocialMediaSettings(BaseSetting):
    facebook = models.URLField(
        help_text='Facebook page URL')
    twitter_handle = models.CharField(
        max_length=30,
        help_text='@twitter handel (sans @)')


@register_setting
class AnalyticsSettings(BaseSetting):
    ga_property_id = models.CharField(
        max_length=20,
        help_text='UA-XXXXX-X')

@register_snippet
class Menu(ClusterableModel):
    name = models.CharField(max_length=40)

    panels = [
        FieldPanel('name'),
        InlinePanel('items')
    ]

    def __str__(self):
        return self.name


class MenuItem(Orderable, models.Model):
    page = ParentalKey(Page)
    title = models.CharField(max_length=80)
    menu = ParentalKey(Menu, related_name='items')

    panels = [
        PageChooserPanel('page'),
        FieldPanel('title')
    ]

    def __str__(self):
        return self.page.title + " -> " + self.menu.name


@register_setting
class MenuSettings(BaseSetting):
    header_menu = ParentalKey(Menu, null=True)
