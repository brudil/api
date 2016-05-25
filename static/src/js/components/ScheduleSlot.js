import React from 'react';

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

  return (
    <div className="ScheduleSlot" style={{width: props.calculateWidth(slot.duration)}}>
      <a className="ScheduleSlot__inner" style={{backgroundColor: show.accent}} href={show.page_url}>
        <div className="ScheduleSlot__time">{slot.from_time.format(time_format)}-{slot.to_time.format(time_format)}</div>
        <div className="ScheduleSlot__title">
          {show.title}
        </div>
      </a>
    </div>
  );
}
