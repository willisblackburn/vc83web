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
        <li><strong>Mandatory I/O:</strong> Implement <code>io_get</code>, <code>io_put</code>, <code>io_read_record</code>, <code>io_end_record</code>, <code>io_end_field</code>, <code>io_save</code>, and <code>io_load</code>.</li>
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

      <h3>Mandatory Platform I/O Functions</h3>
      <p>
        To interact with hardware and storage, a platform target implements the standard <code>io_*</code> driver routines. 
        These translate VC83 BASIC's I/O operations into platform ROM calls, memory-mapped device accesses, or simulator traps.
      </p>

      <h4>io_get</h4>
      <p>
        Reads a single byte or keystroke from the channel specified in the <code>channel</code> variable (where <code>$80</code> represents the default console).
      </p>
      <ul>
        <li><code>A = 0</code>: Blocking mode (waits until a character is ready).</li>
        <li><code>A = 1</code>: Non-blocking mode (used by the <code>INKEY$</code> function; returns immediately if no key is pending).</li>
      </ul>
      <p>
        <strong>Returns:</strong> Carry clear (<code>C=0</code>) and the byte in <code>A</code> on success; carry set (<code>C=1</code>) on EOF, error, or if no key was pressed in non-blocking mode.
      </p>
<div className="example">{`io_get:
        cmp     #1                      ; Non-blocking mode (INKEY$)?
        beq     @non_blocking
@wait_key:
        jsr     Chrin                   ; Blocking poll until key pressed
        bcc     @wait_key
        clc
        rts
@non_blocking:
        jsr     Chrin                   ; C=1 if char available
        bcs     @got_key
        sec                             ; C=1 -> no key
        rts
@got_key:
        clc
        rts`}</div>

      <h4>io_put</h4>
      <p>
        Outputs a single character passed in the <code>A</code> register to the destination in <code>channel</code>.
      </p>
      <p>
        <strong>Break Checking:</strong> <code>io_put</code> is an ideal location to poll for break keys 
        (such as <code>ESC</code> or <code>CTRL-C</code>) while a program is actively running. If detected, 
        invoke <code>raise ERR_STOPPED</code> to halt execution. Make sure to check that <code>program_state</code> is 
        <code>PS_RUNNING</code> (0) so break polling does not consume keys typed at the <code>READY.</code> prompt.
      </p>
<div className="example">{`io_put:
        pha                             ; Save character to output
        lda     program_state           ; Only poll break key while program is running
        bne     @output                 ; PS_READY (non-zero): skip break check
        
        jsr     Chrin                   ; Non-blocking keyboard poll
        bcc     @output                 ; No key waiting
        cmp     #CH_ESC
        beq     @break
        cmp     #CH_CTRLC
        bne     @output
@break:
        pla                             ; Discard character
        raise   ERR_STOPPED             ; Halt interpreter
@output:
        pla                             ; Restore character
        jmp     Chrout                  ; Platform-specific character output`}</div>

      <h4>io_read_record</h4>
      <p>
        Reads an entire line of text from the console into <code>buffer</code>. 
        It handles interactive line editing (backspace/delete), echoes typed characters, and terminates the string with a 
        NUL byte (<code>$00</code>) upon receiving Carriage Return. It returns the string length in <code>A</code> with carry clear (or carry set on EOF).
      </p>

      <h4>io_end_record</h4>
      <p>
        Outputs the record delimiter (Carriage Return and/or Line Feed) on the active channel.
      </p>
