import { REMOVE_USER_DATA, SAVE_USER_DATA } from '../actions/types';

function reducer(state, action) {
  switch (action.type) {
    case REMOVE_USER_DATA:
      return {
        ...state,
        user: {},
      };
    case SAVE_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.value,
        },
      };
    default:
      return state;
  }
}

export default reducer;
