import React, { useContext, useEffect, useState } from 'react';
import StorageHelper from '../../helpers/storage.helper';
import { MainContext } from '../../store';
import { updateWizardScreen } from '../../actions';

const CollectedView = () => {
  const { dispatch } = useContext(MainContext);
  const [data, setData] = useState({});

  const handleBack = () => {
    dispatch(updateWizardScreen('generic'));
  }

  const getCollectedData = (collected) => {
    setData(prevState => ({
      ...prevState,
      ...collected
    }));
  };

  useEffect(() => {
    console.log('collected view mounted');
    StorageHelper.get({ key: 'collected', callback: getCollectedData });
  }, []);

  return (
    <div className="jaf-popup-collected">
      <button onClick={handleBack}>{`<- back`}</button>
      <ul>
        {
          Object.keys(data).map((key, index) => {
            const label = Object.keys(data[key])[0];
            const value = Object.values(data[key])[0];
            return (
              <li key={index.toString()}>
                <span>{label}</span>
                <p>{value}</p>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
};

export default CollectedView;
