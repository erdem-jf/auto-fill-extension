import React, {  useContext, useState } from 'react';
import { MainContext } from '../../store';
import { updateWizardScreen } from '../../actions';

const WizardNew = () => {
  const { dispatch } = useContext(MainContext);
  const [formData, setFormData] = useState([
    {
      question: 'What is the name of your first pet?',
      answer: 'Joe',
      id: 'collected'
    }
  ]);

  const handleBack = () => {
    dispatch(updateWizardScreen('generic'));
  }

  const handleRemoveCard = (index) => {
    const newFormData = formData.reduce((payload, item, i) => {
      const arr = payload;

      if (i !== index) arr.push(item);

      return arr;
    }, []);

    setFormData(newFormData);
  };

  const handleAddNewQuery = (index) => {
    const newFormData = [...formData, ...[{
      question: '',
      answer: '',
      id: 'collected'
    }]];

    setFormData(newFormData);
  };

  const handleInputOnChange = (index, type, { target }) => {
    console.log('target.value', target.value);

    const newFormData = formData.reduce((payload, item, i) => {
      const arr = payload;

      if (index === i) item[type] = target.value;
      arr.push(item);

      return arr;
    }, []);

    setFormData(newFormData);
  };

  return (
    <div className="jaf-popup-wizard-new">
      <form>
        {
          formData.map((item, index) => {
            return (
              <div key={index.toString()}>
                <h4>
                  <span>Question</span>
                  <button type="button" onClick={handleRemoveCard.bind(this, index)}>-</button>
                </h4>
                <input type="text" name={item.id} id={item.id} aria-label={item.id} onChange={handleInputOnChange.bind(this, index, 'question')} value={formData[index].question} />
                <h4>Answer</h4>
                <input type="text" name={item.id} id={item.id} aria-label={item.id} onChange={handleInputOnChange.bind(this, index, 'answer')} value={formData[index].answer} />
                {/* <h4>Type</h4>
                <input type="text" name={item.id} id={item.id} aria-label={item.id} onChange={handleInputOnChange.bind(this, index, 'type')} value={formData[index].id} /> */}
              </div>
            );
          })
        }
        <section>
          <button type="button" onClick={handleBack}>
            Back
          </button>
          <button type="button" onClick={handleAddNewQuery}>
            + Card
          </button>
          <button type="submit">
            Save
          </button>
        </section>
      </form>
      {
        formData.length > 1 && (
          <div className="jaf-popup-wizard-new-overlay" />
        )
      }
    </div>
  );
};

export default WizardNew;
