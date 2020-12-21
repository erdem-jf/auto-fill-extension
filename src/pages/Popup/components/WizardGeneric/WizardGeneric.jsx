import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen, saveSettings } from '../../actions';
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

  const handleDisableForThisSite = ({ target }) => {
    console.log('handleDisableForThisSite', handleDisableForThisSite);
  };

  const handleShowIcon = ({ target }) => {
    const newSettings = {
      [target.name]: target.checked
    };

    dispatch(saveSettings(newSettings));
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
              >UPDATE</button>
            </div>
          )
        }
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Disable for {activeUrl}</h5>
          </div>
          <label htmlFor="current">
            <input type="checkbox" name="current" id="current" onChange={handleDisableForThisSite} checked={inputValue.current} />
            <span />
          </label>
        </div>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Show JF-AutoFill icon</h5>
          </div>
          <label htmlFor="showIcon">
            <input type="checkbox" name="showIcon" id="showIcon" onChange={handleShowIcon} checked={state.settings.showIcon} />
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
