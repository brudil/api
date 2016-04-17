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


DAY_CHOICES = (
    (0, 'Monday'),
    (1, 'Tuesday'),
    (2, 'Wednesday'),
    (3, 'Thursday'),
    (4, 'Friday'),
    (5, 'Saturday'),
    (6, 'Sunday')
)

HOUR_CHOICES = tuple((hour, '{}{}'.format(hour % 12, 'am' if hour < 12 else 'pm')) for hour in range(24))

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


class ShowPage(Page):
    class Meta:
        verbose_name = "Show"

    description = RichTextField()
    accent_color = models.CharField(max_length=7, blank=True, null=True)

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
        FieldPanel('description', classname="full")
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
    subpage_types = ['shows.ShowEpisodeIndexPage', 'shows.ShowContentPage']

    def get_human_time(self):
        slots = self.slots.all()
        slots_human = []

        for slot in slots:
            slots_human.append('every {day} at {hour}'.format(day=slot.day, hour=slot.hour))

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

class SingletonPage(object):
    @classmethod
    def can_exist_under(cls, parent):
        has_singleton_already = cls in [child.specific_class for child in parent.get_children()]
        return cls in parent.specific_class.allowed_subpage_models() and not has_singleton_already


class ShowEpisodePage(Page):
    class Meta:
        verbose_name = "Show Episode"

    description = RichTextField()

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full")
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration")
    ]

    parent_page_types = ['shows.ShowEpisodeIndexPage']

    def route(self, request, path_components):
        print(path_components)
        return super().route(request, path_components)


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


class ShowEpisodeIndexPage(SingletonPage, Page):
    class Meta:
        verbose_name = "Show Episode Listings"

    content_panels = Page.content_panels + [
    ]

    subpage_types = ['shows.ShowEpisodePage']

    def shows(self):
        return ShowPage.objects.all()


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
