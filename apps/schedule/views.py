import datetime
from collections import namedtuple

from django.shortcuts import render
from django.http import JsonResponse
from apps.shows.models import ShowSlot, ShowPage, ShowSettings
from wagtail.wagtailcore.models import Page

AutomationSlot = namedtuple('AutomationSlot', ['day', 'from_time', 'to_time'])


def serialize_slot(slot, automation_page):
    now = datetime.datetime.now(datetime.timezone.utc)
    from_time = datetime.datetime.combine(now, slot.from_time)
    to_time = datetime.datetime.combine(now, slot.to_time)

    serial = {
        'day': slot.day,
        'sort_key': slot_sort(slot),
        'from_time': from_time.isoformat(),
        'to_time': to_time.isoformat(),
        'is_overnight': to_time < from_time,
        'duration': (to_time - from_time).seconds / 60,
    }

    if isinstance(slot, ShowSlot):
        serial['show'] = slot.page.pk
        serial['id'] = slot.pk
    else:
        serial['show'] = automation_page.pk

    return serial


def serialize_show(show):
    return {
        'title': show.title,
        'accent': show.accent_color if show.has_accent_color() else None,
        'tone': show.tone_from_accent() if show.has_accent_color else None,
        'logo': show.logo.usage_url if show.logo else None,
        'page_url': show.url
    }


def slot_sort(slot):
    return (slot.day + 1) * 100 + slot.from_time.hour + (slot.from_time.minute / 100.0)


def api_schedule(request):
    data = {
        'slots': [],
        'shows': {}
    }

    all_slots = ShowSlot.objects.all()

    sorted_by_time = sorted(all_slots, key=slot_sort)

    previous_slot_to_time = datetime.time(hour=0, minute=0)
    previous_slot_day = 0
    slots = []
    for slot in sorted_by_time:
        if previous_slot_to_time != slot.from_time:
            slots.append(AutomationSlot(from_time=previous_slot_to_time, to_time=slot.from_time, day=previous_slot_day))

        slots.append(slot)

        previous_slot_day = slot.day
        previous_slot_to_time = slot.to_time
        data['shows'][slot.page.pk] = serialize_show(slot.page)

    first_slot = slots[0]
    if previous_slot_to_time != first_slot.from_time:
        slots.append(AutomationSlot(from_time=previous_slot_to_time, to_time=first_slot.from_time, day=previous_slot_day))

    automation_page = ShowSettings.for_site(request.site).automation_show
    data['shows'][automation_page.id] = serialize_show(automation_page)

    data['slots'] = [serialize_slot(slot, automation_page=automation_page) for slot in slots]

    return JsonResponse(data)

# api stuff
# now and next


# full schedule


# day schedule

