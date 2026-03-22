import React from 'react';
import logo from '../assets/VC83_Logo.png';

const Header: React.FC = () => {
  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="VC83 BASIC Logo" />
      </div>
      <h1>VC83 BASIC</h1>
      <p>The Ultimate BASIC for the Apple II</p>
    </header>
  );
};

export default Header;
