from django.db import models
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.wagtailadmin.edit_handlers import PageChooserPanel, FieldPanel


@register_setting
class GlobalAnnouncementSettings(BaseSetting):
    is_enabled = models.BooleanField(default=False)

    content = models.TextField(help_text='Content of announcement')

    link_page = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    show_dismiss = models.BooleanField(default=True)
    dismiss_key = models.CharField(max_length=12)

    panels = [
        FieldPanel('is_enabled'),
        FieldPanel('content'),
        FieldPanel('show_dismiss'),
        FieldPanel('dismiss_key'),
        PageChooserPanel('link_page')
    ]
