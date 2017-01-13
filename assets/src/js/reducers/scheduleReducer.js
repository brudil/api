import { LOAD_SCHEDULE_REQUEST, LOAD_SCHEDULE_SUCCESS, LOAD_SCHEDULE_FAILURE } from '../actions';
import { chunkSlotsByDay } from '../utils/schedule';

const initialState = {
  isLoading: false,
  data: null,
  chunked: null,
};

export default function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SCHEDULE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_SCHEDULE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        chunked: chunkSlotsByDay(action.payload.slots),
      };
    }
    case LOAD_SCHEDULE_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}
