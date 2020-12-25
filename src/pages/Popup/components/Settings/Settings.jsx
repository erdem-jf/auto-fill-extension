import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen, saveSettings } from '../../actions';
import Select from '../Select';
import Range from '../Range';

import StorageHelper from '../../helpers/storage.helper';

const Settings = () => {
  const { dispatch, state } = useContext(MainContext);
  const stepValues = [0.2, 0.4, 0.6, 0.8, 1];
  const data = [
    {
      label: 'Engine',
      type: 'select',
      value: 'instruct-davinci-beta',
      options: ['ada', 'curie', 'davinci', 'instruct-curie-beta', 'instruct-davinci-beta']
    },
    {
      label: 'Approximate Response Length',
      type: 'range',
      max: "400",
      min: "0"
    },
    {
      label: 'Temperature',
      type: 'range',
      max: "1",
      min: "0",
      step: "0.1"
    },
    {
      label: 'Frequency Penalty',
      type: 'range',
      max: "1",
      min: "0",
      step: "0.1"
    },
    {
      label: 'Presence Penalty',
      type: 'range',
      max: "1",
      min: "0",
      step: "0.1"
    },
    {
      label: 'Best of',
      type: 'range',
      max: "20",
      min: "1",
      step: "1"
    },
  ];
  const [values, setValues] = useState({
    engine: 'instruct-davinci-beta',
    length: '400',
    temperature: '0.4',
    frequency_penalty: '0.2',
    presence_penalty: '0.2',
    best_of: '1'
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

  const handleStepChange = (step, type) => e => {
    type === 'creativeFreedom' ?
      setValues(prevState => ({
        ...prevState,
        temperature: step
      })) :
      setValues(prevState => ({
        ...prevState,
        frequency_penalty: step,
        presence_penalty: step,
      }));
  }

  const handleSettingChange = ({ target }) => {
    const newSettings = {
      [target.name]: target.checked
    };

    dispatch(saveSettings(newSettings));
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
      <div className='limits orange'>
        <div className='label'>
          <span>Creative Tokens</span>
          <span>6256 / 10.000</span>
        </div>
        <div className='fakeRange' />
      </div>
      <div className='limits blue'>
        <div className='label'>
          <span>Upload Space</span>
          <span>128mb / 1GB</span>
        </div>
        <div className='fakeRange' />
      </div>
      <hr />
      <form onSubmit={handleSave}>
        <b><label>Creative Response Settings</label></b>
        <div className='element'>
          <label>{data[1].label}</label>
          <Range {...{ ...data[1], label: data[1].label.toLowerCase().replace(' ', '_'), value: values.length, onChange: handleOnChange.bind(this, { item: data[1], index: 1 }) }} />
        </div>
        <div className='element'>
          <label>Creative Freedom</label>
          <div className='seperated'>
            {stepValues.map(step => {
              return <div
                className='part'
                onClick={handleStepChange(step, 'creativeFreedom')}
                style={{ backgroundColor: values.temperature >= step ? '#ffa54b' : '#C4C4C4' }}
              />
            })}
          </div>
        </div>
        <div className='element'>
          <label>Generate Unique Responses</label>
          <div className='seperated'>
            {stepValues.map(step => {
              return <div
                className='part'
                onClick={handleStepChange(step, 'uniqueResponse')}
                style={{ backgroundColor: values.frequency_penalty >= step ? '#ffa54b' : '#C4C4C4' }}
              />
            })}
          </div>
        </div>
        <hr />
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            Capture Form Inputs
          </div>
          <label htmlFor="captureInput">
            <input type="checkbox" name="captureInput" id="captureInput" onChange={handleSettingChange} checked={state.settings.captureInput} />
            <span />
          </label>
        </div>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            Show AutoFill Icon
          </div>
          <label htmlFor="showIcon">
            <input type="checkbox" name="showIcon" id="showIcon" onChange={handleSettingChange} checked={state.settings.showIcon} />
            <span />
          </label>
        </div>
        <hr />
        <section className="jaf-popup-settings-footer">
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="submit" disabled={state.loading}>
            Save
          </button>
        </section>
      </form >
    </div >
  )
};

export default Settings;
