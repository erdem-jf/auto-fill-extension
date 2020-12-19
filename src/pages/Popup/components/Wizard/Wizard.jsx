import React, { useContext, useEffect } from 'react';
import { MainContext } from '../../store';
import { removeUserData } from '../../actions';
import StorageHelper from '../../helpers/storage.helper';
import PodoImg from '../../../../assets/img/podo.png';

const Wizard = () => {
  const { dispatch, state } = useContext(MainContext);

  const handleLogout = () => {
    console.log('clicked');
    StorageHelper.remove('user');
    dispatch(removeUserData());
  }

  useEffect(() => {
    // console.log(state.user);
  }, []);

  return (
    <div className="jaf-popup-header">
      <div className="jaf-popup-header-profile">
        <span>
          <img src={state.user.avatarUrl ? `https:${state.user.avatarUrl}` : PodoImg} alt="jotform-podo" />
        </span>
        <div>
          <h4>{state.user.username}</h4>
          <p>{state.user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 98 122.5"><g><polygon points="27.2,23.6 50.8,23.6 50.8,19.6 23.2,19.6 23.2,78.4 50.8,78.4 50.8,74.4 27.2,74.4  "/><polygon points="60.8,33.9 57.9,36.6 67.5,47 39.8,47 39.8,51 67.5,51 57.9,61.4 60.8,64.1 74.8,49"/></g></svg>
        </button>
      </div>
    </div>
  );
};

export default Wizard;
