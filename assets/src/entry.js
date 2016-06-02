require('./css/screen.css');
import globalAnnouncement from './js/global_announcement';
import homepage from './js/homepage';
import schedule from './js/schedule';
import { init as initPlayer } from './js/player';

document.addEventListener('DOMContentLoaded', () => {
  globalAnnouncement();
  homepage();
  schedule();

  if (document.getElementById('player')) {
    initPlayer();
  }
});
