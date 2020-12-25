import React, { useContext, useState } from 'react';
import { MainContext } from '../../store';
import { updatePersonalData, updateWizardScreen } from '../../actions';
import StorageHelper from '../../helpers/storage.helper';

const WizardForm = () => {
  const { dispatch } = useContext(MainContext);
  const [label, setLabel] = useState('generic');
  const [value, setValue] = useState('');
  const [jsonData, setJsonData] = useState(false);

  const saveValue = ({ target }) => {
    setLabel('bio');
    setValue(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (jsonData) {
      const arr = [];

      if (JSON.parse(value)) {
        Object.keys(JSON.parse(value)).forEach((key) => {
          const item = {
            [key]: JSON.parse(value)[key]
          };

          arr.push(item);
        });
      };

      StorageHelper.save({ type: 'personal', data: arr });
      dispatch(updatePersonalData(arr));
    } else {
      StorageHelper.save({ type: 'personal', data: [{ answer: value, question: 'bio', type: 'personal' }] });
      dispatch(updatePersonalData([{ answer: value, question: 'bio', type: 'personal' }]));
    }

    StorageHelper.set({ key: 'wizard', value: 'generic' });
    dispatch(updateWizardScreen('generic'));
  };

  return (
    <div className="jaf-popup-wizard-form">
      <section>
        <div className="jaf-popup-wizard-generic-settings-item">
          <div>
            <h5>Json string</h5>
          </div>
          <label htmlFor="showIcon">
            <input type="checkbox" name="showIcon" id="showIcon" onChange={(e) => setJsonData(e.target.checked)} checked={jsonData} />
            <span />
          </label>
        </div>
      </section>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea name="bio" id="bio" onChange={saveValue} placeholder="Tell me about yourself" />
        </div>
        <section>
          <button type="button" onClick={handleSubmit}>Continue without save</button>
          <button type="submit">Save</button>
        </section>
      </form>
    </div>
  );
};

export default WizardForm;
