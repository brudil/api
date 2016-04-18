from __future__ import unicode_literals

from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.wagtailadmin.edit_handlers import StreamFieldPanel, FieldPanel, InlinePanel, PageChooserPanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.blocks import PageChooserBlock
from wagtail.wagtailcore.fields import StreamField

from wagtail.wagtailcore.models import Page, Orderable
from wagtail.wagtailimages.blocks import ImageChooserBlock
from wagtail.wagtailsnippets.models import register_snippet


class HomePage(Page):

    content_panels = Page.content_panels + [
        InlinePanel('slides')
    ]


class HomePageSlider(Orderable):
    page = ParentalKey(HomePage, related_name='slides')
    title = models.CharField(max_length=255, blank=True)
    copy = models.TextField(blank=True, null=True)

    link_page = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
    )

    panels = [
        FieldPanel('title'),
        FieldPanel('copy'),
        PageChooserPanel('link_page'),
    ]
