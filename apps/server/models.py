from django.db import models
from wagtail.contrib.settings.models import BaseSetting, register_setting


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
