import React from 'react';
import ReactDom from 'react-dom';
import FullSchedule from './components/FullSchedule';

export default () => {
  const root = document.querySelector('#ScheduleFullRoot');

  function render(data) {
    ReactDom.render(<FullSchedule data={data} />, root);
  }

  if (root) {
    render();

    fetch('/api/schedule')
      .then(data => data.json())
      .then(json => render(json));
  }
};
