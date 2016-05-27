import React from 'react';
import moment from 'moment';
import cx from 'classnames';

export default function ScheduleSlot(props) {
  const slot = props.slot;
  let show;
  if (slot.show) {
    show = props.shows[slot.show];
  } else {
    show = {
      title: 'Playlist'
    };
  }

  const time_format = 'h:mma';
  const momentFrom = moment(slot.from_time),
    momentTo = moment(slot.to_time);

  const fromText = slot.is_overnight && props.index === 0 ? 'continued' : momentFrom.format(time_format);
  const toText = slot.is_overnight && props.index !== 0 ? 'continues' : momentTo.format(time_format);
  let times = `${fromText} - ${toText}`;

  return (
    <div className={cx('ScheduleSlot', {'ScheduleSlot--overnight': slot.is_overnight})} style={{width: props.calculateWidth(slot.duration)}}>
      <a className="ScheduleSlot__inner" style={{backgroundColor: show.accent}} href={show.page_url}>
        <div className="ScheduleSlot__time">{times}</div>
        <div className="ScheduleSlot__title">
          {show.title}
        </div>
      </a>
    </div>
  );
}
