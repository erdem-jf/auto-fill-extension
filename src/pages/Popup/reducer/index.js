import {
  REMOVE_USER_DATA,
  SAVE_USER_DATA,
  SET_LOADING,
  SAVE_SETTINGS,
  UPDATE_PERSONAL_DATA,
  UPDATE_WIZARD_SCEEN,
} from '../actions/types';

function reducer(state, action) {
  switch (action.type) {
    case REMOVE_USER_DATA:
      return {
        ...state,
        personal: [],
        user: {},
        wizard: {
          screen: 'bio',
        },
        forms: [],
        settings: {},
      };
    case SAVE_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.value,
        },
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
    case SAVE_SETTINGS:
      return {
        ...state,
        settings: {
          ...(state.settings || {}),
          ...action.value,
        },
      };
    default:
      return state;
  }
}

export default reducer;
