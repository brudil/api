import React from 'react';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import ScheduleDayColumn from './ScheduleDayColumn';
import moment from 'moment';

function chunkSlotsByDay(slots) {
  const days = [[], [], [], [], [], [], []];
  for (const slot of slots) {
    if (slot.is_overnight) {
      const midnight = moment().startOf('day').add(1, 'day');
      const slotDurationToMidnight = moment(slot.from_time);
      const diffMins = moment.duration(midnight.diff(slotDurationToMidnight)).asMinutes();

      days[slot.day].push(Object.assign({}, slot, { duration: diffMins }));

      if (slot.day + 1 < 6) {
        days[(slot.day + 1) % 6].push(
          Object.assign({}, slot, { duration: slot.duration - diffMins })
        );
      }
    } else {
      days[slot.day].push(slot);
    }
  }

  return days;
}

class FullSchedule extends React.Component {

  componentDidUpdate() {
    const container = this.refs.container;

    if (container) {
      container.scrollLeft = 200;
    }
  }

  render() {
    if (!this.props.data) {
      return <h2>Loading</h2>;
    }

    function calculateWidth(number) {
      const width = 3600;
      const totalMinutes = 24 * 60;
      const widthPerMinute = width / totalMinutes;
      return `${number * widthPerMinute}px`;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const slotsByDay = chunkSlotsByDay(this.props.data.slots);
    console.log(slotsByDay);
    return (
      <div className="Schedule" ref="container">
        <ScheduleDayColumn className="Schedule__days" days={days} />
        <div className="Schedule__scroll-container">
          <div className="Schedule__scroll">
            <ScheduleTimeline calculateWidth={calculateWidth} />
            {days.map((day, index) => (
              <div className="Schedule__day-row" key={index}>
                <ScheduleDayRow
                  title={day}
                  day={index}
                  shows={this.props.data.shows}
                  slots={slotsByDay[index]}
                  calculateWidth={calculateWidth}
                />
              </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

FullSchedule.propTypes = {
  data: React.PropTypes.object,
};

export default FullSchedule;
