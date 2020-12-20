import {
  REMOVE_USER_DATA,
  SAVE_USER_DATA,
  SET_LOADING,
  UPDATE_COLLECTED_DATA,
  UPDATE_PERSONAL_DATA,
  UPDATE_WIZARD_SCEEN,
} from '../actions/types';

function reducer(state, action) {
  switch (action.type) {
    case REMOVE_USER_DATA:
      return {
        ...state,
        personal: {},
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
    case UPDATE_COLLECTED_DATA:
      return {
        ...state,
        collected: [...state.collected, ...action.value],
      };
    case UPDATE_PERSONAL_DATA:
      return {
        ...state,
        personal: [...state.personal, ...action.value],
      };
    case UPDATE_WIZARD_SCEEN:
      return {
        ...state,
        wizard: {
          ...state.wizard,
          screen: action.value,
        },
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.value,
      };
    default:
      return state;
  }
}

export default reducer;
