import React from 'react';

const Project: React.FC = () => {
  return (
    <>
      <h2>About the Project</h2>
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
        <li>Optimized for the Apple II family.</li>
      </ul>

      <h2>Contributing</h2>
      <p>
        Contributions to VC83 BASIC are welcome! If you find a bug, 
        have a feature request, or want to improve the codebase, 
        please feel free to open an issue or submit a pull request 
        on the GitHub repository.
      </p>
      <p>
        We are especially interested in performance optimizations, 
        new built-in functions, and improvements to the technical 
        documentation.
      </p>
    </>
  );
};

export default Project;
