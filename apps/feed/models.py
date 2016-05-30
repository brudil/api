from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.wagtailcore.models import Page

FEED_TYPE_NEW_POST = 'NEW_POST'
FEED_TYPE_NEW_EPISODE = 'NEW_EPISODE'

FEED_ITEM_CHOICES = (
    (FEED_TYPE_NEW_POST, 'New Post'),
    (FEED_TYPE_NEW_EPISODE, 'New Episode'),
)


class FeedItem(models.Model):
    actor = ParentalKey(Page, related_name='feed_actors')
    prop = ParentalKey(Page, null=True, related_name='feed_props')
    type = models.CharField(max_length=20, choices=FEED_ITEM_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
