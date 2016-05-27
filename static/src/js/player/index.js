import styles from '../../css/player/screen.css';
import React from 'react';
import ReactDOM from 'react-dom';
import AudioControler from './audio_controller';
import PlayPauseButton from './components/PlayPauseButton'
import VolumeControl from './components/VolumeControl'

const ac = new AudioControler();
ac.stream('http://uk2.internet-radio.com:30764/stream');

function Player(props) {
  const controller = props.ac;
  return (
    <div className="player">
      <div className="">
        <div>State: {props.state.playState}</div>
        <PlayPauseButton isPlaying={props.state.isPlaying} onToggle={controller.toggleState.bind(controller)}/>
        <VolumeControl value={props.state.volume} onChange={controller.setVolume.bind(controller)} />
      </div>
    </div>
  );
}

function getState() {
  return {
    isPlaying: ac.isPlaying,
    volume: ac.volume,
    playState: ac.playState
  };
}

function render() {
  ReactDOM.render(<Player state={getState()} ac={ac}/>, document.querySelector('.app'));
}

ac.onChange(render);

render();
