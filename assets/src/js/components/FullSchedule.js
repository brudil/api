import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import ScheduleTimeline from './ScheduleTimeline';
import ScheduleDayRow from './ScheduleDayRow';
import ScheduleDayColumn from './ScheduleDayColumn';
import Spinner from './Spinner';
import {
  calculateWidth,
  getOnAirSlot,
  momentWeekDayMonday,
} from '../utils/schedule';

class FullSchedule extends React.Component {

  componentDidUpdate() {
    const container = this.containerRef;

    if (container && container.scrollLeft === 0) {
      const onAirSlot = getOnAirSlot(this.props.schedule.data.slots);
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
    if (this.props.schedule.isLoading) {
      return <Spinner />;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const slotsByDay = this.props.schedule.chunked;
    return (
      <div className="Schedule">
        <ScheduleDayColumn className="Schedule__days" days={days} />
        <div
          className="Schedule__scroll-container"
          ref={(ref) => {
            this.containerRef = ref;
          }}
        >
          <div className="Schedule__scroll">
            <ScheduleTimeline calculateWidth={calculateWidth} />
            {days.map((day, index) => (
              <div className="Schedule__day-row" key={day}>
                <ScheduleDayRow
                  title={day}
                  day={index}
                  shows={this.props.schedule.data.shows}
                  slots={slotsByDay[index]}
                  calculateWidth={calculateWidth}
                />
              </div>
              ),
            )}
            <ScheduleTimeline calculateWidth={calculateWidth} />
          </div>
        </div>
      </div>
    );
  }
}

FullSchedule.propTypes = {
  schedule: React.PropTypes.object.isRequired,
};

export default connect(state => ({
  schedule: state.schedule,
}))(FullSchedule);
