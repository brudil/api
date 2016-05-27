import React from 'react';
import moment from 'moment';

export default WrappedComponent => class LiveMinutesHigherOrder extends React.Component {

  constructor(x, y) {
    super(x, y);

    this.state = {
      minutes: this.getMinutes()
    }
  }

  componentDidMount() {
    setInterval(() => this.setState({minutes: this.getMinutes()}), 60000);
  }

  getMinutes() {
    const midnight = moment().startOf('day');
    const now = moment();

    return moment.duration(now.diff(midnight)).asMinutes();
  }

  render() {
    return <WrappedComponent minutes={this.state.minutes} {...this.props} />
  }
}
