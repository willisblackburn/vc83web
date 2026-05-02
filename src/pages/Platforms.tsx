import React from 'react';

const Platforms: React.FC = () => {
  return (
    <>
      <h2>Platforms &amp; Extending VC83 BASIC</h2>
      <p>
        VC83 BASIC abstracts the core interpreter logic
        away from platform-specific hardware details. The interpreter can be adapted to run on 
        6502-based retrocomputers, homebrew systems, and software simulators.
      </p>
      <p>
        This page explains the currently supported platforms, how to
        port VC83 BASIC to a new 6502 architecture, and how to extend the language with custom statements and functions.
      </p>

      <h2>Supported Platforms</h2>
      <p>
        VC83 BASIC currently supports the following platforms.
      </p>

      <h3>sim6502 (Simulator)</h3>
      <p>
        The <code>sim6502</code> target is primarily used for rapid development and automated unit testing on modern host 
        machines. It runs within the <code>sim65</code> simulator provided by the cc65 toolchain. Because there is no real 
        video or keyboard hardware to interface with, I/O is handled via a paravirtualization API. The code pushes arguments 
        onto a software stack and calls imported C library functions (like <code>_read</code> and <code>_write</code>). The 
        simulator intercepts these calls and translates them into POSIX standard I/O calls on the host OS. This platform 
        demonstrates how minimal a port can be when the environment provides higher-level abstractions.
      </p>

      <h3>Apple II</h3>
      <p>
        The Apple II port represents a classic, highly constrained 8-bit environment. It integrates with ProDOS or DOS 3.3 for 
        disk operations. The Apple II architecture poses interesting challenges, such as its fragmented memory map and the use 
        of bank-switched memory (the Language Card). 
      </p>
      <p>
        The <code>apple2_lc</code> target specifically loads the core interpreter into the Language Card RAM, freeing up the 
        main 48K of memory almost entirely for the user's BASIC program and variables. This port extensively uses Apple II ROM 
        routines (like <code>COUT</code> and <code>GETLN</code>) for character I/O, demonstrating how to interface VC83 BASIC 
        with an existing machine ROM.
      </p>

      <h3>Atari 8-bit</h3>
      <p>
        The Atari 8-bit family (400, 800, XL, XE) port interfaces with the Atari OS via the Central Input/Output (CIO) subsystem. 
        It adheres to standard Atari conventions for memory usage (avoiding the OS zero-page variables) and screen rendering. 
        This target highlights how to adapt the interpreter to an OS that relies heavily on vector tables and device handlers 
        rather than direct hardware manipulation.
      </p>

      <h3>ac6502 (Homebrew Computer)</h3>
      <p>
        The <code>ac6502</code> is a modern homebrew 6502 computer created by A. C. Wright, featuring a 65C02 processor, an 
        AT28C256 ROM, and various peripherals like a Real-Time Clock (RTC) and an SID sound chip. VC83 BASIC is configured as 
        a ROM cartridge for this system.
      </p>
      <p>
        In this configuration, the interpreter executes directly from ROM (<code>$C000-$FFFF</code>), utilizing the system RAM 
        (<code>$0800-$7FFF</code>) purely for its workspace, buffers, and the user's program. This port also includes a robust 
        set of hardware-specific extensions (like <code>SOUND</code>, <code>TIME</code>, and <code>LOCATE</code>) that leverage 
        the system's 6502-BIOS Kernal routines.
      </p>

      <h2>Porting to a New Platform</h2>
      <p>
        Porting VC83 BASIC to a new 6502-based machine requires implementing a small set of mandatory routines, defining a memory 
        map for the <code>ld65</code> linker, and wiring up the startup sequence. You do not need to modify the core interpreter 
        code; all platform-specific code resides in its own directory.
      </p>

      <h3>Overview of the Process</h3>
      <p>
        A typical port involves the following steps:
      </p>
      <ol>
        <li><strong>Linker Configuration:</strong> Create an <code>ld65</code> <code>.cfg</code> file defining memory regions.</li>
        <li><strong>Memory Allocation:</strong> Carve out zero-page space and RAM for buffers/stacks.</li>
        <li><strong>Initialization:</strong> Write a <code>startup</code> routine to handle CPU RESET and invoke the main loop.</li>
        <li><strong>Mandatory I/O:</strong> Implement <code>readline</code>, <code>write</code>, <code>putch</code>, and <code>newline</code>.</li>
        <li><strong>Makefile Integration:</strong> Add the platform to the build system.</li>
      </ol>

      <h3>Linker Configuration (.cfg)</h3>
      <p>
        The <code>ld65</code> linker uses a configuration file to map the interpreter's logical segments into physical memory. 
        You must create a <code>platform/platform.cfg</code> file.
      </p>
      <p>
        Below is an example memory map based on the <code>ac6502</code> cartridge port. Note how the core interpreter segments 
        (<code>CODE</code>, <code>PARSER</code>) are placed in <code>ROM</code>, while mutable data (<code>BSS</code>) is placed 
        in <code>MAIN</code> RAM.
      </p>
<div className="example">{`SYMBOLS {
    __STACKSIZE__:    type = weak,      value = $0000;
    __ZPSTART__:      type = weak,      value = $003A;
    __ZPSIZE__:       type = weak,      value = $00C6;
    __RAM_START__:    type = weak,      value = $0800;
    __HIMEM__:        type = weak,      value = $8000;
    __ROM_START__:    type = weak,      value = $C000;
}
MEMORY {
    ZEROPAGE: file = "",  start = __ZPSTART__,   size = __ZPSIZE__;
    MAIN:     file = "",  start = __RAM_START__, size = __HIMEM__  - __RAM_START__, define = yes;
    ROM:      file = %O,  start = __ROM_START__, size = $FFFA - __ROM_START__,      fill = yes, fillval = $00;
    VECTORS:  file = %O,  start = $FFFA,         size = $0006,                      fill = yes, fillval = $00;
}
SEGMENTS {
    ZEROPAGE: load = ZEROPAGE, type = zp;
    STARTUP:  load = ROM,      type = ro;
    CODE:     load = ROM,      type = ro;
    VEC:      load = ROM,      type = ro,  define = yes;
    XVEC:     load = ROM,      type = ro,  define = yes;
    FUNC:     load = ROM,      type = ro,  define = yes;
    XFUNC:    load = ROM,      type = ro,  define = yes;
    PARSER:   load = ROM,      type = ro;
    ONCE:     load = ROM,      type = ro,  define = yes;
    BSS:      load = MAIN,     type = bss, define = yes,  align = $100;
    VECTORS:  load = VECTORS,  type = ro;
}`}</div>
      <div className="note">
        <strong>Note: The ONCE Segment and BSS</strong><br/>
        For disk-loaded applications (unlike ROM cartridges), the <code>ONCE</code> segment can share address space with 
        the <code>BSS</code> segment. <code>ONCE</code> contains initialization code that runs exactly once. After initialization, 
        that memory area can be safely overwritten by the uninitialized variables defined in <code>BSS</code>.
      </div>

      <h3>Memory &amp; Zero-Page Utilization</h3>
      <p>
        VC83 BASIC is highly reliant on the Zero Page for its virtual registers (<code>FP0</code>, <code>FP1</code>, etc.) and 
        pointers. It requires approximately <strong>128 bytes</strong> of contiguous zero page space.
      </p>
      <p>
        Additionally, you must define the memory layout for the internal buffers and stacks in your <code>init.s</code> file. 
        These are typically placed in the <code>BSS</code> segment so the linker can calculate exactly where the user program 
        space begins.
      </p>
<div className="example">{`.segment "BSS"

.align  $100

; Buffers for parsing and string storage
buffer:         .res BUFFER_SIZE
line_buffer:    .res BUFFER_SIZE

; Ensure that primary stack and operator stack fit together in one page.
.assert PRIMARY_STACK_SIZE + OP_STACK_SIZE = 208, error

stack:          .res PRIMARY_STACK_SIZE
op_stack:       .res OP_STACK_SIZE`}</div>
      <p>
        The <code>stack</code> must not be confused with the 6502 hardware stack (at <code>$0100-$01FF</code>). VC83 manages 
        its own internal stacks for evaluating expressions and handling control flow (FOR/NEXT loops, GOSUB returns).
      </p>

      <h3>System Initialization</h3>
      <p>
        When your platform boots or runs the executable, it needs an entry point. This is typically placed in 
        the <code>STARTUP</code> segment.
      </p>
      <p>
        The core responsibility of your startup routine is to initialize any platform-specific hardware (if necessary, such as 
        handling a hardware RESET on ROM-based systems like the ac6502), clear decimal mode, set up the CPU stack pointer, and 
        most importantly, <strong>jump to <code>main</code></strong>.
      </p>
      <p>
        You may optionally define an <code>initialize_target</code> subroutine in the <code>ONCE</code> segment if you need to 
        do things like display a custom banner or set up system timers before dropping into the REPL.
      </p>
<div className="example">{`.export startup

.segment "STARTUP"

startup:
        sei                             ; Disable interrupts (if booting from ROM)
        cld                             ; Clear decimal flag
        ldx     #$FF
        txs                             ; Initialize the CPU stack to $FF
        
        jsr     KernalInit              ; (Optional) Platform hardware init
        
        cli                             ; Enable interrupts
        jsr     initialize_target       ; (Optional) Show banner, init timers
        
        jmp     main                    ; Enter the VC83 BASIC REPL

.segment "ONCE"

initialize_target:
        jmp     display_startup_banner  ; Provided by the core`}</div>

      <h3>Mandatory I/O Functions</h3>
      <p>
        To interact with the user, you must implement four mandatory I/O routines. These translate VC83 BASIC's standard I/O 
        requests into your platform's specific ROM/OS calls or direct hardware manipulation.
      </p>

      <h4>putch</h4>
      <p>
        Outputs a single character passed in the <code>A</code> register.
      </p>
      <p>
        <strong>Break checking:</strong> The <code>putch</code> routine is an excellent place to poll the keyboard 
        for an interrupt sequence (like <code>CTRL-C</code> or <code>ESC</code>), allowing the user to halt a runaway program. 
        Break keys are entirely platform-specific. If a break is detected, you should jump to the <code>on_raise</code> error 
        handler with <code>ERR_STOPPED</code>. Make sure to only poll when a program is actually running (by 
        checking <code>program_state</code>) to avoid eating characters typed at the <code>READY.</code> prompt!
      </p>
<div className="example">{`putch:
        pha                             ; Save character to output
        lda     program_state           ; Only poll keyboard while a program is running
        bne     @output                 ; PS_READY (non-zero): skip break check
        
        jsr     Chrin                   ; Platform specific: non-blocking keyboard poll
        bcc     @output                 ; Nothing in the buffer
        cmp     #CH_ESC                 ; Is it the ESC key?
        bne     @output                 
@break:
        pla                             ; Discard the saved character
        lda     #ERR_STOPPED
        jmp     on_raise                ; Halt interpreter
@output:
        pla                             ; Restore character
        jmp     CHROUT                  ; Platform specific: print character`}</div>

      <h4>newline</h4>
      <p>
        Outputs a carriage return and/or line feed, advancing the cursor to the next line.
        Note that VC83 BASIC does not assume that the output device supports any control
        characters and will always call newline at the end of each line of output.
      </p>
<div className="example">{`newline:
        lda     #CH_CR
        jsr     putch
        lda     #CH_LF
        jmp     putch`}</div>

      <h4>write</h4>
      <p>
        Outputs a string of characters of a known length. The address of the string is in <code>AX</code> (A = low byte, 
        X = high byte), and the length is in <code>Y</code>.
      </p>
<div className="example">{`write:
        stax    BC                      ; Store pointer in zero-page virtual register BC
        tya
        tax                             ; X = length counter
        beq     @done
        ldy     #0
@next:
        lda     (BC),y
        jsr     putch
        iny
        dex
        bne     @next
@done:
        rts`}</div>

      <h4>readline</h4>
      <p>
        Reads a line of text from the user into <code>buffer</code>.
        It must handle backspaces, ignore unprintable control characters, echo characters to the screen, and null-terminate 
        the string upon receiving a Carriage Return. It must return the length of the string in the <code>A</code> register.
      </p>

      <h3>Makefile Integration</h3>
      <p>
        Finally, wire your platform into the root <code>Makefile</code>:
      </p>
      <ol>
        <li>Add your platform name to the <code>TARGETS</code> variable.</li>
        <li>Create a build rule to assemble the main wrapper file (e.g., <code>basic_myplatform.o</code>).</li>
        <li>Create a linking rule to build the final executable using your custom <code>.cfg</code> file.</li>
      </ol>
<div className="example">{`# In Makefile

TARGETS = sim6502 apple2 apple2_lc atari ac6502 myplatform

basic_myplatform.o: basic_myplatform.s basic.s constants.inc zeropage.s version.inc
	cl65 -t none -c $(ASMFLAGS) -o $@ $<

basic_myplatform: basic_myplatform.o
	cl65 -t none -C myplatform/myplatform.cfg $(LDFLAGS) -o $@ $<
	$(PRINT_SIZE)`}</div>
      <p>
        Your <code>basic_myplatform.s</code> file is simply a wrapper that includes the core files and your platform files 
        in the correct order:
      </p>
<div className="example">{`.include "basic.s"
.include "main.s"
.include "random.s"
.include "myplatform/myplatform.inc"
.include "myplatform/myplatform_startup.s"
.include "myplatform/myplatform_init.s"
.include "myplatform/myplatform_io.s"
.include "myplatform/myplatform_extension.s"`}</div>

      <h2>Adding Statements and Functions</h2>
      <p>
        You can add platform-specific statements (like <code>GR</code> for graphics) 
        and functions (like <code>PDL(n)</code> to read a paddle).
      </p>

      <h3>The Parsing Architecture</h3>
      <p>
        The interpreter uses a pseudo-virtual machine (PVM) to parse incoming text into executable bytecode. When the parser 
        encounters a word it doesn't recognize as a core keyword, it searches the extension tables.
      </p>
      <p>
        These tables are defined in your <code>myplatform_extension.s</code> file in the <code>PARSER</code> segment. 
        You define the string name of the command, followed by a sequence of PVM instructions that describe how its arguments 
        should be parsed.
      </p>

      <h3>Adding a Statement</h3>
      <p>
        Let's add a <code>SOUND dur, freq</code> statement.
      </p>
      <p>
        First, add it to the <code>ex_statement_name_table</code>:
      </p>
<div className="example">{`.segment "PARSER"

ex_statement_name_table:
        name_table_entry "SOUND"
            JUMP pvm_arg_2          ; PVM helper that parses exactly two comma-separated expressions
:       name_table_end`}</div>

      <p>
        Next, define the execution vector in the <code>XVEC</code> segment. The order of vectors here 
        <strong>must exactly match</strong> the order of entries in the name table. The vector should point to your implementation routine minus one (as required by 
        6502 <code>RTS</code> dispatching).
      </p>
<div className="example">{`.segment "XVEC"

ex_statement_vectors:
        .word   exec_sound-1`}</div>

      <p>
        Finally, write the execution routine. Statements are responsible for evaluating their own arguments at runtime. You do 
        this by calling <code>evaluate_argument_list</code>, which pushes the results onto the operator stack. You then pop 
        the arguments in reverse order (since it's a stack).
      </p>
<div className="example">{`.code

exec_sound:
        jsr     evaluate_argument_list
        
        ; Pop the second argument (freq) into FP0 as an integer
        jsr     pop_int_fp0
        sta     D                       ; Save low byte in virtual register D
        stx     E                       ; Save high byte in virtual register E
        
        ; Pop the first argument (dur) into FP0 as an integer
        jsr     pop_int_fp0
        
        ; AX now contains 'dur' (A=low, X=high)
        ; DE now contains 'freq'
        
        ; ... Call platform specific sound hardware routines using AX and DE ...
        
        rts`}</div>

      <h3>Adding a Function</h3>
      <p>
        Functions return a value and are evaluated as part of a mathematical expression (e.g., <code>PRINT JOY(1) * 10</code>).
      </p>
      <p>
        Add the function to the <code>ex_function_name_table</code>. Note that unlike statements, functions do not require PVM 
        argument parsing instructions here; the parser automatically expects arguments in parentheses based on the function's <em>arity</em>.
      </p>
<div className="example">{`.segment "PARSER"

ex_function_name_table:
        name_table_entry "JOY"
:       name_table_end`}</div>

      <p>
        Next, define the function in <code>ex_function_table</code>. Each entry consists of three bytes: the word-aligned handler 
        address minus one, and a metadata byte.
      </p>
<div className="example">{`.segment "XFUNC"

ex_function_table:
        .word   fun_joy-1
        ; Arity: 1 argument.
        ; Automatically pop the evaluated argument as an integer into AX.
        ; Automatically push the integer result in AX back onto the stack.
        .byte   1 | PROLOG_POP_INT | EPILOG_PUSH_INT`}</div>

      <p>
        The lower 4 bits of the metadata byte define the <em>arity</em> (number of expected arguments). 
        The upper bits are flags that direct the expression evaluator to handle the stack automatically. By 
        using <code>PROLOG_POP_INT</code> and <code>EPILOG_PUSH_INT</code>, the handler routine receives the argument in 
        the <code>AX</code> register and returns the result in the <code>AX</code> register.
      </p>
<div className="example">{`.code

; JOY(n) -- returns joystick state for port n
fun_joy:
        ; Thanks to PROLOG_POP_INT, the port number 'n' is already in A
        cmp     #2
        beq     @port2
        
        jsr     ReadJoystick1           ; Read port 1 (returns state in A)
        ldx     #0                      ; High byte is 0
        rts                             ; Return! EPILOG_PUSH_INT handles the rest.
        
@port2:
        jsr     ReadJoystick2           ; Read port 2
        ldx     #0
        rts`}</div>

      <h3>Error Handling</h3>
      <p>
        If your extension detects invalid arguments (e.g., <code>JOY(3)</code> when only 2 ports exist), you can gracefully 
        halt execution and report an error by loading the error code into <code>A</code> and jumping to <code>on_raise</code>.
      </p>
<div className="example">{`        cmp     #3
        bcc     @valid
        
        lda     #ERR_ILLEGAL_QUANTITY
        jmp     on_raise
@valid:`}</div>

      <p>
        These patterns allow a 6502 assembly programmer to adapt VC83 BASIC to an 8-bit platform, 
        providing access to local hardware capabilities through the BASIC interface.
      </p>
    </>
  );
};

export default Platforms;
