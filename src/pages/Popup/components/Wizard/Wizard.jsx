import React, { useContext } from 'react';
import { MainContext } from '../../store';
import { removeUserData } from '../../actions';
import WizardForm from '../WizardForm';
import Header from '../Header';
import WizardGeneric from '../WizardGeneric';
import StorageHelper from '../../helpers/storage.helper';
import PodoImg from '../../../../assets/img/podo.png';

const Wizard = () => {
  const { dispatch, state } = useContext(MainContext);

  const handleLogout = () => {
    ['user', 'personal', 'wizard', 'toggle'].forEach(key => StorageHelper.remove(key));
    dispatch(removeUserData());
  }

  const renderScreen = () => {
    const components = {
      bio: () => <WizardForm />,
      generic: () => <WizardGeneric />
    }

    return components[state.wizard.screen] ? components[state.wizard.screen]() : null;
  };

  return (
    <div className="jaf-popup-wizard">
      <Header
        avatarUrl={state.user.avatarUrl}
        PodoImg={PodoImg}
        username={state.user.username}
        email={state.user.email}
        handleLogout={handleLogout}
      />
      {renderScreen()}
    </div>
  );
};

export default Wizard;