<div className="example">{`io_end_record:
        lda     #CH_CR
        jsr     io_put
        lda     #CH_LF
        jmp     io_put`}</div>

      <h4>io_end_field</h4>
      <p>
        Outputs a field separator (advancing the cursor to the next 8- or 16-column print zone) on the active channel.
      </p>

      <h4>io_save and io_load</h4>
      <p>
        Persist and load BASIC program memory to and from storage. The filename descriptor is provided in <code>S0</code> (and <code>BC</code>). 
        The routine returns with carry clear (<code>C=0</code>) on success or carry set (<code>C=1</code>) on I/O error. 
        If persistent storage is not supported on a platform, simply return with <code>sec ; rts</code>.
      </p>

      <h4>Optional Channel I/O (enable_io_channels)</h4>
      <p>
        When <code>enable_io_channels</code> is enabled, platforms can implement file/device streams:
      </p>
      <ul>
        <li><code>io_open</code>: Opens a channel (<code>channel = 0..7</code>, <code>A = mode</code>, <code>S0 = filename</code>).</li>
        <li><code>io_close</code>: Closes the specified <code>channel</code>.</li>
        <li><code>io_close_all</code>: Closes all open channels.</li>
        <li><code>io_xio</code>: Executes device-specific control commands (<code>A = command</code>, <code>BC = arg1</code>, <code>DE = arg2</code>).</li>
      </ul>

      <h3>Makefile Integration</h3>
      <p>
        Wire your platform into the root <code>Makefile</code>:
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
        Your <code>basic_myplatform.s</code> file includes the core files and platform components in order:
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
        VC83 BASIC provides a clean macro-based plugin system that allows targets to add custom statements 
        (e.g., <code>SOUND</code>, <code>CLS</code>, <code>PLOT</code>) and functions (e.g., <code>JOY(n)</code>, <code>PDL(n)</code>) 
        without altering the core codebase.
      </p>

      <h3>Architecture Overview</h3>
      <p>
        Extending the interpreter involves four modular components defined in <code>myplatform_extension.s</code>:
      </p>
      <ol>
        <li><strong>Keywords:</strong> Register keyword names into the lexer keyword table.</li>
        <li><strong>PVM Grammar Rules:</strong> Add LL(1) parsing rules to validate statement and function syntax.</li>
        <li><strong>Dispatch Vectors:</strong> Register the execution routines in split low/high pointer tables.</li>
        <li><strong>Dispatch Flags:</strong> Configure automated prolog/epilog stack handling using 4-bit metadata.</li>
      </ol>

      <h3>Step 1: Register Keywords and Token IDs</h3>
      <p>
        Define token constants in the target range (<code>$60–$7F</code> for statements, <code>$99–$BF</code> for functions, 
        or <code>$15–$1F</code> for custom syntax delimiters) and append them to the lexer tables using macros:
      </p>
<div className="example">{`TOK_SOUND   = $61
TOK_JOY     = $99

.macro extension_statement_keywords
:       name_table_entry "SOUND"
.endmacro

.macro extension_function_keywords
:       name_table_entry "JOY"
.endmacro`}</div>

      <h3>Step 2: Define PVM Parser Grammar Rules</h3>
      <p>
        Hook into the LL(1) PVM parser to validate statement argument syntax. The PVM dispatches with <code>BRANCH_IF</code>:
      </p>
<div className="example">{`.macro extension_pvm_statements
        BRANCH_IF TOK_SOUND, pvm_arg_3          ; Parses three comma-separated expressions
.endmacro

.macro extension_pvm_functions
        BRANCH_IF TOK_JOY, pvm_fun_1            ; Parses 1 argument in parentheses: JOY(n)
.endmacro`}</div>
      <p>
        If your statement requires unique syntax structure, you can add custom PVM helper rules via 
        the <code>extension_parser_code</code> macro:
      </p>
<div className="example">{`.macro extension_parser_code
pvm_arg_4:
        CALL    pvm_expression
        MATCH   TOK_COMMA
        JUMP    pvm_arg_3
.endmacro`}</div>

      <h3>Step 3: Define Dispatch Vectors</h3>
      <p>
        Provide split low-byte and high-byte vector tables. Each vector points to your execution routine minus one 
        (for 6502 <code>RTS</code> dispatching):
      </p>
