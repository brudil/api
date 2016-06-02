import React from 'react';
import PlayPauseButton from './PlayPauseButton';
import VolumeControl from './VolumeControl';


function Player(props) {
  const controller = props.ac;
  return (
    <div className="Player">
      <div className="">
        <div>State: {props.state.playState}</div>
        <PlayPauseButton isPlaying={props.state.isPlaying} onToggle={controller.toggleState} />
        <VolumeControl value={props.state.volume} onChange={controller.setVolume} />
      </div>
    </div>
  );
}

Player.propTypes = {
  state: React.PropTypes.object,
  ac: React.PropTypes.object,
};

export default Player;
