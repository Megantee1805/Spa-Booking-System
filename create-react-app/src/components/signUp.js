import React from 'react';
import { Link } from 'react-router-dom';
import AppNavbar from './navbar';

const Signup = () => {
  return (
    <div className="page-shell">
      <AppNavbar />
      <main className="auth-page">
        <div className="auth-card">
          <h2>Create your workspace</h2>
          <p>Set up a collaborative hub for your spa team in just a minute.</p>
          <form>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Full name" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@tranquilflow.com" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Create a secure password" />
            </div>
            <button type="submit" className="button button-primary">
              Sign up
            </button>
          </form>
          <div className="auth-meta">
            Already have access? <Link to="/login">Log in</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
