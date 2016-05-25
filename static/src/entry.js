import styles from './css/screen.css';
import globalAnnouncement from './js/global_announcement';
import homepage from './js/homepage';
import schedule from './js/schedule';

document.addEventListener('DOMContentLoaded', () => {
  globalAnnouncement();
  homepage();
  schedule();
});
