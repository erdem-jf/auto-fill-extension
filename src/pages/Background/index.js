import RequestHelper from '../Popup/helpers/request.helper';
// import StorageHelper from '../Popup/helpers/storage.helper';
import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

class Background {
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
      max_tokens: 96,
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
      length: 200,
      best_of: 1,
      completions: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0.4,
      top_p: 1,
      ...params,
    };

    const result = await RequestHelper.generate(options);

    console.log('result', result);

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

  init() {
    this.syncData();
  }
}

new Background().init();
