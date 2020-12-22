import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen, saveSettings } from '../../actions';
import Select from '../Select';
import Range from '../Range';

import StorageHelper from '../../helpers/storage.helper';

const Settings = () => {
  const { dispatch, state } = useContext(MainContext);
  const data = [
    {
      label: 'Engine',
      type: 'select',
      value: 'davinci',
      options: ['ada', 'curie', 'davinci']
    },
    {
      label: 'Response Length',
      type: 'range',
      max: "400",
      min: "0"
    },
    {
      label: 'Temperature',
      type: 'range',
      max: "10",
      min: "0"
    },
    {
      label: 'Frequency Penalty',
      type: 'range',
      max: "10",
      min: "0"
    },
    {
      label: 'Presence Penalty',
      type: 'range',
      max: "10",
      min: "0"
    },
    {
      label: 'Best of',
      type: 'range',
      max: "10",
      min: "0"
    },
  ];
  const [values, setValues] = useState({
    engine: 'davinci',
    responseLength: '200',
    temperature: '4',
    frequencyPenalty: '0',
    presencePenalty: '0',
    bestOf: '10'
  });

  const handleBack = () => {
    dispatch(updateWizardScreen('generic'));
  };

  const handleOnChange = ({ item, index }, { target }) => {
    setValues(prevState => ({
      ...prevState,
      [Object.keys(values)[index]]: target.value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    dispatch(saveSettings(values));
    handleBack();
  };

  const getSettingsFromStorage = ({ showIcon, ...rest }) => {
    setValues(prevState => ({
      ...prevState,
      ...rest
    }));
  };

  useEffect(() => {
    if (!state.settings.responseLength) dispatch(saveSettings(values));

    StorageHelper.get({ key: 'settings', callback: getSettingsFromStorage });
  }, []);

  return (
    <div className="jaf-popup-settings">
      <form onSubmit={handleSave}>
        {
          data.map((item, index) => {
            const value = values[Object.keys(values)[index]];

            return (
              <div key={index.toString()}>
                <label>{item.label}</label>
                {
                  item.type === 'range' ? (
                    <Range {...{...item, label: item.label.toLowerCase().replace(' ', '_'), value, onChange: handleOnChange.bind(this, { item, index })}}/>
                  ) : (
                    <Select {...{...item, value, onChange: handleOnChange.bind(this, { item, index })}} />
                  )
                }
              </div>
            )
          })
        }
        <section className="jaf-popup-settings-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="submit" disabled={state.loading}>
            Save
          </button>
        </section>
      </form>
    </div>
  )
};

export default Settings;
