import React from 'react';

const Project: React.FC = () => {
  return (
    <>
      <h2>About the Project</h2>
      <p>
        VC83 is a cross-platform BASIC interpreter for the 6502.
        Although on this web site it runs in an Apple II emulator, it was intended as a native BASIC
        for new 6502-based retrocomputer projects. My aim was to provide a feature-rich BASIC that
        was well-documented, tested, and adaptable to any project. 
      </p>
      <p>
        VC83 BASIC is available to you under the terms of the MIT License.
        You're welcome to use it with or without changes in your own projects,
        provided you adhere to the license terms.
        No need to ask permission, just fork and go!
      </p>
      <p>
        The VC83 name itself and logo are restricted.
        You can share the official version, but if you want to maintain your own fork and not
        contribute changes back to the project, you can't call it "VC83 BASIC."
        Just call it something else!
      </p>
      <h2>Contributing</h2>
      <p>
        If you find a bug, 
        have a feature request, or want to improve the codebase, 
        please feel free to open an issue or submit a pull request 
        on the GitHub repository.
      </p>
      <p>
        Pull requests are welcome, but we can't guarantee that we'll merge them.
        To improve the chance of your contribution being accepted,
        please reach out or open an issue to discuss your proposed changes before starting work.
      </p>
      <p>
        By contributing code to this project, you agree to license your contribution under the MIT License.
      </p>
    </>
  );
};

export default Project;
