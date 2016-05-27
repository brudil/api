import React from 'react';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import moment from 'moment';

function chunkSlotsByDay(slots) {
  const days = [[], [], [], [], [], [], []];
  for (let [index, slot] of slots.entries()) {


    if (slot.is_overnight) {

      const midnight = moment().startOf('day').add(1, 'day');
      const slotDurationToMidnight = moment(slot.from_time);
      const diffMins = moment.duration(midnight.diff(slotDurationToMidnight)).asMinutes();

      days[slot.day].push(Object.assign({}, slot, {duration: diffMins}));
      days[slot.day + 1 % 6].push(Object.assign({}, slot, {duration: slot.duration - diffMins}));
    } else {
      days[slot.day].push(slot);
    }
  }

  return days;
}


export default function FullSchedule(props) {

  if (!props.data) {
    return <h2>Loading</h2>;
  }

  function calculateWidth(number) {
    const width = 3600;
    const totalMinutes = 24 * 60;
    const widthPerMinute = width / totalMinutes;
    return `${number * widthPerMinute}px`;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slotsByDay = chunkSlotsByDay(props.data.slots);
  console.log(slotsByDay);
  return (
    <div className="Schedule">
      <div className="Schedule__scroll">
        <ScheduleTimeline calculateWidth={calculateWidth}/>
        {days.map((day, index) => {
          return (
            <div className="Schedule__day-row" key={index}>
              <ScheduleDayRow title={day} shows={props.data.shows} slots={slotsByDay[index]} calculateWidth={calculateWidth} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
