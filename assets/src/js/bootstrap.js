import 'whatwg-fetch';
import Pjax from 'pjax';
import globalAnnouncement from './global_announcement';
import initPlayer from './player';
import FullSchedule from './components/FullSchedule';
import TodaySchedule from './components/TodaySchedule';
import NowAndNext from './components/NowAndNext';
import Handler from './handler';

const handler = new Handler();

handler.component(FullSchedule, '#ScheduleFullRoot');
handler.component(TodaySchedule, '.ScheduleSingleContainer');
handler.component(NowAndNext, '.NowAndNextRoot');

document.addEventListener('DOMContentLoaded', () => {
  globalAnnouncement();
  handler.onPage();
  window.P = new Pjax({ selectors: ['title', '.Core__content'] });

  if (document.getElementById('player')) {
    initPlayer();
  }

  [...document.querySelectorAll('.js-open-player')].forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
});

document.addEventListener('pjax:complete', handler.onPage.bind(handler));
