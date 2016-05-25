import React from 'react';
import DayRowSchedule from './DayRowSchedule';

export default function FullSchedule(props) {

  if (!props.data) {
    return <h2>Loading</h2>;
  }

  function calculateWidth(number) {
    const width = 4800;
    const totalMinutes = 24 * 60;
    const widthPerMinute = width / totalMinutes;
    return `${number * widthPerMinute}px`;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <div className="FullSchedule">
      {days.map((day, index) => {
        return (
          <div className="FullSchedule__day-row" key={index}>
            <div className="FullSchedule__day-row-heading">{day}</div>
            <DayRowSchedule shows={props.data.shows} slots={props.data.slots[index]} calculateWidth={calculateWidth} />
          </div>
        );
      })}
    </div>
  );
}
