from django.db import models
from wagtail.wagtailadmin.edit_handlers import StreamFieldPanel, MultiFieldPanel, FieldPanel
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.fields import StreamField, RichTextField
from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.rich_text import RichText
from wagtail.wagtailimages.blocks import ImageChooserBlock


class NewsEventsIndexPage(Page):
    class Meta:
        verbose_name = "News & Events"

    subpage_types = ['news.NewsArticlePage', 'news.EventPage']

    def news(self):
        return NewsArticlePage.objects.all()

    def events(self):
        return EventPage.objects.all()


class NewsArticlePage(Page):
    class Meta:
        verbose_name = 'News Article'

    content = StreamField([
        ('paragraph', blocks.RichTextBlock()),
        ('image', ImageChooserBlock())
    ])

    logo = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        StreamFieldPanel('content')
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ]

    parent_page_types = ['news.NewsEventsIndexPage']
    subpage_types = ['shows.ShowAudioSeriesIndexPage', 'shows.ShowContentPage']


class EventPage(Page):
    class Meta:
        verbose_name = 'Event'

    description = RichTextField()
    location = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    facebook_event = models.URLField(null=True, blank=True, verbose_name='Facebook Event URL')
    ussu_event = models.URLField(null=True, blank=True, verbose_name='Students Union Event Page URL')

    featured_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    content_panels = Page.content_panels + [
        FieldPanel('featured_image'),
        FieldPanel('location'),
        FieldPanel('start_date'),
        FieldPanel('end_date'),
        FieldPanel('description'),
        FieldPanel('facebook_event'),
        FieldPanel('ussu_event'),
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ]

    parent_page_types = ['news.NewsEventsIndexPage']
    subpage_types = ['shows.ShowAudioSeriesIndexPage', 'shows.ShowContentPage']
