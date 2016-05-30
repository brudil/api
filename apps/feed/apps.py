from django.apps import AppConfig


class FeedConfig(AppConfig):
    name = 'apps.feed'

    def ready(self):
        import apps.feed.signals
