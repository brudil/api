from django.shortcuts import render
from rest_framework import generics
from apps.shows.models import ShowSlot, ShowPage, ShowSettings
from wagtail.wagtailcore.models import Page
from rest_framework import serializers

class ShowSerializer(serializers.ModelSerializer):
  class Meta:
    model = ShowPage
    fields = (
      'accent_color',
      'title',
    )

class ListShows(generics.ListAPIView):
  serializer_class = ShowSerializer

  def get_queryset(self):
    pages = ShowPage.objects.all()
    return pages

class DetailShow(generics.RetrieveAPIView):
  serializer_class = ShowSerializer
  lookup_field = 'slug'

  def get_queryset(self):
    pages = ShowPage.objects.filter(slug=self.kwargs['slug'])
    return pages
