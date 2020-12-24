import React from 'react';
import { bool, func } from 'prop-types';
import ErrorGif from '../../../../assets/img/error.gif';
import LoginBg from '../../../../assets/img/login-bg.png';

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
          <a href="https://www.jotform.com/" target="_blank" rel="noreferrer">Forgot password?</a>
          <button type="submit">Login</button>
        </section>
      </form>
      <div className="jaf-popup-login-social">
        <h4>Login with Social Accounts</h4>
        <button type="button">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M13.5703 23.8982C19.4557 23.129 24 18.0952 24 12C24 5.37258 18.6274
              0 12 0C5.37258 0 0 5.37258 0 12C0 17.8831 4.23355 22.7774 9.82031
              23.8025V15.7188H6.70312V12.0859H9.82031V9.41474C9.82031 6.31485 11.7134
              4.62688 14.4786 4.62688L14.9654 4.63121C16.0752 4.65069 16.9831 4.73102
              17.2734 4.76959V8.00781L15.3605 8.00868C13.9232 8.00868 13.5966 8.66502 13.5719
              9.6427L13.5703 12.0859H17.1677L16.6992 15.7188H13.5703V23.8982Z"
              fill="white"
            />
          </svg>
          Login with Facebook
        </button>
        <button type="button">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle
              cx="12" cy="12" r="12"
              fill="white"
            />
            <path
              d="M12 6.48C13.69 6.48 14.83 7.21 15.48 7.82L18.02 5.34C16.46 3.89 14.43 3 12 3C8.47996 3 5.43996 5.02 3.95996 7.96L6.86996 10.22C7.59996 8.05 9.61996 6.48 12 6.48Z"
              fill="#EA4335"
            />
            <path
              d="M20.64 12.1999C20.64 11.4599 20.58 10.9199 20.45 10.3599H12V13.6999H16.96C16.86 14.5299 16.32 15.7799 15.12 16.6199L17.96 18.8199C19.66 17.2499 20.64 14.9399 20.64 12.1999Z"
              fill="#4285F4"
            />
            <path
              d="M6.88 13.78C6.69 13.22 6.58 12.62 6.58 12C6.58 11.38 6.69 10.78 6.87 10.22L3.96 7.95996C3.35 9.17996 3 10.55 3 12C3 13.45 3.35 14.82 3.96 16.04L6.88 13.78Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0002 20.9998C14.4302 20.9998 16.4702 20.1998 17.9602
            18.8198L15.1202 16.6198C14.3602 17.1498 13.3402 17.5198 12.0002 17.5198C9.62021 17.5198 7.60021 15.9498 6.88021 13.7798L3.97021 16.0398C5.45021 18.9798 8.48021 20.9998 12.0002 20.9998Z"
              fill="#34A853"
            />
          </svg>
          Login with Google
        </button>
      </div>
      <div className="jaf-popup-login-footer" style={{
        backgroundImage: `url(${LoginBg})`
      }}>
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
