import React from 'react';
import { bool, func } from 'prop-types';
import ErrorGif from '../../../../assets/img/error.gif';

const Login = ({ errorModal, handleErrorModal, handleInputValue, handleSubmit }) => {
  return (
    <div className="jaf-popup-login">
      <h3>Login with JotForm account</h3>
      {
        errorModal && (
          <div className="jaf-popup-login-error">
            <img src={ErrorGif} alt="error-gif" />
            <p>Sorry! Username or password is wrong.</p>
            <button
              type="button"
              onClick={handleErrorModal}
            >Back</button>
          </div>
        )
      }
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
  );
};

Login.propTypes = {
  errorModal: bool,
  handleErrorModal: func,
  handleInputValue: func,
  handleSubmit: func
}

Login.defaultProps = {
  errorModal: false,
  handleErrorModal: f => f,
  handleInputValue: f => f,
  handleSubmit: f => f
}

export default Login;
