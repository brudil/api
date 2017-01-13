import React from 'react';
import { connect } from 'react-redux';
import { getOnAirSlot } from '../utils/schedule';

function launchPlayer() {
  window.open(
    '/player',
    'URF Player',
    'height=425,width=300,status=yes,toolbar=no,menubar=no',
  );
}

function NowAndNext({ schedule }) {
  if (schedule.isLoading) {
    return null;
  }

  const slot = getOnAirSlot(schedule.data.slots);
  const show = schedule.data.shows[slot.show];
  return (
    <a className="NowAndNext" onClick={launchPlayer} href="">
      <div className="NowAndNext__heading">Listen</div>
      <div className="NowAndNext__now">Now: {show.title}</div>
    </a>
  );
}

NowAndNext.propTypes = {
  schedule: React.PropTypes.object.isRequired,
};

export default connect(state => ({
  schedule: state.schedule,
}))(NowAndNext);
