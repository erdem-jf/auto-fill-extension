import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen } from '../../actions';
import WizardBox from '../WizardBox';
import StorageHelper from '../../helpers/storage.helper';

import wizardData from '../../constants/wizardData';

const WizardGeneric = () => {
  const { dispatch, state } = useContext(MainContext);
  const [activeUrl, setActiveUrl] = useState('');
  const [inputValue, setInputValue] = useState({
    current: false,
    show: false
  });
  const [countObj, setCountObj] = useState({
    personal: 0,
    collected: 0,
    forms: 0
  });

  const handleNewButtonClick = () => {
    dispatch(updateWizardScreen('new'))
  };

  const onWizardBoxClick = (type) => {
    const funcs = {
      new: handleNewButtonClick
    };

    console.log('type', type);
    if (funcs[type]) return funcs[type]();
  };

  const getCount = (item, val) => {
    setCountObj(prevState => ({
      ...prevState,
      [item]: val ? val.length : 0
    }));
  }

  const getTabDetails = (tab) => {
    setActiveUrl(tab.url.split('?')[0].split('//')[1].split('/')[0]);
  };

  const handleToggle = ({ target }) => {
    setInputValue(prevState => {
      StorageHelper.set({ key: 'toggle', value: {
        ...prevState,
        [target.id]: target.checked
      } })
      return ({
        ...prevState,
        [target.id]: target.checked
      })
    });
  };

  const getToggleData = (val) => {
    setInputValue(prevState => ({
      ...prevState,
      ...val
    }));
  }

  const handleCount = () => {
    wizardData.forEach(item => {
      StorageHelper.get({ key: item, callback: getCount.bind(this, item) });
    });
  };

  useEffect(() => {
    StorageHelper.getTab(getTabDetails);
    StorageHelper.get({ key: 'toggle', callback: getToggleData });

    handleCount();
  }, []);

  useEffect(() => {
    console.log('state.personal', state.personal);
    handleCount();
  }, [state.personal]);

  return (
    <div className="jaf-popup-wizard-generic">
      <div className="jaf-popup-wizard-generic-settings">
        {
          (state.user && state.user.account_type && state.user.account_type.name && state.user.account_type.name === 'FREE') && (
            <div className="jaf-popup-wizard-generic-settings-item is-update">
              <div>
                <h5>You're <b>{state.user.account_type.name}</b> member.</h5>
              </div>
              <button
                type="button"
              >Update</button>
            </div>
          )
        }
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Disable for {activeUrl}</h5>
          </div>
          <label htmlFor="current">
            <input type="checkbox" name="current" id="current" onChange={handleToggle} checked={inputValue.current} />
            <span />
          </label>
        </div>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Show JF-AutoFill icon</h5>
          </div>
          <label htmlFor="show">
            <input type="checkbox" name="show" id="show" onChange={handleToggle} checked={inputValue.show} />
            <span />
          </label>
        </div>
      </div>
      <div className="jaf-popup-wizard-generic-boxes">
        {
          wizardData.map((item, index) => {
            return (
              <WizardBox
                key={index.toString()}
                className={`jaf-popup-wizard-box is-${item}`}
                onClick={onWizardBoxClick.bind(this, item)}
                type={item}
                count={countObj[item] || 0}
              />
            )
          })
      }
      </div>
    </div>
  )
};

export default WizardGeneric;
