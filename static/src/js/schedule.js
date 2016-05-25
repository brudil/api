import React from 'react';
import ReactDom from 'react-dom';
import FullSchedule from './components/FullSchedule';

export default () => {
  const root = document.querySelector('#ScheduleFullRoot');
  if (root) {

    function render(data){
      ReactDom.render(<FullSchedule data={data}/>, root);
    }

    render();

    fetch('/api/schedule')
      .then(data => {
        return data.json();
      })
      .then(json => render(json));
  }
}
