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
### Architecture & Memory Map
VC83 BASIC is designed as a high-performance replacement for Applesoft BASIC, typically residing in the \`$D000-$FFFF\` memory range (Language Card/Firmware area). 

**System Memory Map:**
- **$0000-$07FF**: Zero Page, Stack, and System Globals.
- **$0800-$BFFF**: User Program and Variable Space.
- **$C000-$CFFF**: I/O Space.
- **$D000-$FFFF**: VC83 BASIC Interpreter ROM.

**Internal Memory Management:**
The interpreter uses several zero-page pointers to manage dynamic structures:
- \`program_ptr\`: Start of the BASIC program (sequentially stored line records).
- \`variable_name_table_ptr\`: Start of the Variable Name Table (VNT).
- \`array_name_table_ptr\`: Points to the Array Name Table (ANT).
- \`free_ptr\`: First byte of free memory after the ANT.
- \`string_ptr\`: Bottom of the string space (grows downwards from himem_ptr).
- \`himem_ptr\`: The highest address used; ceiling for the string space.

### Parser Virtual Machine (PVM)
VC83 uses a domain-specific language (DSL) and a dedicated Parser Virtual Machine to tokenize programs.
- **Efficiency**: Keywords are replaced with 1-byte tokens for fast execution.
- **Validation**: Syntax errors are detected up-front during tokenization.
- **Reversibility**: The \`LIST\` command uses the PVM to expand tokens back into human-readable code.

### Floating Point Support
VC83 BASIC uses a custom 5-byte floating-point format:
- **Precision**: 32-bit fractional significand with an implied \`1.\` (similar to IEEE-754).
- **Exponent**: 8-bit, excess-128.
- **Registers**: Uses two main zero-page registers, \`FP0\` and \`FP1\`, with \`FPX\` extending \`FP0\` to 64-bit precision for intermediate calculations.
- **Operations**: Includes a full suite of unary (SIN, LOG, EXP, etc.) and binary (FADD, FMUL, etc.) operations.

### String Handling
Strings are managed via a robust garbage collection system:
- **Structure**: \`[Length Byte] [Data...] [Extra Byte 1] [Extra Byte 2]\`. The extra bytes store forwarding addresses during compaction.
- **Allocation**: New strings are created at \`string_ptr\`, which moves downwards.
- **Garbage Collection**: Triggered automatically when \`string_ptr\` reaches \`free_ptr\`, moving all referenced strings to the top of memory for efficient space recovery.

### VC83 vs. Microsoft BASIC
- **Variable Names**: Can be any length (standard BASIC is limited to 2 characters).
- **Efficiency**: Features a significantly more efficient string garbage collector to prevent the long "pauses" common in older interpreters.
    `
  },
  extending: {
    title: "Extending VC83",
    content: `
### Porting to a New Platform
VC83 BASIC is designed to be highly portable. To port the interpreter to a new 6502-based platform, follow these technical requirements.

#### 1. Linker Configuration (.cfg)
Create a custom \`ld65\` configuration file (e.g., \`platform/platform.cfg\`).
- **Memory Map**: Define \`ZEROPAGE\` (typically starting at \`$80\`), \`MAIN\` RAM, and any platform-specific areas like \`LC\` (bank-switched RAM).
- **Required Segments**:
  - \`CODE\`: The main interpreter logic.
  - \`VECTORS\`: Jump tables for opcodes and statements.
  - \`FUNCTABS\`: The function metadata table.
  - \`PARSER\`: PVM bytecode and name tables.
  - \`ZEROPAGE\`: 128 bytes of contiguous ZP space.
  - \`ONCE\`: Startup code that is only needed during initialization.

> [!TIP]
> **The ONCE Segment**: For disk-loaded applications, the \`ONCE\` segment can share address space with the \`BSS\` segment. This code runs first to initialize the system and is immediately overwritten by program data once the interpreter is ready.

#### 2. Memory & Zero-Page Utilization
- **Zero-Page**: VC83 requires approximately 128 bytes of contiguous zero-page space. This is where the virtual registers (\`FP0\`, \`FP1\`, \`BC\`, \`DE\`) and interpreter state pointers reside.
- **Buffers**:
  - \`line_buffer\`: A 256-byte area for storing a single line of BASIC text.
  - \`stack\`: The 6502 hardware stack (\`$0100-$01FF\`) is used for return addresses.
  - **Internal Stacks**: The interpreter manages its own primary and operator stacks within its memory space.

#### 3. Mandatory I/O Functions
Implement these functions in a platform-specific assembly file (e.g., \`platform_io.s\`):
- **readline**: Reads a line of text from the user into the \`buffer\`.
  - Must null-terminate the string.
  - Must return the length of the string in the \`A\` register.
- **write**: Writes a string of characters.
  - Address of string in \`AX\` (little-endian).
  - Length of string in \`Y\`.
- **putch**: Writes a single character to the output device.
  - Character passed in the \`A\` register.

#### 4. Extension Statements
You can add platform-specific commands (like \`GR\` or \`TEXT\` on Apple II) via the extension tables:
- **ex_statement_name_table**: List of uppercase command names (e.g., \`"COLOR"\`). Ending the list with a null byte or using \`name_table_end\`.
- **ex_statement_vectors**: Word-aligned jump table to the implementation routines (one per name in the table).

#### 5. Extension Functions
Functions (like \`PDL(n)\`) are defined in \`ex_function_table\`. Each entry consists of:
- **Handler Address**: \`.word handler_address - 1\`.
- **Metadata Byte**: 
  - **Bits 0-3**: Arity (number of expected arguments).
  - **Flags**:
    - \`PROLOG_POP_INT\` / \`PROLOG_POP_FP\`: Automatically pop arguments into X/Y or FP0.
    - \`EPILOG_PUSH_INT\` / \`EPILOG_PUSH_FP\`: Automatically push return value from A/X or FP0 back to the stack.

#### 6. Makefile Integration
Add your new platform to the root \`Makefile\`:
1. Add the platform name to the \`TARGETS\` variable.
2. Define the build rule for \`basic_{platform}.o\` (linking \`basic.s\` and your platform files).
3. Define the link rule for \`basic_{platform}\` using your custom \`.cfg\` file.
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
