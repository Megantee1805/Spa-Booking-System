import React from 'react';
import { css } from '@emotion/react';

const Navbar = () => {
  return (
    <nav css={navStyles}>
      <ul css={navListStyles}>
        <li css={navItemStyles}>Home</li>
        <li css={navItemStyles}>About</li>
        <li css={navItemStyles}>Services</li>
        <li css={navItemStyles}>Contact</li>
      </ul>
    </nav>
  );
};

const navStyles = css`
  background-color: #333;
  color: #fff;
  padding: 10px;
`;

const navListStyles = css`
  list-style: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const navItemStyles = css`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

export default Navbar;
