import React, { useContext, useState } from 'react';
import { MainContext } from '../../store';
import { updatePersonalData, updateWizardScreen } from '../../actions';
import StorageHelper from '../../helpers/storage.helper';

const WizardForm = () => {
  const { dispatch } = useContext(MainContext);
  const [label, setLabel] = useState('generic');
  const [value, setValue] = useState('');

  const saveValue = ({ target }) => {
    const labelEl = document.querySelector(`label[for="${target.id}"]`);

    setLabel(labelEl.innerText);
    setValue(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    StorageHelper.save({ type: 'personal', data: [{ bio: value, label }] });
    StorageHelper.set({ key: 'wizard', value: 'generic' });
    dispatch(updatePersonalData([{ bio: value, label }]));
    dispatch(updateWizardScreen('generic'));
  };

  return (
    <div className="jaf-popup-wizard-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bio">Tell me about yourself</label>
          <textarea name="bio" id="bio" onChange={saveValue} />
        </div>
        <section>
          <button type="button">Continue without save</button>
          <button type="submit">Save</button>
        </section>
      </form>
    </div>
  );
};

export default WizardForm;
