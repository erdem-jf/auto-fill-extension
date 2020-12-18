import { SET_USER_DATA } from '../actions/types';

function reducer(state, action) {
  switch (action.type) {
    case SET_USER_DATA:
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
