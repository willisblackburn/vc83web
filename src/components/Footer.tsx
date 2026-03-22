import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} VC83 BASIC Project. All rights reserved.</p>
      <p>Built with <a href="https://github.com/ct6502/apple2ts">apple2ts</a> by Chris Torrence.</p>
    </footer>
  );
};

export default Footer;
