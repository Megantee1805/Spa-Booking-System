import React from 'react';
import { css } from '@emotion/react';

const Login = () => {
  return (
    <div css={containerStyles}>
      <h2 css={headingStyles}>Login</h2>
      <form css={formStyles}>
        <div css={inputContainerStyles}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Enter your email" />
        </div>
        <div css={inputContainerStyles}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>
        <button type="submit" css={submitButtonStyles}>Login</button>
      </form>
    </div>
  );
};

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const headingStyles = css`
  font-size: 24px;
  margin-bottom: 20px;
`;

const formStyles = css`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

const inputContainerStyles = css`
  margin-bottom: 10px;
  label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  input {
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
`;

const submitButtonStyles = css`
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export default Login;
