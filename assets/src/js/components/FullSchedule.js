import React from 'react';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import ScheduleDayColumn from './ScheduleDayColumn';
import Spinner from './Spinner';
import moment from 'moment';
import {
  calculateWidth,
  getOnAirSlot,
  momentWeekDayMonday,
} from '../utils/schedule';

class FullSchedule extends React.Component {

  componentDidUpdate() {
    const container = this.refs.container;

    if (container && container.scrollLeft === 0) {
      const onAirSlot = getOnAirSlot(this.props.data.slots);
      const slotStartedToday = onAirSlot.day === momentWeekDayMonday(moment());

      if (onAirSlot.is_overnight && !slotStartedToday) {
        container.scrollLeft = 0;
        return;
      }

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
      return <Spinner />;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const slotsByDay = this.props.data.chunked;

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
            <ScheduleTimeline calculateWidth={calculateWidth} />
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
