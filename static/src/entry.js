import styles from './css/screen.css';
import globalAnnouncement from './js/global_announcement';
import homepage from './js/homepage';

document.addEventListener('DOMContentLoaded', () => {
  globalAnnouncement();
  homepage();
});
