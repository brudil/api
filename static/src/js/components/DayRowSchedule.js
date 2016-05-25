import React from 'react';
import Moment from 'moment';
import ScheduleSlot from './ScheduleSlot';
import ScheduleTimeline from './ScheduleTimeline';

function formatSlot(slot) {
  const duration = Moment.duration(slot.to_time.diff(slot.from_time)).asMinutes();
  return {
    from_time: slot.from_time,
    to_time: slot.to_time,
    duration: duration,
    durationAsRelative: duration / (24 * 60),
    isGap: !slot.hasOwnProperty('show'),
    show: slot.show,
    id: slot.id
  }
}

export default class DayRowSchedule extends React.Component {

  componentDidMount() {
    const container = this.refs.container;

    if (container) {
      container.scrollLeft = 200;
    }
  }

  render() {
    const {shows, calculateWidth} = this.props;

    let slotsListed = [];


    if (this.props.slots !== undefined) {
      slotsListed = this.props.slots.map(slot => {
        slot.from_time = Moment(slot.from_time);
        slot.to_time = Moment(slot.to_time);
        return formatSlot(slot);
      });
    }

    const slots = [];
    slotsListed.sort((slotA, slotB) => slotA.from_time - slotB.from_time);

    let midnight = Moment().startOf('day');
    let previousEndTime = Moment().startOf('day');

    slotsListed.forEach((slot, index) => {
      if (slot.from_time !== previousEndTime) {
        slots.push(formatSlot({from_time: previousEndTime, to_time: slot.from_time}))
      }

      slots.push(slot);
      previousEndTime = slot.to_time;
    });

    if (slots.length <= 0 || slots[slots.length - 1].to_time !== midnight) {
      const from_time = slots.length <= 0 ? midnight : slots[slots.length - 1].to_time;
      slots.push(formatSlot({from_time: from_time, to_time: midnight}));
    }

    return (
      <div className="ScheduleRow" ref="container">
        <div className="ScheduleRow__inner">
          <ScheduleTimeline calculateWidth={calculateWidth}/>
          <div className="ScheduleRow__slots">
            {slots.map(slot => {
              const timeKey = `${slot.from_time.format('hh:mm')}:${slot.to_time.format('hh:mm')}`;
              return (
                <ScheduleSlot key={timeKey} slot={slot} shows={shows} calculateWidth={calculateWidth}/>);
            })}
          </div>
        </div>
      </div>
    );
  }
}
