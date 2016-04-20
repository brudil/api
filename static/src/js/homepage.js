import {lory} from 'lory.js';

export default () => {
  const slider = document.querySelector('.js_slider');
  if (slider) {
    lory(slider, {
      infinite: 1,
    });
  }
}
