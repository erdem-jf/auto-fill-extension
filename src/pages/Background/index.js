import RequestHelper from '../Popup/helpers/request.helper';
import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

class Background {
  constructor() {
    this.clickHandler = this.clickHandler.bind(this);
    this.handleWebRequest = this.handleWebRequest.bind(this);
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

  async completions(prompt) {
    const options = {
      engine: 'davinci',
      prompt,
      max_tokens: 200,
      temperature: 0,
      top_p: 1,
      stop: ['Q'],
    };

    const result = await RequestHelper.completions(options);

    return result;
  }

  async generate(params) {
    const options = {
      engine: 'davinci',
      // context: 'Q: Who discovered the America?',
      stream: false,
      stop: '/n',
      length: 400,
      best_of: 1,
      completions: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0.4,
      top_p: 1,
      ...params,
    };

    const result = await RequestHelper.generate(options);

    return result;
  }

  syncData() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      console.log('msg.type', msg.type);
      if (msg.type === 'CATEGORIZE_DATA') {
        this.search(msg.query).then((res) => {
          sendResponse(res);
        });
      }

      if (msg.type === 'GENERATE_DATA') {
        this.generate({ context: msg.context }).then((res) => {
          sendResponse(res);
        });
      }

      if (msg.type === 'COMPLETION') {
        this.completions(msg.prompt).then((res) => {
          sendResponse(res);
        });
      }

      return true;
    });
  }

  clickHandler(info, tab) {
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
      onclick: this.clickHandler,
    });

    chrome.contextMenus.create({
      title: 'Fill the all form',
      parentId: 'jf',
      contexts: ['all'],
      onclick: this.fillAllForm,
    });

    chrome.contextMenus.create({
      title: 'Inspect',
      parentId: 'jf',
      contexts: ['all'],
      onclick: () => alert('Not yet Samurai!'),
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
