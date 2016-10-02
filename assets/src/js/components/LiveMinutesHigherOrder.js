import React from 'react';
import moment from 'moment';

function getMinutes() {
  const midnight = moment().startOf('day');
  const now = moment();

  return moment.duration(now.diff(midnight)).asMinutes();
}

export default WrappedComponent => class LiveMinutesHigherOrder extends React.Component {
  constructor(x, y) {
    super(x, y);

    this.state = {
      minutes: getMinutes(),
    };
  }

  componentDidMount() {
    setInterval(() => this.setState({ minutes: getMinutes() }), 10000);
  }

  render() {
    return <WrappedComponent minutes={this.state.minutes} {...this.props} />;
  }
};
