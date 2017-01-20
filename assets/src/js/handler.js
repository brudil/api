import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import scheduleReducer from './reducers/scheduleReducer';
import playerReducer from './reducers/playerReducer';
import { loadSchedule, updateOnAirSlot, playerChange } from './actions';
import { getSecondsToNextQuater } from './utils/schedule';

const audio = new Audio();

function audioComponent(state, prevState) {
  const stream = state.player.stream;
  const prevStream = prevState.player.stream;

  if (stream !== prevStream) {
    console.log(`now ${stream} from ${prevStream}`);

    if (stream === 'live') {
      audio.src = 'http://uk2.internet-radio.com:30764/stream';
      audio.play();
    }
  }
}

export default class Handler {
  constructor() {
    this.components = [];

    const middleware = [];
    const logger = createLogger();
    middleware.push(thunk);
    middleware.push(logger);

    this.store = createStore(combineReducers({
      schedule: scheduleReducer,
      player: playerReducer,
    }), applyMiddleware(...middleware));

    this.prevState = this.store.getState();
    this.store.subscribe(this.handleChange.bind(this));

    this.store.dispatch(loadSchedule());

    console.log(getSecondsToNextQuater());
    setTimeout(() => {
      this.store.dispatch(updateOnAirSlot());
    }, getSecondsToNextQuater() * 1000);

    'playing play pause waiting'.split(' ').forEach((eventName) => {
      audio.addEventListener(eventName, (event) => {
        this.store.dispatch(playerChange({ event, eventName }));
      });
    });
  }

  handleChange() {
    audioComponent(this.store.getState(), this.prevState);

    this.prevState = this.store.getState();
  }

  component(Component, selector, props) {
    this.components.push({ Component, selector, props });
  }

  onPage() {
    this.components.forEach(({ Component, selector, props = {} }) => {
      const element = document.querySelector(selector);
      if (element) {
        ReactDOM.render((
          <Provider store={this.store}>
            <Component {...props} />
          </Provider>
        ), element);
      }
    });
  }
}
