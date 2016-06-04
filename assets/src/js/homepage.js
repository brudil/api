import { lory } from 'lory.js';
import React from 'react';
import ReactDom from 'react-dom';
import TodaySchedule from './components/TodaySchedule';

export default () => {
  const slider = document.querySelector('.js_slider');
  if (slider) {
    lory(slider, {
      infinite: 1,
    });
  }

  const root = document.querySelector('.ScheduleSingleContainer');

  function render(data) {
    ReactDom.render(<TodaySchedule data={data} />, root);
  }

  if (root) {
    render();

    fetch('/api/schedule')
      .then(data => data.json())
      .then(json => render(json));
  }
};
