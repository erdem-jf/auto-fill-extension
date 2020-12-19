import {
  REMOVE_USER_DATA,
  SAVE_USER_DATA,
  UPDATE_WIZARD_SCEEN,
} from '../actions/types';

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
    case UPDATE_WIZARD_SCEEN:
      return {
        ...state,
        wizard: {
          ...state.wizard,
          screen: action.value,
        },
      };
    default:
      return state;
  }
}

export default reducer;
