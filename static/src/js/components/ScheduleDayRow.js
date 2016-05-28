import React from 'react';
import moment from 'moment';
import ScheduleSlot from './ScheduleSlot';

function DayRowSchedule(props) {
  const { shows, slots, calculateWidth, title } = props;

  if (slots === undefined) {
    return (<div>Nothing is scheduled.</div>);
  }

  //const isOnAir = props.day

  return (
    <div className="ScheduleRow">
      <div className="ScheduleRow__title">
        <div className="ScheduleRow__title-inner">
          {title}
        </div>
      </div>
      <div className="ScheduleRow__inner">
        <div className="ScheduleRow__slots">
          {slots.map((slot, index) => {
            const fromTimeFormatted = moment(slot.from_time).format('hh:mm');
            const toTimeFormatted = moment(slot.to_time).format('hh:mm');
            const timeKey = `${fromTimeFormatted}:${toTimeFormatted}`;
            return (
              <ScheduleSlot
                key={timeKey}
                slot={slot}
                shows={shows}
                index={index}
                onAir={isOnAir}
                calculateWidth={calculateWidth}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

DayRowSchedule.propTypes = {
  calculateWidth: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  slots: React.PropTypes.array.isRequired,
  shows: React.PropTypes.object.isRequired,
};

export default DayRowSchedule;