<div className="example">{`.macro extension_statement_vectors_l
        .byte   <(exec_sound-1)
.endmacro

.macro extension_statement_vectors_h
        .byte   >(exec_sound-1)
.endmacro

.macro extension_function_vectors_l
        .byte   <(fun_joy-1)
.endmacro

.macro extension_function_vectors_h
        .byte   >(fun_joy-1)
.endmacro`}</div>

      <h3>Step 4: Configure Prolog &amp; Epilog Flags</h3>
      <p>
        VC83 BASIC features an automated stack dispatch mechanism. Each statement and function can configure a 4-bit 
        metadata nibble (packed two entries per byte) to eliminate argument evaluation and return-value boilerplate:
      </p>
      <ul>
        <li><strong>Prolog (Bits 2–3):</strong>
          <ul>
            <li><code>PROLOG_NONE</code> (<code>$00</code>): Handler evaluates arguments manually.</li>
            <li><code>PROLOG_POP_FP</code> (<code>$04</code>): Evaluates expression and pops 40-bit float into <code>FP0</code>.</li>
            <li><code>PROLOG_POP_INT</code> (<code>$08</code>): Evaluates expression and pops 16-bit integer into <code>AX</code> (A=lo, X=hi).</li>
            <li><code>PROLOG_POP_STRING</code> (<code>$0C</code>): Evaluates expression and pops string into <code>S0</code>.</li>
          </ul>
        </li>
        <li><strong>Epilog (Bits 0–1):</strong>
          <ul>
            <li><code>EPILOG_NONE</code> (<code>$00</code>): No value returned to stack (standard for statements).</li>
            <li><code>EPILOG_PUSH_FP</code> (<code>$01</code>): Pushes floating-point value in <code>FP0</code> onto the primary stack.</li>
            <li><code>EPILOG_PUSH_INT</code> (<code>$02</code>): Converts 16-bit integer in <code>AX</code> to float in <code>FP0</code> and pushes it.</li>
            <li><code>EPILOG_PUSH_STRING</code> (<code>$03</code>): Pushes string in <code>S0</code> onto the primary stack.</li>
          </ul>
        </li>
      </ul>
<div className="example">{`.macro extension_statement_flags
        ; SOUND uses PROLOG_POP_INT to automatically pop its last argument into AX
        .byte   PROLOG_POP_INT | (0 << 4)
.endmacro

.macro extension_function_flags
        ; JOY(n) pops integer port 'n' into AX, and pushes the integer result returned in AX
        .byte   (PROLOG_POP_INT | EPILOG_PUSH_INT) | (0 << 4)
.endmacro`}</div>

      <h3>Step 5: Write the Implementation Code</h3>
      <p>
        Define the execution routines inside the <code>extension_code</code> macro:
      </p>
<div className="example">{`.macro extension_code

; SOUND voice, freq, dur
exec_sound:
        ; The last argument (dur) was automatically popped into AX by PROLOG_POP_INT!
        sta     dur_lo
        stx     dur_hi
        
        ; Pop remaining arguments from the primary stack
        jsr     pop_int_fp0             ; freq -> AX
        stax    freq
        
        jsr     pop_int_fp0             ; voice -> A
        
        ; ... Hardware sound generation ...
        rts

; JOY(port) -> returns joystick state
fun_joy:
        ; Port number is already in A thanks to PROLOG_POP_INT
        cmp     #2
        bcs     @port2
        
        jsr     ReadJoystick1           ; Read port 1 -> returns byte in A
        ldx     #0                      ; High byte = 0
        rts                             ; EPILOG_PUSH_INT automatically converts AX and pushes it!

@port2:
        jsr     ReadJoystick2
        ldx     #0
        rts

.endmacro`}</div>

      <h3>Error Handling</h3>
      <p>
        If an extension encounters invalid parameters (such as an out-of-range port or illegal value), 
        report the error using the <code>raise</code> macro:
      </p>
<div className="example">{`        cmp     #3
        bcc     @valid
        raise   ERR_OUT_OF_RANGE        ; Halts execution and reports ?OUT OF RANGE ERROR
@valid:`}</div>

      <p>
        This modular architecture provides complete flexibility for tailoring VC83 BASIC to any 
        6502 hardware target while maintaining full compatibility with the core language.
      </p>
    </>
  );
};

export default Platforms;
