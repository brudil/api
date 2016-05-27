import React from 'react';

export default function VolumeControl(props) {
  return (
    <div>
      <input type="range" min="0" max="1" step="0.001" value={props.value} onChange={(e) => {
        props.onChange(e.target.value)
      }}/>
    </div>
  );
}
