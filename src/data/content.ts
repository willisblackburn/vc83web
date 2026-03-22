export interface PageContent {
  title: string;
  content: string;
}

export const navigationContent: Record<string, PageContent> = {
  about: {
    title: "About VC83 BASIC",
    content: `
VC83 BASIC is a high-performance BASIC interpreter for the Apple II family of computers, written entirely in 6502 assembly language. It aims to provide a modern programming experience while staying true to the constraints and charm of the early 8bit era.

Whether you are a retro enthusiast or a curious developer, VC83 offers a unique blend of speed, compatibility, and simplicity. Features include:
- Fast floating-point math routines.
- Support for classic BASIC syntax.
- Optimized for the Apple II+ hardware.
    `
  },
  manual: {
    title: "User Manual",
    content: `
### Getting Started
To begin programming, simply type your code into the emulator. Each line must start with a line number (e.g., \`10 PRINT "HELLO"\`).

### Essential Commands
- **NEW**: Clears the current program from memory.
- **LIST**: Displays the current program.
- **RUN**: Executes the current program.
- **CONT**: Continues execution after a Ctrl-C or STOP.
- **LOAD / SAVE**: Disk operations (simulated via local storage or file select).

### BASIC Syntax
VC83 BASIC supports standard constructs:
- **Variable Types**: Real (e.g., A), Integer (e.g., A%), String (e.g., A$).
- **Control Flow**: IF...THEN, FOR...NEXT, GOTO, GOSUB...RETURN.
- **Math**: +, -, *, /, SQR, RND, INT, ABS.
    `
  },
  technical: {
    title: "Technical Details",
    content: `
### Architecture
VC83 BASIC is built as a replacement for Applesoft BASIC, residing in the $D000-$FFFF memory range (Language Card/Firmware area). 

### Memory Map
- **$0000-$07FF**: Zero Page, Stack, and System Globals.
- **$0800-$BFFF**: User Program and Variable Space.
- **$C000-$CFFF**: I/O Space.
- **$D000-$FFFF**: VC83 BASIC Interpreter ROM.

### Implementation
The interpreter use a custom bytecode format for efficiency, with a highly optimized expression evaluator and garbage-collected string heap. It was developed using modern 6502 cross-assemblers (ca65) and tested extensively on both original hardware and the apple2ts emulator.
    `
  }
};
