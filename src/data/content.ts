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
### 1. Immediate Mode
You can enter any BASIC statement without a line number to execute it immediately. This is useful for calculations or testing commands.
- **Example**: \`PRINT 12 * (3 + 4)\` displays \`84\`.
- **Example**: \`INPUT A$: PRINT "HELLO ";A$\`

### 2. Entering and Editing the Program
Lines starting with a line number (1–65535) are stored in memory as part of your program.
- **Add/Replace**: Type a line number followed by the statement. Re-entering an existing line number replaces it.
- **Delete**: Type the line number by itself and press Enter.
- **LIST**: Displays the program. Use \`LIST 100\` for a specific line, or \`LIST 10,100\` for a range.
- **NEW**: Erases the entire program and all variables from memory.

### 3. Running the Program
- **RUN**: Starts execution from the lowest line number.
- **STOP**: Pauses execution. You can inspect or change variables in immediate mode.
- **CONT**: Resumes execution from where it was paused.
- **END**: Gracefully terminates the program.
- **CLR**: Resets all variables and arrays to zero/empty, but keeps the program.
- **Reset**: Press the Reset button on the emulator to regain control if a program is in an infinite loop.

### 4. Expressions
VC83 supports standard mathematical and string operators:
- **Math**: \`+\`, \`-\`, \`*\`, \`/\`, \`^\` (exponentiation).
- **Strings**: \`&\` (concatenation).
- **Relational**: \`=\`, \`<\`, \`>\`, \`<>\`, \`<=\`, \`>=\`.

### 5. Controlling Program Flow
- **IF**: \`IF [condition] THEN [statement]\` (or line number). Executes the rest of the line only if the condition is true.
- **Logic**: \`AND\`, \`OR\`, \`NOT\` for complex conditions.
- **FOR...TO...STEP / NEXT**: Standard loop structure.
- **GOTO / GOSUB / RETURN**: Branching and subroutines.
- **POP**: Removes the top GOSUB or FOR entry from the stack. Use this if you need to exit a loop or subroutine prematurely.

### 6. Statements
VC83 BASIC includes a full suite of standard statements:
- **CLR**: Resets all variables.
- **CONT**: Continues after STOP.
- **DATA**: Defines data for READ. (Example: \`DATA 10, 20, "CAT"\`)
- **DIM**: Declares an array. (Example: \`DIM A(10, 10)\`)
- **END**: Ends program execution.
- **FOR**: Starts a loop. (Example: \`FOR I = 1 TO 10 STEP .5\`)
- **GOSUB**: Calls a subroutine. (Example: \`GOSUB 1000\`)
- **GOTO**: Jumps to a line. (Example: \`GOTO 500\`)
- **IF**: Conditional execution. (Example: \`IF X > 0 THEN PRINT "OK"\`)
- **INPUT**: Gets user input. (Example: \`INPUT "NAME? ";N$\`)
- **LET**: Assigns a value (Optional). (Example: \`LET A = 5\` or \`A = 5\`)
- **LIST**: Shows the program.
- **NEW**: Clears program and variables.
- **NEXT**: End of a FOR loop.
- **ON ... GOTO / GOSUB**: Computed jump. (Example: \`ON X GOTO 10, 20, 30\`)
- **POKE**: Writes to memory. (Example: \`POKE 49152, 0\`)
- **POP**: Clears stack entry.
- **PRINT** (or **?**): Outputs text/data. (Example: \`PRINT "HI"; X\`)
- **READ**: Reads next DATA item. (Example: \`READ A, B, C$\`)
- **REM**: Indicates a comment.
- **RESTORE**: Resets DATA pointer.
- **RETURN**: Returns from GOSUB.
- **RUN**: Executes the program.
- **STOP**: Pauses the program.

### 7. Functions
- **ABS(N)**: Absolute value.
- **ADR(V$)**: Returns the memory address of string data.
- **ASC(S$)**: ASCII value of first character.
- **ATN(N)**: Arctangent.
- **CHR$(N)**: Character from ASCII value.
- **COS(N)**: Cosine.
- **EXP(N)**: e to the power of N.
- **FRE(0)**: Remaining free memory in bytes.
- **INT(N)**: Truncates towards zero.
- **LEFT$(S$, N)**: N leftmost characters.
- **LEN(S$)**: Length of string.
- **LOG(N)**: Natural logarithm.
- **MID$(S$, P, N)**: N characters starting from P.
- **PEEK(A)**: Reads from memory address.
- **RIGHT$(S$, N)**: N rightmost characters.
- **RND(N)**: Random number (0–1).
- **ROUND(N)**: Rounds to nearest integer.
- **SGN(N)**: Sign of number (-1, 0, 1).
- **SIN(N)**: Sine.
- **SQR(N)**: Square root.
- **STR$(N)**: Number to string.
- **TAN(N)**: Tangent.
- **USR(A, N)**: Calls machine code at A with argument N.
- **VAL(S$)**: String to number.
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
  },
  contributing: {
    title: "Contributing",
    content: `
VC83 is an open-source project. You can find the source code and contribute to its 
development on [GitHub](https://github.com/willisblackburn/vc83basic).  
    `
  }
};
