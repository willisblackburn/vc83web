---
trigger: always_on
---

# VC83 Web Site (vc83web)

## About the project

This web site hosts the documentation for the VC83 BASIC interpreter and includes an embedded Apple II emulator (`apple2ts`) running the Apple II version of VC83 BASIC (`vc83basic`) so users can try it in the browser.

## Architecture and Build

- **Frontend (`src/`)**: React 19 + TypeScript single-page application bundled with Vite and deployed to Firebase Hosting (`vc83web`).
- **Submodules (`submodules/`)**:
  - `submodules/apple2ts`: The Apple II emulator engine.
  - `submodules/vc83basic`: The 6502 assembly source for VC83 BASIC.
- **Build pipeline (`package.json`)**:
  - `npm run build:basic`: Compiles `basic_apple2` and `basic_apple2_lc` in `submodules/vc83basic`.
  - `npm run build:emulator`: Copies built `apple2ts` assets into `public/emulator/`.
  - `npm run build:disk`: Uses AppleCommander (`ac`) and `dsk2woz` to package `VC83BASIC`, `VC83BASIC_LC`, and `HELLO` into `public/emulator/disks/vc83basic.woz`.
  - `npm run build`: Runs the full build (`build:basic`, `build:emulator`, `build:disk`, `tsc -b`, and `vite build`).
