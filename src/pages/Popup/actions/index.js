import { REMOVE_USER_DATA, SAVE_USER_DATA } from './types';

export const removeUserData = () => ({ type: REMOVE_USER_DATA });
export const saveUserData = (value) => ({ type: SAVE_USER_DATA, value });
