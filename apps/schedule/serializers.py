from rest_framework import serializers
from apps.shows.models import ShowSlot


class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowSlot
        fields = (

        )
