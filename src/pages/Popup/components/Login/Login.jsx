import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../../store';
import { setUserDetails } from '../../actions';
import RequestHelper from '../../helpers/request.helper';

const Login = () => {
  const { dispatch, state } = useContext(MainContext);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleInputValue = ({ target: input }) => {
    setLoginData(prevState => ({
      ...prevState,
      [input.name]: input.value
    }));
  }

  const writeResponseIntoStore = (result) => {
    if (result.data.responseCode !== 200) return;

    dispatch(setUserDetails(result.data.content));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await RequestHelper.login(loginData);
    writeResponseIntoStore(result);
  }

  const getUserDetails = async () => {
    const result = await RequestHelper.getUser();
    writeResponseIntoStore(result);
  }

  useEffect(() => {
    getUserDetails();
  });

  return (
    <div className="jaf-popup-login">
      <h3>Login with JotForm account</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={handleInputValue}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleInputValue}
          />
        </div>
        <section>
          <button type="submit">Login</button>
          <a href="https://www.jotform.com/" target="_blank" rel="noreferrer">Forgot password?</a>
        </section>
      </form>
      <div className="jaf-popup-login-footer">
        <h4>Don't have a JotForm account yet?</h4>
        <a href="https://www.jotform.com/" target="_blank" rel="noreferrer">Create an account</a>
      </div>
    </div>
  )
}

export default Login;
