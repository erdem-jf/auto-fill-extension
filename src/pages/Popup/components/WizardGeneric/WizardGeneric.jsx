import React, { useEffect, useState } from 'react';
import WizardBox from '../WizardBox';
import StorageHelper from '../../helpers/storage.helper';

import wizardData from '../../constants/wizardData';

const WizardGeneric = () => {
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

  const onWizardBoxClick = (type) => {
    console.log('type', type);
  };

  const getCount = (item, val) => {
    setCountObj(prevState => ({
      ...prevState,
      [item]: val ? val.length : 0
    }));
  }

  const getTabDetails = (tab) => {
    setActiveUrl(tab.url.split('?')[0].split('//')[1]);
  };

  const handleToggle = ({ target }) => {
    setInputValue(target.checked);
  };

  useEffect(() => {
    StorageHelper.getTab(getTabDetails);

    wizardData.forEach(item => {
      StorageHelper.get({ key: item, callback: getCount.bind(this, item) });
      console.log('here?');
    });
  }, []);

  return (
    <div className="jaf-popup-wizard-generic">
      <div className="jaf-popup-wizard-generic-settings">
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Disable for this page {activeUrl}</h5>
          </div>
            <label htmlFor="current">
              <input type="checkbox" name="current" id="current" onClick={handleToggle} defaultChecked={inputValue.current} />
              <span />
            </label>
        </div>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Show JF-AutoFill icon</h5>
          </div>
            <label htmlFor="show">
              <input type="checkbox" name="show" id="show" onClick={handleToggle} value={inputValue.show} />
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
