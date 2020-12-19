import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from './store';
import Login from './components/Login';
import Wizard from './components/Wizard';
import { saveUserData, updateWizardScreen } from './actions';
import RequestHelper from './helpers/request.helper';
import StorageHelper from './helpers/storage.helper';

const Popup = () => {
  const { dispatch, state } = useContext(MainContext);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [componentKey, setComponentKey] = useState('loading');
  const [errorModal, setErrorModal] = useState(false);

  const handleInputValue = ({ target: input }) => {
    setLoginData(prevState => ({
      ...prevState,
      [input.name]: input.value
    }));
  }

  const handleErrorModal = () => {
    setErrorModal(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await RequestHelper.login(loginData);

    if (!result.data || result.data.responseCode !== 200) return setErrorModal(true);

    StorageHelper.set({ key: 'user', value: result.data.content });
    saveUserDetails(result.data.content);
  }

  const saveUserDetails = (user) => {
    dispatch(saveUserData(user));
  }

  const handleWizardScreen = (val) => {
    dispatch(updateWizardScreen(val || 'bio'));
  }

  const renderScreen = () => {
    const components = {
      loading: () => <div>Loading...</div>,
      guest: () => (
        <Login { ...{ errorModal, handleErrorModal, handleInputValue, handleSubmit } } />
      ),
      wizard: () => <Wizard />
    };

    return components[componentKey]();
  };

  useEffect(() => {
    StorageHelper.get({ key: 'user', callback: saveUserDetails });
    StorageHelper.get({ key: 'wizard', callback: handleWizardScreen });
  }, []);

  useEffect(() => {
    setComponentKey(state.user.appKey ? 'wizard' : 'guest');
  }, [state.user]);

  return (
    <div className="jaf-popup">
      { renderScreen() }
    </div>
  );
};

export default Popup;
