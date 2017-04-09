from graphene_django import DjangoObjectType
from wagtail.wagtailcore.fields import StreamField
from wagtail.wagtailimages.models import Image, Filter
from taggit.managers import TaggableManager
import graphene
from apps.shows.models import ShowPage, ShowSlot
from graphene_django.converter import convert_django_field

@convert_django_field.register(StreamField)
def convert_stream_field(field, registry=None):
    return "hello there"

@convert_django_field.register(TaggableManager)
def convert_taggable_manager(field, registry=None):
    return "hello there"


class WagtailImage(DjangoObjectType):
    url = graphene.String(width=graphene.Int())

    def resolve_url(self, args, context, info):
        filter = Filter()
        filter.spec = 'width-{}'.format(args.get('width'))
        return self.get_rendition(filter).url

    class Meta:
      model = Image


class SlotType(DjangoObjectType):
    class Meta:
        model = ShowSlot


class ShowType(DjangoObjectType):
    about_content = graphene.String()
    tone = graphene.String()
    logo = graphene.Field(WagtailImage)
    slots = graphene.List(SlotType)

    def resolve_slots(self, args, context, info):
        return self.slots.all()

    class Meta:
          model = ShowPage


class Query(graphene.ObjectType):
    all_shows = graphene.List(ShowType, )
    all_slots = graphene.List(SlotType, )
    show = graphene.Field(ShowType, slug=graphene.String())

    def resolve_show(self, args, context, info):
        slug = args.get('slug')
        return ShowPage.objects.get(slug=slug)

    def resolve_all_shows(self, args, context, info):
        return ShowPage.objects.all()

    def resolve_all_slots(self, args, context, info):
        return ShowSlot.objects.all()

schema = graphene.Schema(query=Query)
