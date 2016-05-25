import React from 'react';
import moment from 'moment';

export default function ScheduleTimeline(props) {
  const hours = [
    'midnight',
    '1am',
    '2am',
    '3am',
    '4am',
    '5am',
    '6am',
    '7am',
    '8am',
    '9am',
    '10am',
    '11am',
    '12pm',
    '1pm',
    '2pm',
    '3pm',
    '4pm',
    '5pm',
    '6pm',
    '7pm',
    '8pm',
    '9pm',
    '10pm',
    '11pm'
  ];

  const midnight = moment().startOf('day')
  const now = moment();
  const minutesFromMidnight = moment.duration(now.diff(midnight)).asMinutes();

  return (
    <div className="ScheduleTimeline">
      <div className="ScheduleTimeline__bookmark" style={{left: props.calculateWidth(minutesFromMidnight)}}></div>
      {hours.map(hour => {
        return <div className="ScheduleTimeline__hour" key={hour} style={{width: props.calculateWidth(60)}}>{hour}</div>
      })}
    </div>
  );
}
