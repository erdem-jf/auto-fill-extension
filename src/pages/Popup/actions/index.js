import {
  REMOVE_USER_DATA,
  SAVE_USER_DATA,
  SET_LOADING,
  SAVE_SETTINGS,
  UPDATE_COLLECTED_DATA,
  UPDATE_PERSONAL_DATA,
  UPDATE_WIZARD_SCEEN,
} from './types';

export const removeUserData = () => ({ type: REMOVE_USER_DATA });
export const saveUserData = (value) => ({ type: SAVE_USER_DATA, value });
export const setLoading = (value) => ({ type: SET_LOADING, value });
export const updatePersonalData = (value) => ({
  type: UPDATE_PERSONAL_DATA,
  value,
});
export const updateCollectedData = (value) => ({
  type: UPDATE_COLLECTED_DATA,
  value,
});
export const updateWizardScreen = (value) => ({
  type: UPDATE_WIZARD_SCEEN,
  value,
});
export const saveSettings = (value) => ({
  type: SAVE_SETTINGS,
  value,
});
