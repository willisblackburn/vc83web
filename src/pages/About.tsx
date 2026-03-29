import React from 'react';

const About: React.FC = () => {
  return (
    <>
      <p>
        VC83 BASIC is a high-performance BASIC interpreter for the Apple II family of computers, 
        written entirely in 6502 assembly language. It aims to provide a modern programming 
        experience while staying true to the constraints and charm of the early 8-bit era.
      </p>
      <p>
        Whether you are a retro enthusiast or a curious developer, VC83 offers a unique blend 
        of speed, compatibility, and simplicity. Features include:
      </p>
      <ul>
        <li>Fast floating-point math routines.</li>
        <li>Support for classic BASIC syntax.</li>
        <li>Optimized for the Apple II+ hardware.</li>
      </ul>
    </>
  );
};

export default About;
