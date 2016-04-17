from django.db import models
from wagtail.contrib.settings.models import BaseSetting, register_setting


@register_setting
class SocialMediaSettings(BaseSetting):
    facebook = models.URLField(
        help_text='Facebook page URL')
    twitter_handle = models.CharField(
        max_length=30,
        help_text='@twitter handel (sans @)')
