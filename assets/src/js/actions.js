export const LOAD_SCHEDULE_REQUEST = 'LOAD_SCHEDULE_REQUEST';
export const LOAD_SCHEDULE_SUCCESS = 'LOAD_SCHEDULE_SUCCESS';
export const LOAD_SCHEDULE_FAILURE = 'LOAD_SCHEDULE_FAILURE';

export const loadSchedule = () => (dispatch) => {
  dispatch({
    type: LOAD_SCHEDULE_REQUEST,
  });

  fetch('/api/schedule')
    .then(data => data.json())
    .then((data) => {
      dispatch({
        type: LOAD_SCHEDULE_SUCCESS,
        payload: data,
      });
    })
    .catch(err => dispatch({
      type: LOAD_SCHEDULE_FAILURE,
      error: err,
    }));
};
