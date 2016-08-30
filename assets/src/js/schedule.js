import React from 'react';
import FullSchedule from './components/FullSchedule';
import ReactDom from 'react-dom';
import TodaySchedule from './components/TodaySchedule';
import NowAndNext from './components/NowAndNext';
import 'whatwg-fetch';
import { chunkSlotsByDay } from './utils/schedule';

function reactInjector(rootSelector, Element) {
  const root = document.querySelector(rootSelector);

  function render(data = null) {
    ReactDom.render(<Element data={data} />, root);
  }

  if (root) {
    render();

    return render;
  }

  return false;
}


export default () => {
  const scheduleElements = [
    reactInjector('#ScheduleFullRoot', FullSchedule),
    reactInjector('.ScheduleSingleContainer', TodaySchedule),
    reactInjector('.NowAndNextRoot', NowAndNext),
  ];

  function update(data) {
    const scheduleData = data;
    scheduleData.chunked = chunkSlotsByDay(data.slots);

    scheduleElements.forEach(element => {
      if (element !== false) {
        element(scheduleData);
      }
    });
  }

  fetch('/api/schedule')
    .then(data => data.json())
    .then(update);
};
