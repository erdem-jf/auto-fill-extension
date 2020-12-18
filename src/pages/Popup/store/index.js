import React, { createContext, useReducer } from 'react';
import { node } from 'prop-types';

import reducer from '../reducer';
import payload from './payload';

// create context
export const MainContext = createContext(payload);

// create Store
const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, payload);
  const value = { state, dispatch };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

Store.defaultProps = {
  children: null,
};

Store.propTypes = {
  children: node,
};

export default Store;
