import React, { useContext } from 'react';
import { MainContext } from '../../store';

const LoadingBar = () => {
  const { state } = useContext(MainContext);

  return (
    <div className={`jaf-popup-loading${state.loading ? ' has-animation' : ''}`} />
  )
}

export default LoadingBar;
