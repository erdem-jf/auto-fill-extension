import Content from './Content';
import StorageHelper from '../Popup/helpers/storage.helper';

window.onload = () => {
  let userIsExist = false;
  let showIcon = false;

  const getUserFromStorage = (user) => {
    userIsExist = user;
  };

  const getSettingsFromStorage = (settings) => {
    console.log('settings@content/index');
    showIcon = settings.showIcon;
  };

  const funcs = {
    user: getUserFromStorage,
    settings: getSettingsFromStorage,
  };

  const getDetails = () => {
    ['user', 'settings'].forEach((key) => {
      StorageHelper.get({ key, callback: funcs[key] });
    });
  };

  const render = ({ showIcon }) => {
    console.log('render@Content');
    if (userIsExist) Content.init({ showIcon });
  };

  const initialRender = () => {
    console.log('initial render@Content');
    Content.listenContextMenu();
    getDetails();

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      Object.keys(changes).forEach((key) => {
        if (key === 'settings') {
          render({ showIcon: changes[key].newValue.showIcon });
        }
      });
    });
  };

  initialRender();
  setTimeout(() => {
    render({ showIcon });
  }, 1000);
};
