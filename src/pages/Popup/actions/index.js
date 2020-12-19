import { REMOVE_USER_DATA, SAVE_USER_DATA, UPDATE_WIZARD_SCEEN } from './types';

export const removeUserData = () => ({ type: REMOVE_USER_DATA });
export const saveUserData = (value) => ({ type: SAVE_USER_DATA, value });
export const updateWizardScreen = (value) => ({
  type: UPDATE_WIZARD_SCEEN,
  value,
});
