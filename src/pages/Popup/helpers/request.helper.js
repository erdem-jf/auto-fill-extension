import axios from 'axios';
import querystring from 'querystring';

function RequestHelper() {
  this.appKey = '';
  this.loginUrl = 'https://erdem.jotform.pro/API/user/login';
  this.logoutUrl = 'https://erdem.jotform.pro/API/user/logout';
  this.userUrl = () =>
    'https://erdem.jotform.pro/API/user?apiKey=1142c521c02ec0c35fa79bc469a9d2b8';

  this.saveAppKey = (key) => {
    this.appKey = key;
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

      return response;
    } catch (err) {
      return err;
    }
  };

  this.getUser = async () => {
    try {
      const response = await axios.get(this.userUrl());

      return response;
    } catch (err) {
      return err;
    }
  };
}

export default new RequestHelper();
