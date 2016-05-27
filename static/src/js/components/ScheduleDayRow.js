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
    const {shows, slots, calculateWidth, title} = this.props;

    if (slots === undefined) {
      return (<div>Nothing is scheduled.</div>)
    }

    return (
      <div className="ScheduleRow" ref="container">
        <div className="ScheduleRow__title">
          <div className="ScheduleRow__title-inner">
            {title}
          </div>
        </div>
        <div className="ScheduleRow__inner">
          <div className="ScheduleRow__slots">
            {slots.map((slot, index) => {
              const timeKey = `${Moment(slot.from_time).format('hh:mm')}:${Moment(slot.to_time).format('hh:mm')}`;
              return (
                <ScheduleSlot key={timeKey} slot={slot} shows={shows} index={index} calculateWidth={calculateWidth}/>);
            })}
          </div>
        </div>
      </div>
    );
  }
}
