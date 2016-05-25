import datetime

from django.shortcuts import render
from django.http import JsonResponse
from apps.shows.models import ShowSlot


def schedule(request):
    return render(request, 'schedule/schedule.html')


def serialize_slot(slot):
    now = datetime.datetime.now()
    from_time = datetime.datetime.combine(now, slot.from_time)
    to_time = datetime.datetime.combine(now, slot.to_time)

    return {
        'id': slot.pk,
        'from_time': from_time.isoformat(),
        'to_time': to_time.isoformat(),
        'show': slot.page.pk
    }


def serialize_show(show):
    return {
        'title': show.title,
        'accent': show.accent_color if show.has_accent_color() else None,
        'tone': show.tone_from_accent() if show.has_accent_color else None,
        'logo': show.logo.usage_url if show.logo else None,
        'page_url': show.url
    }


def api_schedule(request):
    data = {
        'slots': {},
        'shows': {}
    }

    all_slots = ShowSlot.objects.all()

    for slot in all_slots:
        if slot.day not in data['slots']:
            data['slots'][slot.day] = []
        data['slots'][slot.day].append(serialize_slot(slot))
        data['shows'][slot.page.pk] = serialize_show(slot.page)

    return JsonResponse(data)

# api stuff
# now and next


# full schedule


# day schedule

