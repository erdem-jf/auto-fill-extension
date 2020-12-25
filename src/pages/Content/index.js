import Content from './Content';
import StorageHelper from '../Popup/helpers/storage.helper';

window.jaf = {};

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
    console.log('showIcon', showIcon);
    Content.init({ showIcon });
  };

  const initialRender = () => {
    Content.listenContextMenu();
    Content.listenFormData();
    getDetails();

    chrome.storage.onChanged.addListener(function (changes, namespace) {
      Object.keys(changes).forEach((key) => {
        if (key === 'settings') {
          console.log('changes[key]', changes[key]);
          if (changes[key].newValue.hasOwnProperty('showIcon')) {
            render({
              showIcon: changes[key].newValue.showIcon,
            });
          }
        }

        if (key === 'fastAutoFill') {
          console.log('HERE?@@@@@@@@');
          Content.fastAutoFill = changes[key].newValue;
        }
      });
    });

    console.log('initialRender@@@');
  };

  initialRender();

  setTimeout(() => {
    StorageHelper.get({
      key: 'settings',
      callback: (settings) => {
        render({
          showIcon:
            typeof settings.showIcon === 'undefined'
              ? false
              : settings.showIcon,
        });
      },
    });
  }, 1000);
};
