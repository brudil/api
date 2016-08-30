import globalAnnouncement from './js/global_announcement';
import homepage from './js/homepage';
import schedule from './js/schedule';
import initPlayer from './js/player';

require('./css/screen.css');

document.addEventListener('DOMContentLoaded', () => {
  globalAnnouncement();
  homepage();
  schedule();

  if (document.getElementById('player')) {
    initPlayer();
  }

  [...document.querySelectorAll('.js-open-player')].forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
    });
  });
});
