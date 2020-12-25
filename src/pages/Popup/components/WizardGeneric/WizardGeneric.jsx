import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen, saveSettings } from '../../actions';
import WizardBox from '../WizardBox';
import StorageHelper from '../../helpers/storage.helper';

import wizardData from '../../constants/wizardData';

const WizardGeneric = () => {
  const { dispatch, state } = useContext(MainContext);
  const [url, setUrl] = useState('');
  const [btnIsDisabled, setBtnIsDisabled] = useState(false);
  const [targetDataSet, setTargetDataSet] = useState('');
  const [autoFill, setAutoFill] = useState(false);

  const handleFillAllForm = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setBtnIsDisabled(true);
      StorageHelper.set({ key: 'buttonIsDisabled', value: true });

      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'fillAllForm' },
        (response) => {
          console.log('response received', response);
        }
      );
    });
  }

  const handleFastAutoFill = ({ target: { checked }}) => {
    StorageHelper.set({ key: 'fastAutoFill', value: checked });
    setAutoFill(checked);
  }

  const handleTargetDataSet = (type) => {
    StorageHelper.set({ key: 'targetDataSet', value: type });
    setTargetDataSet(type);
  }

  const handleNewButtonClick = () => {
    dispatch(updateWizardScreen('new'));
  };

  const onWizardBoxClick = (type) => {
    if (type === 'new') return handleNewButtonClick();

    handleTargetDataSet(type);
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
    StorageHelper.get({ key: 'buttonIsDisabled', callback: (val) => {
      setBtnIsDisabled(typeof val === 'undefined' ? false : val);
    }});

    StorageHelper.get({ key: 'targetDataSet', callback: (val) => {
      setTargetDataSet(typeof val === 'undefined' ? 'personal' : val);
    }});

    StorageHelper.get({ key: 'fastAutoFill', callback: (val) => {
      setAutoFill(typeof val === 'undefined' ? false : val);
    }});

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.type === 'AUTOFILL_FINISHED') {
        setBtnIsDisabled(false);
        StorageHelper.set({ key: 'buttonIsDisabled', value: false });
        sendResponse('@popup');
      }

      return;
    });
  }, []);

  return (
    <div className="jaf-popup-wizard-generic">
      <div className="jaf-popup-wizard-generic-boxes">
        {
          wizardData.map((item, index) => {
            return (
              <WizardBox
                key={index.toString()}
                className={`jaf-popup-wizard-box is-${item}${item === targetDataSet ? ' is-selected' : ''}`}
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
            <input type="checkbox" name="showIcon" id="showIcon" onChange={handleFastAutoFill} checked={autoFill} />
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
        <button type="button" onClick={handleFillAllForm} disabled={btnIsDisabled ? 'disabled' : ''}>Fill Now</button>
      </div>
    </div>
  )
};

export default WizardGeneric;
