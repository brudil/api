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
  const shiftedDates = [6, 0, 1, 2, 3, 4, 5];
  return shiftedDates[momentObject.day()];
}

export function getOnAirSlot(slots) {
  const byDay = chunkSlotsByDay(slots);
  const todaySlots = byDay[momentWeekDayMonday(moment())];

  for (const [index, slot] of todaySlots.entries()) {
    const fromTime = moment(slot.from_time);
    const toTime = moment(slot.to_time);

    if (slot.is_overnight && index === 0) {
      fromTime.subtract(1, 'days');
    }

    if (slot.is_overnight && index === todaySlots.length - 1) {
      toTime.add(1, 'days');
    }

    if (moment().isBetween(fromTime, toTime)) {
      return slot;
    }
  }

  return null;
}


export function slotIsOnAt(slot, momentObject, listPosition) {
  const fromTime = moment(slot.from_time);
  const toTime = moment(slot.to_time);

  if (slot.is_overnight && listPosition === 0) {
    fromTime.subtract(1, 'days');
  }

  if (slot.is_overnight && listPosition === 1) {
    toTime.add(1, 'days');
  }

  return momentObject.isBetween(fromTime, toTime);
}
