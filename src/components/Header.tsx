import React from 'react';
import logo from '../assets/VC83_Logo.png';

const Header: React.FC = () => {
  return (
    <div className="logo-container">
      <img src={logo} alt="VC83 BASIC Logo" />
    </div>
  );
};

export default Header;
