import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './navbar';

const Login = () => {
  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="auth-page">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p>Sign in to orchestrate today’s spa experiences with clarity.</p>
          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@tranquilflow.com" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="button button-primary">
              Log in
            </button>
          </form>
          <div className="auth-meta">
            Need an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
