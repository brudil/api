from django.db import models
from wagtail.wagtailadmin.edit_handlers import FieldPanel, MultiFieldPanel
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailcore.models import Page


class BasicContentPage(Page):
    class Meta:
        verbose_name = 'Content Page'

    content = RichTextField()

    content_panels = Page.content_panels + [
        FieldPanel('content', classname="full"),
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ]

