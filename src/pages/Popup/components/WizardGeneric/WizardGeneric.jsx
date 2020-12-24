import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen, saveSettings } from '../../actions';
import WizardBox from '../WizardBox';
import StorageHelper from '../../helpers/storage.helper';

import wizardData from '../../constants/wizardData';

const WizardGeneric = () => {
  const { dispatch, state } = useContext(MainContext);
  const [url, setUrl] = useState('');

  const handleFillAllForm = () => {
    console.log('fill the form');
  }

  const handlePersonalClick = () => {
    dispatch(updateWizardScreen('personal'));
  };

  const handleNewButtonClick = () => {
    dispatch(updateWizardScreen('new'));
  };

  const onWizardBoxClick = (type) => {
    const funcs = {
      personal: handlePersonalClick,
      new: handleNewButtonClick,
    };

    if (funcs[type]) return funcs[type]();
  };

  const getTabDetails = (tab) => {
    setUrl(tab.url);
  };

  const handleShowIcon = ({ target }) => {
    const newSettings = {
      [target.name]: target.checked
    };

    dispatch(saveSettings(newSettings));
  };

  useEffect(() => {
    StorageHelper.getTab(getTabDetails);
  }, []);

  return (
    <div className="jaf-popup-wizard-generic">
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
      <div className="jaf-popup-wizard-url">
        {url.split('://')[1]}
      </div>
      <div className="jaf-popup-wizard-inputs">
        <ul>
          <li>
            <h4>Fast Fill Available</h4>
            <span>14</span>
          </li>
          <li>
            <h4>Creative Fill Available</h4>
            <span>2</span>
          </li>
        </ul>
      </div>
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
            <h5>Fast Autofill</h5>
          </div>
          <label htmlFor="showIcon">
            <input type="checkbox" name="showIcon" id="showIcon" />
            <span />
          </label>
        </div>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Creative Autofill</h5>
          </div>
          <label htmlFor="showIcon">
            <input type="checkbox" name="showIcon" id="showIcon" />
            <span />
          </label>
        </div>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Show Icon</h5>
          </div>
          <label htmlFor="showIcon">
            <input type="checkbox" name="showIcon" id="showIcon" onChange={handleShowIcon} checked={state.settings.showIcon} />
            <span />
          </label>
        </div>
      </div>
      <div className="jaf-popup-wizard-cta">
        <button type="button" onClick={handleFillAllForm}>Fill Now</button>
      </div>
    </div>
  )
};

export default WizardGeneric;
