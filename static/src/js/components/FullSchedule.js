import React from 'react';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import ScheduleDayColumn from './ScheduleDayColumn';
import moment from 'moment';
import { chunkSlotsByDay, calculateWidth, getOnAirSlot } from '../utils/schedule';

class FullSchedule extends React.Component {

  componentDidUpdate() {
    const container = this.refs.container;

    if (container && container.scrollLeft === 0) {
      const onAirSlot = getOnAirSlot(this.props.data.slots);
      const onAirStartTime = moment(onAirSlot.from_time);
      const startOfDay = moment().startOf('day');
      const duration = moment.duration(onAirStartTime.diff(startOfDay)).asMinutes();
      const onAirPosition = calculateWidth(duration, false) - 40;
      if (onAirPosition > 0) {
        container.scrollLeft = onAirPosition;
      }
    }
  }

  render() {
    if (!this.props.data) {
      return <h2>Loading</h2>;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const slotsByDay = chunkSlotsByDay(this.props.data.slots);

    return (
      <div className="Schedule">
        <ScheduleDayColumn className="Schedule__days" days={days} />
        <div className="Schedule__scroll-container" ref="container">
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
