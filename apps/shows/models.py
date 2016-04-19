from datetime import datetime

from apps.server.models import SingletonPage
from apps.shows.utils import dark_tone_from_accent
from django.conf.urls import url
from django.db import models
from django import forms

from django.shortcuts import render
from django.template.response import TemplateResponse

from modelcluster.fields import ParentalKey
from wagtail.contrib.wagtailroutablepage.models import RoutablePageMixin, route
from wagtail.wagtailcore import blocks

from wagtail.wagtailcore.models import Page, Orderable
from wagtail.wagtailcore.fields import RichTextField, StreamField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, MultiFieldPanel, InlinePanel, StreamFieldPanel
from wagtail.wagtailimages.blocks import ImageChooserBlock
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
from wagtail.wagtailsearch import index
import django.db.models.options as options
options.DEFAULT_NAMES = options.DEFAULT_NAMES + ('description',)

DAY_CHOICES = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday')
)

HOUR_CHOICES = (
    (0, '12 midnight'),
    (1, '1am'),
    (2, '2am'),
    (3, '3am'),
    (4, '4am'),
    (5, '5am'),
    (6, '6am'),
    (7, '7am'),
    (8, '8am'),
    (9, '9am'),
    (10, '10am'),
    (11, '11am'),
    (12, '12pm'),
    (13, '1pm'),
    (14, '2pm'),
    (15, '3pm'),
    (16, '4pm'),
    (17, '5pm'),
    (18, '6pm'),
    (19, '7pm'),
    (20, '8pm'),
    (21, '9pm'),
    (22, '10pm'),
    (23, '11pm'),
)

MINUTES_CHOICES = (
    (0, '0'),
    (1, '15'),
    (2, '30'),
    (3, '45')
)

LENGTH_CHOICES = (
    (0, '15 mins'),
    (1, '30 mins'),
    (2, '45 mins'),
    (3, '1 hour'),
    (4, '90 mins'),
    (5, '2 hours'),
)


class Slot(models.Model):
    day = models.SmallIntegerField(choices=DAY_CHOICES)
    hour = models.SmallIntegerField(choices=HOUR_CHOICES)
    minutes = models.SmallIntegerField(choices=MINUTES_CHOICES)
    length = models.SmallIntegerField(choices=LENGTH_CHOICES)


class ShowSlot(Slot):
    page = ParentalKey('ShowPage', related_name='slots')


class ShowIndexPage(Page):
    class Meta:
        verbose_name = "Show Listings"

    intro = RichTextField(blank=True)

    content_panels = Page.content_panels + [
        FieldPanel('intro', classname="full")
    ]

    subpage_types = ['shows.ShowPage']

    def shows(self):
        return ShowPage.objects.all()


class ShowPage(Page):
    class Meta:
        verbose_name = 'Show'
        description = 'A show microsite'

    description = models.CharField(max_length=140, help_text='Describe the show in a tweet (140 characters)')
    accent_color = models.CharField(max_length=7, blank=True, null=True)

    about_content = StreamField([
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

    facebook_url = models.TextField(blank=True, null=True)
    twitter_handle = models.TextField(blank=True, null=True)

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full"),
        StreamFieldPanel('about_content')
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
        InlinePanel('slots'),
        MultiFieldPanel([
            ImageChooserPanel('logo'),
            FieldPanel('accent_color', widget=forms.TextInput(attrs={'type': 'color', 'style': 'height: 50px'}))
        ], 'Show branding'),
        MultiFieldPanel([
            FieldPanel('facebook_url'),
            FieldPanel('twitter_handle')
        ], 'Social Pages')
    ]

    parent_page_types = ['shows.ShowIndexPage']
    subpage_types = ['shows.ShowAudioSeriesIndexPage', 'shows.ShowContentPage']

    def get_human_time(self):
        slots = self.slots.all()
        slots_human = []

        for slot in slots:
            time_display = '{hour}{mins}{period}'.format(
                hour=slot.hour % 12,
                mins=':{}'.format((0, 15, 30, 45)[slot.minutes]) if slot.minutes != 0 else '',
                period='am' if slot.hour < 12 else 'pm'
            )
            relative = ((slot.day - datetime.now().weekday()) + 7) % 7
            relative_word = 'Every'
            if relative == 0:
                relative_word = 'Today, and every'
            elif relative == 1:
                relative_word = 'Tomorrow, and every'

            slots_human.append('{} {day}{relative_coma} at {time}'.format(
                relative_word,
                day=slot.get_day_display(),
                relative_coma=',' if relative == 1 or relative == 0 else '',
                time=time_display))

        return ', '.join(slots_human)

    def generate_branding_style(self):
        styles = []

        if self.accent_color is not None and self.accent_color != '#000000':
            styles.append('background-color:{}'.format(self.accent_color))

        return ';'.join(styles)

    def has_accent_color(self):
        return self.accent_color is not None and self.accent_color != '#000000'

    def tone_from_accent(self):
        if self.has_accent_color() is False:
            return 'dark'

        dark_tone = dark_tone_from_accent(self.accent_color[1:])
        return 'dark' if dark_tone else 'light'


class ShowContentPage(Page):
    body = StreamField([
        ('heading', blocks.CharBlock(classname="full title")),
        ('paragraph', blocks.RichTextBlock()),
        ('image', ImageChooserBlock()),
    ])

    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration")
    ]


class ShowAudioSeriesIndexPage(SingletonPage, Page):
    class Meta:
        verbose_name = 'Show Audio Series Listing'
        description = 'A chronological list of audio files; for podcasts or previous episodes'

    is_podcast = models.BooleanField(default=False)

    content_panels = Page.content_panels + [
    ]

    settings_panels = Page.settings_panels + [
        FieldPanel('is_podcast')
    ]

    subpage_types = ['shows.ShowAudioSeriesEpisodePage']


class ShowAudioSeriesEpisodePage(Page):
    class Meta:
        verbose_name = "Show Audio Series Episode"

    description = RichTextField()

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full")
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration")
    ]

    parent_page_types = ['shows.ShowAudioSeriesIndexPage']

