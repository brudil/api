from datetime import datetime

from apps.server.models import SingletonPage
from apps.shows.utils import dark_tone_from_accent
from django.db import models
from django import forms
from django.utils.dateformat import TimeFormat
from modelcluster.fields import ParentalKey
from wagtail.contrib.settings.models import BaseSetting, register_setting
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import RichTextField, StreamField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, MultiFieldPanel, InlinePanel, StreamFieldPanel
from wagtail.wagtailimages.blocks import ImageChooserBlock
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
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


class Slot(models.Model):
    day = models.SmallIntegerField(choices=DAY_CHOICES)
    from_time = models.TimeField(null=False, verbose_name='From')
    to_time = models.TimeField(null=False, verbose_name='To')

    def clean(self):
        if self.from_time >= self.to_time:
            pass
            # raise ValidationError('Show slot can not exist in negative time')


class ShowSlot(Slot):
    class Meta:
        verbose_name = 'Slot'

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
    accent_color = models.CharField(max_length=7, blank=True, null=True, verbose_name='Accent color')

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

    social_facebook_url = models.TextField(blank=True, null=True, verbose_name='Facebook URL')
    social_twitter_handle = models.TextField(blank=True, null=True, verbose_name='Twitter handle')
    social_mixcloud_handle = models.TextField(blank=True, null=True, verbose_name='Mixcloud handle')
    social_soundcloud_handle = models.TextField(blank=True, null=True, verbose_name='Soundcloud handle')
    social_youtube_url = models.TextField(blank=True, null=True, verbose_name='YouTube URL')

    feature_interaction = models.BooleanField(
        default=False,
        verbose_name='Interaction',
        help_text='Interaction promotes the URF Text number and @urfstudio in the Player.',
    )

    content_panels = Page.content_panels + [
        FieldPanel('description', classname="full"),
        StreamFieldPanel('about_content')
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
        InlinePanel('slots', label='Scheduling Slots'),
        MultiFieldPanel([
            ImageChooserPanel('logo'),
            FieldPanel('accent_color', widget=forms.TextInput(attrs={'type': 'color', 'style': 'height: 50px'}))
        ], 'Branding & design'),
        MultiFieldPanel([
            FieldPanel('feature_interaction'),
        ], heading='Features'),
        MultiFieldPanel([
            FieldPanel('social_facebook_url'),
            FieldPanel('social_twitter_handle'),
            FieldPanel('social_mixcloud_handle'),
            FieldPanel('social_soundcloud_handle'),
            FieldPanel('social_youtube_url'),
        ], heading='Social Pages')
    ]

    parent_page_types = ['shows.ShowIndexPage']
    subpage_types = ['shows.ShowAudioSeriesIndexPage', 'shows.ShowContentPage']

    def has_social(self):
        return self.social_facebook_url\
            or self.social_twitter_handle\
            or self.social_mixcloud_handle\
            or self.social_soundcloud_handle\
            or self.social_youtube_url

    def get_human_time(self):
        slots = self.slots.all()
        slots_human = []

        for slot in slots:
            time_display = TimeFormat(slot.from_time).format('g:i a')
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

    def name_group(self):
        return self.title and self.title[0] or ''


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

    def get_show(self):
        for page in Page.objects.ancestor_of(self).specific():
            if isinstance(page, ShowPage):
                return page


@register_setting
class ShowSettings(BaseSetting):
    automation_show = ParentalKey(ShowPage, null=True, related_name='automation')
