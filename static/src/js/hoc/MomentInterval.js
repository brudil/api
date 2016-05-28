import React from 'react';
import moment from 'moment';

export default (prefs, WrappedComponent) => class MomentInterval extends React.Component {
  constructor(x, y) {
    super(x, y);

    this.state = {
      momentInterval: moment(),
    };
  }

  componentDidMount() {
    setInterval(() => this.setState({ momentInterval: moment() }), prefs.interval);
  }

  render() {
    return <WrappedComponent momentInterval={this.state.momentInterval} {...this.props} />;
  }
};
