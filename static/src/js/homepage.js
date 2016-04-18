import {lory} from 'lory.js';

export default () => {
  const slider = document.querySelector('.js_slider');

  lory(slider, {
    infinite: 1,
  });
}
