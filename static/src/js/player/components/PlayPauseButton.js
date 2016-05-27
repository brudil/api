import React from 'react';

export default class PlayPauseButton extends React.Component {

  render() {
    return (
      <button onClick={this.props.onToggle}>{ this.props.isPlaying ? 'Stop' : 'Play' }</button>
    );
  }
}
