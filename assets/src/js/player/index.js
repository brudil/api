import React from 'react';
import ReactDOM from 'react-dom';
import AudioController from './audio_controller';
import Player from '../components/Player';

function getState(ac) {
  return {
    isPlaying: ac.isPlaying,
    volume: ac.volume,
    playState: ac.playState,
  };
}


export function init() {
  const ac = new AudioController();
  ac.stream('http://uk2.internet-radio.com:30764/stream');

  function render() {
    ReactDOM.render(<Player state={getState(ac)} ac={ac} />, document.querySelector('#player'));
  }

  ac.onChange(render);

  render();
}
