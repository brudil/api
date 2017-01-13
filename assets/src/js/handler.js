import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import scheduleReducer from './reducers/scheduleReducer';
import { loadSchedule } from './actions';

export default class Handler {
  constructor() {
    this.components = [];

    const middleware = [];
    const logger = createLogger();
    middleware.push(thunk);
    middleware.push(logger);

    this.store = createStore(combineReducers({
      schedule: scheduleReducer,
    }), applyMiddleware(...middleware));

    this.store.dispatch(loadSchedule());
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
