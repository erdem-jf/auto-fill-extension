import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen, saveSettings, updateDisabledList } from '../../actions';
import WizardBox from '../WizardBox';
import StorageHelper from '../../helpers/storage.helper';

import wizardData from '../../constants/wizardData';

const WizardGeneric = () => {
  const { dispatch, state } = useContext(MainContext);
  // const [activeUrl, setActiveUrl] = useState('');
  const [url, setUrl] = useState('');
  const [disabledInputValue, setDisabledInputValue] = useState(false);

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
    setUrl(tab.url);
    // setActiveUrl(tab.url.split('?')[0].split('//')[1].split('/')[0]);

  };

  const getDisabledList = (disabledList) => {
    if (disabledList.length > 0) {
      disabledList.forEach(item => {;
        if (item.url === url) {
          setDisabledInputValue(item.status);
        }
      })
    }

    dispatch(updateDisabledList(disabledList));
  };

  const handleDisableForThisSite = ({ target: { checked } }) => {
    let targetIndex;
    const itemIsExist = state.disabledList.find((item, index) => {
      targetIndex = index;
      return item.url === url;
    });
    
    const newDisabledList = [...state.disabledList];
    if (itemIsExist) {
      newDisabledList[targetIndex].status = checked;
    } else {
      newDisabledList.push({
        url,
        status: checked
      })
    }

    dispatch(updateDisabledList(newDisabledList));
    StorageHelper.set({ key: 'disabledList', value: newDisabledList });

    setDisabledInputValue(checked);
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

  useEffect(() => {
    StorageHelper.get({ key: 'disabledList', callback: getDisabledList });
  }, [url]);

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
            <h5>Disable for this site</h5>
          </div>
          <label htmlFor="current">
            <input type="checkbox" name="current" id="current" onChange={handleDisableForThisSite} checked={disabledInputValue} />
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
