# VC83 BASIC Web Project

This project provides a retro-themed website featuring an Apple II+ emulator running VC83 BASIC.

## Prerequisites

To build and run this project, you will need the following tools installed on your system:

- **Node.js**: (v18 or later recommended) for the Vite development server and bundling.
- **cc65**: A 6502 development suite required to compile the VC83 BASIC source.
- **AppleCommander (ac)**: A command-line utility for manipulating Apple II disk images.
- **dsk2woz**: A utility to convert `.dsk` images to `.woz` format.
- **Make**: To run the build scripts for the BASIC interpreter.

## Getting Started

### 1. Clone the Project and Submodules

Clone this repository and ensure the submodules for `apple2ts` and `vc83basic` are initialized:

```bash
git clone --recursive <repository-url>
# OR if already cloned:
git submodule update --init --recursive
```

### 2. Install Dependencies

Install the necessary Node.js packages and build the emulator engine:

```bash
# Install root dependencies
npm install

# Build the apple2ts emulator submodule
# This only needs to be run once unless you update the submodule
cd submodules/apple2ts
npm install
npm run build
cd ../..
```

### 3. Build the VC83 BASIC Binary

Compile the assembly source for the BASIC interpreter:

```bash
cd submodules/vc83basic
make
cd ../..
```

### 4. Build and Package the Website

You can perform a selective build that copies only essential emulator files and creates the disk image:

```bash
# Full build: creates the disk and bundles the site
npm run build

# Or selective steps:
npm run build:emulator   # Copies only essential emulator engine files
npm run build:disk       # Generates vc83basic.woz and places it in public/
```

## Running the Project

Launch the local development server to view the website:

```bash
npm run dev
```

The website will be available at `http://localhost:5173/`.

### Building for Production

To perform a full build (including disk creation) and prepare for deployment:

```bash
npm run build
```

### Cleanup

To remove all build artifacts and generated assets:

```bash
npm run clean
```

## Project Structure

- `src/`: React source code for the website.
- `public/`: Static assets, including the integrated emulator and disk images.
- `submodules/apple2ts`: The Apple II emulator engine.
- `submodules/vc83basic`: The 6502 assembly source for VC83 BASIC.
