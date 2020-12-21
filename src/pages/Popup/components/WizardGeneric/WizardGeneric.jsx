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
    show: true
  });

  const handlePersonalClick = () => {
    dispatch(updateWizardScreen('personal'))
  };

  const handleNewButtonClick = () => {
    dispatch(updateWizardScreen('new'))
  };

  const onWizardBoxClick = (type) => {
    const funcs = {
      personal: handlePersonalClick,
      new: handleNewButtonClick
    };

    if (funcs[type]) return funcs[type]();
  };

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

  useEffect(() => {
    StorageHelper.getTab(getTabDetails);
    StorageHelper.get({ key: 'toggle', callback: getToggleData });
  }, []);

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
                count={(state[item] && state[item].length && state[item].length) || 0}
              />
            )
          })
      }
      </div>
    </div>
  )
};

export default WizardGeneric;
