import moment from 'moment';

export function chunkSlotsByDay(slots) {
  const days = [[], [], [], [], [], [], []];
  for (const slot of slots) {
    if (slot.is_overnight) {
      const midnight = moment().startOf('day').add(1, 'day');
      const slotDurationToMidnight = moment(slot.from_time);
      const diffMins = moment.duration(midnight.diff(slotDurationToMidnight)).asMinutes();

      days[slot.day].push(Object.assign({}, slot, { duration: diffMins }));

      if (slot.day !== 6) {
        days[(slot.day + 1)].push(
          Object.assign({}, slot, { duration: slot.duration - diffMins })
        );
      }
    } else {
      days[slot.day].push(slot);
    }
  }

  return days;
}

export function calculateWidth(number, includeUnit = true) {
  const width = 3600;
  const totalMinutes = 24 * 60;
  const widthPerMinute = width / totalMinutes;

  if (!includeUnit) {
    return number * widthPerMinute;
  }

  return `${number * widthPerMinute}px`;
}

export function momentWeekDayMonday(momentObject) {
  return ((momentObject.day() + 5) % 6);
}

export function getOnAirSlot(slots) {
  const byDay = chunkSlotsByDay(slots);
  const todaySlots = byDay[momentWeekDayMonday(moment())];

  for (const slot of todaySlots) {
    if (moment().isBetween(moment(slot.from_time), moment(slot.to_time))) {
      return slot;
    }
  }

  return null;
}
