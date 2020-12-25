import axios from 'axios';
import querystring from 'querystring';
import StorageHelper from './storage.helper';

function RequestHelper() {
  this.appKey = '';
  // this.loginUrl = 'https://api.jotform.com/user/login';
  this.loginUrl = 'https://erdem.jotform.pro/API/user/login';
  this.logoutUrl = 'https://erdem.jotform.pro/API/user/logout';
  this.userUrl = `https://erdem.jotform.pro/API/user?apiKey=${this.appKey}`;
  this.completionUrl = 'http://erdem.jotform.pro:21105/ai/completions';
  this.searchUrl = 'http://erdem.jotform.pro:21105/ai/search';
  this.generateUrl = 'http://erdem.jotform.pro:21105/ai/generate';

  this.getUserData = (user) => {
    if (user && user.appKey) {
      this.appKey = user.appKey;
      return;
    }

    console.log('appKey not exist!');
  };

  this.init = () => {
    StorageHelper.get({ key: 'user', callback: this.getUserData });
  };

  this.login = async ({ username, password }) => {
    try {
      const response = await axios.post(
        this.loginUrl,
        querystring.stringify({
          username,
          password,
          appName: 'localhost',
          access: 'readOnly',
        })
      );

      console.log('response', response);

      return response;
    } catch (err) {
      return err;
    }
  };

  this.getUser = async () => {
    try {
      const response = await axios.get(this.userUrl);

      return response;
    } catch (err) {
      return err;
    }
  };

  this.search = async (options) => {
    try {
      const response = await axios.post(this.searchUrl, options);

      return response;
    } catch (err) {
      return err;
    }
  };

  this.completions = async (options) => {
    try {
      const response = await axios.post(this.completionUrl, options);

      return response;
    } catch (err) {
      return err;
    }
  };

  this.generate = async (options) => {
    try {
      const response = await axios.post(this.generateUrl, options);

      return response;
    } catch (err) {
      console.log('err', err);
      return err;
    }
  };

  this.init();
}

export default new RequestHelper();
