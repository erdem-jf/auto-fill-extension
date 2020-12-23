import RequestHelper from '../Popup/helpers/request.helper';
import StorageHelper from '../Popup/helpers/storage.helper';
import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

class Background {
  constructor() {
    this.fillArea = this.fillArea.bind(this);
    this.fillAllForm = this.fillAllForm.bind(this);
    this.handleWebRequest = this.handleWebRequest.bind(this);
  }

  settingsStringToNumber(settings) {
    const newSettings = {};

    Object.keys(settings).forEach &&
      Object.keys(settings).forEach((key) => {
        console.log('key', key === 'engine');
        if (key === 'engine') {
          newSettings[key] = settings[key];
        } else {
          newSettings[key] = Number(settings[key]);
        }
      });

    return newSettings;
  }

  async search(query) {
    const options = {
      engine: 'davinci',
      documents: ['information', 'idea', 'personal', 'history'],
      query,
    };

    const result = await RequestHelper.search(options);

    return result;
  }

  async completions({ prompt, settings }) {
    const newSettings = this.settingsStringToNumber(settings);
    const { showIcon, length, ...rest } = newSettings;
    console.log('rest', rest);

    const options = {
      engine: 'davinci',
      prompt,
      max_tokens: 200,
      temperature: 0.4,
      frequency_penalty: 0.6,
      presence_penalty: 0.2,
      top_p: 1,
      stop: ['Q:'],
      best_of: 1,
      ...rest,
    };

    const result = await RequestHelper.completions(options);

    return result;
  }

  async generate({ context, settings }) {
    const { showIcon, ...rest } = this.settingsStringToNumber(settings);
    console.log('newSettings', rest);

    const options = {
      engine: 'davinci',
      // context: 'Q: Who discovered the America?',
      stream: false,
      stop: '/n',
      length: 400,
      best_of: 1,
      completions: 1,
      frequency_penalty: 0.6,
      presence_penalty: 0.2,
      temperature: 0.4,
      top_p: 1,
      context,
      ...rest,
    };

    const result = await RequestHelper.generate(options);

    return result;
  }

  syncData() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      StorageHelper.get({
        key: 'settings',
        callback: (settings) => {
          if (msg.type === 'CATEGORIZE_DATA') {
            this.search(msg.query).then((res) => {
              sendResponse(res);
            });
          }

          if (msg.type === 'GENERATE_DATA') {
            this.generate({ context: msg.context, settings }).then((res) => {
              sendResponse(res);
            });
          }

          if (msg.type === 'COMPLETION') {
            this.completions({
              prompt: msg.prompt,
              settings,
            }).then((res) => {
              sendResponse(res);
            });
          }
        },
      });

      return true;
    });
  }

  fillArea(info, tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'getClickedEl' }, ({ msg }) => {
      console.log(msg);
    });
  }

  fillAllForm(info, tab) {
    chrome.tabs.sendMessage(tab.id, { type: 'fillAllForm' }, ({ msg }) => {
      console.log(msg);
    });
  }

  createContextMenu() {
    chrome.contextMenus.create({
      title: 'JotForm Auto-Fill',
      id: 'jf',
      contexts: ['all'],
    });

    chrome.contextMenus.create({
      title: 'Fill this area',
      parentId: 'jf',
      contexts: ['all'],
      onclick: this.fillArea,
    });

    chrome.contextMenus.create({
      title: 'Fill the all form',
      parentId: 'jf',
      contexts: ['all'],
      onclick: this.fillAllForm,
    });
  }

  handleWebRequest() {
    const arr = [];

    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (details.method === 'POST') {
          const formData = details.requestBody.formData;

          if (formData) {
            Object.keys(formData).forEach((key) => {
              const item = {
                [key]: formData[key][0],
              };

              arr.push(item);
            });
          }
        }
      },
      { urls: ['<all_urls>'] },
      ['requestBody']
    );

    chrome.webRequest.onCompleted.addListener(
      (details) => {
        if (details.method === 'POST' && details.type === 'main_frame') {
          setTimeout(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(
                tabs[0].id,
                { type: 'getFormData', data: arr },
                (response) => {
                  console.log('response received', response);
                }
              );
            });
          }, 1000);
        }
      },
      { urls: ['<all_urls>'] },
      ['responseHeaders']
    );
  }

  init() {
    this.syncData();
    this.createContextMenu();
    this.handleWebRequest();
  }
}

new Background().init();
