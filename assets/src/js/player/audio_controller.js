import playStates from './playState';

export default class AudioController {

  constructor() {
    this.update = () => {};
    this.playState = playStates.STOPPED;
    this.isPlaying = false;
    this.volume = 1;
    this.element = document.body.appendChild(document.createElement('audio'));
    this.element.setAttribute('controls', 'true');
    this.element.style = { display: 'none' };

    this.element.addEventListener('playing', () => {
      this.isPlaying = true;
      this.update();
    });

    this.element.addEventListener('pause', () => {
      this.isPlaying = false;
      this.update();
    });

    this.element.addEventListener('volumechange', () => {
      this.volume = this.element.volume;
      this.update();
    });

    this.element.addEventListener('error', data => {
      console.log('error', data);
    });

    this.element.addEventListener('ended', data => {
      console.log('ended', data);
      this.playState = playStates.STOPPED;
      this.update();
    });

    this.element.addEventListener('waiting', data => {
      console.log('waiting', data);
      this.playState = playStates.CONNECTING;
      this.update();
    });

    this.element.addEventListener('canplay', data => {
      this.playState = playStates.PLAYING;
      console.log('canplay', data);
      this.update();
    });
  }

  onChange(func) {
    this.update = func;
  }

  stream(resource) {
    this.element.src = resource;
    // this.element.play();
  }

  toggleState() {
    if (this.isPlaying) {
      this.element.pause();
    } else {
      this.element.play();
    }
  }

  setVolume(v) {
    this.element.volume = v;
  }
}
