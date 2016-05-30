import React from 'react';
import moment from 'moment';
import cx from 'classnames';

function ScheduleSlot(props) {
  const slot = props.slot;
  let show;
  if (slot.show) {
    show = props.shows[slot.show];
  } else {
    show = {
      title: 'Playlist',
    };
  }

  const timeFormat = 'h:mma';
  const momentFrom = moment(slot.from_time);
  const momentTo = moment(slot.to_time);

  const fromElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': slot.is_overnight && props.index === 0,
      })}
    >
      {momentFrom.format(timeFormat)}
    </span>
  );

  const toElement = (
    <span
      className={cx('ScheduleSlot__time-item', {
        'ScheduleSlot__time-item--continuation': slot.is_overnight && props.index !== 0,
      })}
    >
      {momentTo.format(timeFormat)}
    </span>
  );

  const scheduleSlotClasses = cx(
    'ScheduleSlot',
    `ScheduleSlot--tone-${show.tone === 'dark' ? 'dark' : 'light'}`,
    {
      'ScheduleSlot--overnight': slot.is_overnight,
      'ScheduleSlot--on-air': props.onAir,
    }
  );

  return (
    <div className={scheduleSlotClasses} style={{ width: props.calculateWidth(slot.duration) }}>
      <a
        className="ScheduleSlot__inner"
        style={{ backgroundColor: show.accent }}
        href={show.page_url}
      >
        <div className="ScheduleSlot__time">{fromElement} - {toElement}</div>
        <div className="ScheduleSlot__title">
          {show.title}
        </div>
      </a>
    </div>
  );
}

ScheduleSlot.propTypes = {
  calculateWidth: React.PropTypes.func.isRequired,
  onAir: React.PropTypes.bool.isRequired,
  slot: React.PropTypes.object.isRequired,
  index: React.PropTypes.number.isRequired,
  shows: React.PropTypes.object.isRequired,
};

export default ScheduleSlot;
