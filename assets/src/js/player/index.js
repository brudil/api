import React from 'react';
import ReactDOM from 'react-dom';
import Player from '../components/Player';
import { getOnAirSlot } from '../utils/schedule';

export default function init() {
  function render(data) {
    const props = data === null ?
      { isLoading: true } : {
        isLoading: false,
        slot: getOnAirSlot(data.slots),
        shows: data.shows,
      };

    ReactDOM.render(<Player {...props} />, document.querySelector('#player'));
  }

  render(null);

  fetch('/api/schedule')
    .then(data => data.json())
    .then(render);
}
