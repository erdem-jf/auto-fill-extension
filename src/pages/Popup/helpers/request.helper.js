import axios from 'axios';
import querystring from 'querystring';

function RequestHelper() {
  this.loginUrl = 'https://erdem.jotform.pro/API/user/login';
  this.userUrl = 'https://erdem.jotform.pro/API/user';

  this.login = async ({ username, password }) => {
    try {
      const response = axios.post(
        this.loginUrl,
        querystring.stringify({ username, password })
      );

      return response;
    } catch (err) {
      return err;
    }
  };

  this.getUser = async () => {
    try {
      const response = await axios.get('https://erdem.jotform.pro/API/user');

      return response;
    } catch (err) {
      return err;
    }
  };
}

export default new RequestHelper();
