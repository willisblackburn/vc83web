import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <p>VC83 BASIC &copy; {new Date().getFullYear()} Willis Blackburn</p>
      <p>Apple II emulator &copy; {new Date().getFullYear()} Chris Torrence</p>
    </footer>
  );
};

export default Footer;
