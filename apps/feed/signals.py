from wagtail.wagtailcore.signals import page_published
from .models import FeedItem, FEED_TYPE_NEW_EPISODE
from apps.shows.models import ShowAudioSeriesEpisodePage


def create_new_episode_feed_item(sender, **kwargs):
    episode_page = kwargs['instance']
    FeedItem(
        type=FEED_TYPE_NEW_EPISODE,
        prop=episode_page,
        actor=episode_page.get_show(),
    ).save()

page_published.connect(create_new_episode_feed_item,
                       sender=ShowAudioSeriesEpisodePage,
                       dispatch_uid='create_new_episode_feed_item'
                       )
