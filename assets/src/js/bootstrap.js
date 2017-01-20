import 'whatwg-fetch';
import Pjax from 'pjax';
import globalAnnouncement from './global_announcement';
import initPlayer from './player';
import FullSchedule from './components/FullSchedule';
import TodaySchedule from './components/TodaySchedule';
import NowAndNext from './components/NowAndNext';
import InlinePlayer from './components/InlinePlayer';
import Handler from './handler';

const handler = new Handler();

handler.component(FullSchedule, '#ScheduleFullRoot');
handler.component(TodaySchedule, '.ScheduleSingleContainer');
handler.component(NowAndNext, '.NowAndNextRoot');
handler.component(InlinePlayer, '.js__inline-player-root');

document.addEventListener('DOMContentLoaded', () => {
  globalAnnouncement();
  handler.onPage();
  const pjax = new Pjax({ selectors: ['title', '.Core__content'] });

  window.P = pjax;
  window.loadUrl = (url) => {
    console.log(url);
    pjax.loadUrl(url, pjax.options);
  };

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
