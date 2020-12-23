import Content from './Content';
import StorageHelper from '../Popup/helpers/storage.helper';

window.onload = () => {
  let userIsExist = false;
  let showIcon = false;

  const getUserFromStorage = (user) => {
    userIsExist = user;
  };

  const getSettingsFromStorage = (settings) => {
    showIcon = (settings && settings.showIcon) || false;
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
    if (userIsExist) Content.init({ showIcon });
  };

  const initialRender = () => {
    Content.listenContextMenu();
    Content.listenFormData();
    getDetails();

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      Object.keys(changes).forEach((key) => {
        if (key === 'settings') {
          console.log(changes[key]);
          render({
            showIcon: changes[key].newValue.showIcon,
          });
        }
      });
    });
  };

  initialRender();

  setTimeout(() => {
    render({ showIcon });
  }, 1000);
};
