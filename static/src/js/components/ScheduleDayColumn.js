import React from 'react';

function ScheduleDayColumn(props) {
  return (
    <div className="ScheduleDayColumn">
      {props.days.map(day => (
        <div className="ScheduleDayColumn__day" key={day}>
          {day}
        </div>
        )
      )}
    </div>
  );
}

ScheduleDayColumn.propTypes = {
  calculateWidth: React.PropTypes.func.isRequired,
  days: React.PropTypes.array.isRequired,
};

export default ScheduleDayColumn;
