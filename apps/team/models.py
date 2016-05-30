from django.db import models
from modelcluster.fields import ParentalKey
from wagtail.wagtailadmin.edit_handlers import MultiFieldPanel, InlinePanel, FieldPanel
from wagtail.wagtailcore.models import Orderable, Page
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
from wagtail.wagtailsnippets.edit_handlers import SnippetChooserPanel


class TeamMember(Orderable, models.Model):
    page = ParentalKey('team.TeamPage', related_name='team_members')
    name = models.CharField(max_length=80)
    job_title = models.CharField(max_length=80)
    bio = models.TextField()
    picture = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    panels = [
        FieldPanel('name'),
        FieldPanel('job_title'),
        FieldPanel('bio', classname='full'),
        ImageChooserPanel('picture'),
    ]

    def __str__(self):
        return self.page.title + " -> " + self.team_member.name


class TeamPage(Page):
    class Meta:
        verbose_name = 'Team Page'
        description = 'Page listing URF team members'

    content_panels = Page.content_panels + [
        InlinePanel('team_members'),
    ]

    promote_panels = [
        MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ]
