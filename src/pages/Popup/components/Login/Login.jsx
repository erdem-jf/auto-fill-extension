import React from 'react';

const Login = () => {
  return (
    <div className="jaf-popup-login">
      <h3>Login with JotForm account</h3>
      <form>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
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
