import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from './store';
import Login from './components/Login';
import Wizard from './components/Wizard';
import LoadingBar from './components/LoadingBar';
import { saveUserData, setLoading, updateCollectedData, updatePersonalData, updateWizardScreen } from './actions';
import RequestHelper from './helpers/request.helper';
import StorageHelper from './helpers/storage.helper';

import wizardData from './constants/wizardData';

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
    dispatch(setLoading(true));
    const result = await RequestHelper.login(loginData);

    if (!result.data || result.data.responseCode !== 200) {
      setErrorModal(true);
      dispatch(setLoading(false));
      return;
    };

    StorageHelper.set({ key: 'user', value: result.data.content });
    saveUserDetails(result.data.content);
    dispatch(setLoading(false));
  }

  const saveUserDetails = (user) => {
    dispatch(saveUserData(user));
  }

  const handleWizardScreen = (val) => {
    const isBioExist = (val && val.find(item => item.question === 'bio')) || false;
    dispatch(updateWizardScreen(isBioExist ? 'generic' : 'bio'));
  }

  const getCount = (item, val) => {
    if (!val) return;

    const func = {
      personal: () => dispatch(updatePersonalData(val)),
      collected: () => dispatch(updateCollectedData(val)),
    };

    if (func[item]) func[item]();
  }

  const handleCount = () => {
    wizardData.forEach(item => {
      StorageHelper.get({ key: item, callback: getCount.bind(this, item) });
    });
  };

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
    StorageHelper.get({ key: 'personal', callback: handleWizardScreen });

    handleCount();
  }, []);

  useEffect(() => {
    setComponentKey(state.user.appKey ? 'wizard' : 'guest');
  }, [state.user]);

  return (
    <div className="jaf-popup">
      <LoadingBar />
      { renderScreen() }
    </div>
  );
};

export default Popup;
