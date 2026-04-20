import React from 'react';
import MemoryMap, { type MemoryBlockData } from '../components/MemoryMap';

const vc83MemoryBlocks: MemoryBlockData[] = [
  { 
    address: '$0000', 
    name: 'Zero page variables', 
    height: 0.5, 
    isSystem: true,
  },
  { 
    address: '$0100', 
    name: '6502 stack', 
    height: 0.5, 
    isSystem: true,
  },
  { 
    address: '$0200', 
    name: 'buffer/line_buffer', 
    height: 0.5,
    description: (
      <>
        Often a hardware platform will set aside memory in pages 2-7 for I/O buffers and other uses. 
        This is often a good place to put the 256-byte input buffer used by the parser to read lines from the user, 
        and the <code>line_buffer</code> where tokenized output is temporarily stored before being copied to the program space.
      </>
    )
  },
  { 
    address: '$0400', 
    name: 'Text mode screen RAM', 
    height: 0.75, 
    isSystem: true,
  },
  { 
    address: '$0800', 
    name: 'Expression stack, FP scratch space, etc.', 
    height: 0.5,
    description: (
      <>
        The remainder of memory needed by the BASIC interpreter goes at the first available RAM address. 
        These are the variables and buffers defined in the <code>BSS</code> segment in the source code.
      </>
    )
  },
  { 
    address: 'program_ptr', 
    name: 'BASIC user program', 
    height: 2,
    description: (
      <>
        The start of the user's BASIC program. Code is stored in a tokenized format, where each line consists 
        of a length byte, a line number (2 bytes), and a sequence of tokens terminated by a zero byte.
      </>
    )
  },
  { 
    address: 'variable_name_table_ptr', 
    name: 'Variables', 
    height: 1,
    description: (
      <>
        The Variable Name Table (VNT) stores the values of all non-array variables defined by the user. 
        Each entry contains the name and its current value.
        Numeric values consume 5 bytes, while string values, which are pointers into
        the string space, consume 2 bytes.
      </>
    )
  },
  { 
    address: 'array_name_table_ptr', 
    name: 'Array variables', 
    height: 1,
    description: (
      <>
        The Array Name Table (ANT) stores definitions for dimensioned arrays. Each entry includes the array name, 
        arity (the number of dimensions, 1 byte), dimension lengths (2 bytes per dimension),
        and the sequence of values that make up the array elements (the
        base element size times the number of values in the array).
      </>
    )
  },
  { 
    address: 'free_ptr', 
    name: 'Free space', 
    height: 2,
    description: (
      <>
        The start of free space. This section of memory shrinks dynamically as the BASIC program grows 
        and as more variables, arrays, and strings are defined.
      </>
    )
  },
  { 
    address: 'string_ptr', 
    name: 'String storage', 
    height: 1,
    description: (
      <>
        The bottom of the string heap. Strings are stored at the very top of free memory (near <code>himem_ptr</code>) 
        and grow downwards toward <code>free_ptr</code>. This area is periodically compacted by the garbage collector.
      </>
    )
  },
  { 
    address: 'himem_ptr', 
    name: 'Platform-specific data', 
    height: 0.5,
    description: (
      <>
        VC83 BASIC, or the user program, can reserve RAM above <code>himem_ptr</code> for platform-specific needs. 
        For example, on the Atari 800, video RAM goes here.
      </>
    )
  },
  { 
    address: '$C000', 
    name: 'BASIC ROM', 
    height: 0.5,
    description: (
      <>
        The code for the BASIC interpreter itself. This ROM contains the parser, the floating-point library, 
        and the statement execution logic.
      </>
    )
  },
  { 
    address: '$E000', 
    name: 'OS ROM', 
    height: 0.5, 
    isSystem: true,
  },
];

const Technical: React.FC = () => {
  return (
    <>
      <h2 id="architecture">Architecture &amp; Memory Map</h2>
      <p>
        The VC83 BASIC memory map will vary from platform to platform, so what is presented here is a typical
        case.
      </p>
      <p>
        VC83 BASIC manages five blocks of memory, the boundaries of which are defined by six zero page pointers.
        These blocks contain the BASIC program, variables, arrays, and strings, with the fifth block being the free space
        between the first three blocks, which grow upward into the free space, and the string block, which grows down.
        The interpreter adjusts the size of the first three blocks by using the <code>grow</code> and <code>shrink</code> routines
        to move one of the pointers up or down, which moves the other blocks up to the free space as well. The string block
        grows down as strings are allocated and (probably) moves up during the garbage collection process.
      </p>

      <MemoryMap blocks={vc83MemoryBlocks} unitWidth={400} unitHeight={60} />

      <table className="memory-regions-table">
        <thead>
          <tr>
            <th>Pointer/Address</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {vc83MemoryBlocks.filter(b => !b.isSystem).map(block => (
            <tr key={block.address}>
              <td>{block.address}</td>
              <td>
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{block.name}</h3>
                {block.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Name Tables</h2>
      <p>
        The interpreter uses a specialized structure called a <strong>Name Table</strong> to store 
        and look up strings of characters associated with data. This structure is used for everything 
        from built-in statement keywords and function names to the variables and arrays defined 
        by the user. 
      </p>

      <h3>Entry Format</h3>
      <p>
        Each entry in a Name Table starts with a variable-length field that defines the total 
        size of the entry (including the length prefix itself). This prefix can be either 
        one or two bytes:
      </p>
      <ul>
        <li>If the high bit of the first byte is clear, the length is stored as a single byte (0–127).</li>
        <li>If the high bit is set, the length is a 16-bit value. The first byte 
          (with the high bit masked out) is the high byte of the length, followed by a low-byte byte.</li>
      </ul>
      <p>
        Following the length is the name itself, stored as a sequence of ASCII characters.
        The <strong>last character</strong> of the name is marked by having its 
        high bit (bit 7) set. Any technical data associated with the name (such as PVM opcodes 
        for a statement or the 40-bit value of a numeric variable) immediately follows the 
        terminated name string.
      </p>

      <h3>Usage and Pointers</h3>
      <p>
        The parser utilizes these tables to identify keywords during tokenization. While the 
        Variable Name Table (VNT) and Array Name Table (ANT) map identifiers to their 
        values, the built-in statement name table is unique because its data payload contains 
        the PVM opcodes required to parse that specific statement.
        (See the <a href="/technical#parser">Parser</a> section for more information about PVM opcodes.)
      </p>
      <p>
        Pointer management is handled through two zero page registers: <code>name_ptr</code>, which 
        points into the current entry, and <code>next_name_ptr</code>, which tracks the start of 
        the following entry. The routine <code>advance_name_ptr</code> manages the transition 
        between entries by copying <code>next_name_ptr</code> to <code>name_ptr</code> and then 
        calculating the next entry's address based on the current length prefix. Once an entry is active, the 
        interpreter no longer needs the length metadata and is free to move <code>name_ptr</code> 
        within the entry to access the name or data fields.
      </p>
      <p>
        The system provides two primary routines for interacting with these tables: 
        <code>find_name</code>, which searches a table for a match against the current 
        input buffer, and <code>get_name</code>, which retrieves an entry at a specific 
        numerical index.
      </p>

      <h2 id="parser">Parser</h2>
      <p>
        The parser converts the BASIC source code into a tokenized representation that is stored in memory.
        It reads input from <code>buffer</code> and outputs the tokenized program line to <code>line_buffer</code>.
        The size of both buffers is 256 bytes, and the parser raises ERR_LINE_TOO_LONG if the parser tries to write
        past the end of <code>line_buffer</code>. The input buffer is terminated by a 0 byte.
        While parsing, the parser maintains two pointers:
      </p>
      <ul>
        <li><code>buffer_pos</code>: The read position in <code>buffer</code></li>
        <li><code>line_pos</code>: The write position in <code>line_buffer</code></li>
      </ul>
      <p>
        The entry point of the parser is <code>parse_line</code>, which handles the line number and statement separators.
        Most of the work is done by <code>parse_statement,</code> which uses the Parser Virtual Machine (PVM) and a 
        domain-specific language (DSL) to parse complete statements.
      </p>
      <p>
        Functions written in the PVM DSL are called rules. The PVM begins parsing at the <code>pvm_statement</code> rule.
        PVM rules can invoke subrules using the <code>CALL</code> opcode, which is analogous to the 6502 <code>JSR</code> instruction.
        When a rule completes, it returns to the caller using the <code>RETURN</code> opcode (analogous to <code>RTS</code>).
      </p>
      <h3>Backtracking</h3>
      <p>
        The PVM supports backtracking, that is, abandoning a rule, or a stack of them, and returning to an earlier point to try an
        alternative syntax path. The <code>TRY</code> opcode creates a savepoint for the current rule and sets an alternative
        syntax handler.
        If the rule fails, the PVM restores the savepoint and resumes execution from the <code>TRY</code> handler.
        If the current rule doesn't have a savepoint, then the rule fails, but that failure may cause the invocation of 
        a <code>TRY</code> handler in the calling rule, or any rule in the call chain above that.
        Each rule can support only one savepoint at a time, so a single rule cannot have nested <code>TRY</code> blocks.
        The program must use a subrule to manage the inner try block.
      </p>
      <p>
        The <code>ACCEPT</code> opcode is used within a series of alternatives to accept the current alternative and skip over the others.
        It clears the savepoint so that subsequent failures will not cause the PVM to discard the already-validated input.
        Returning from a subrule implicitly <code>ACCEPT</code>s the input. Note that <code>ACCEPT</code>ing syntax in a rule does
        not prevent another rule higher in the call chain from failing and causing the PVM to backtrack and discard the <code>ACCEPT</code>ed
        input.
      </p>
      <h3>PVM Opcodes</h3>
      <p>
        The PVM DSL consists of opcodes defined as assembler macros and embedded in the assembly language source.
        Opcodes instruct the parser to match characters in the input and copy them to the tokenized program line, apply transformations
        to the tokenized program, and resolve alternative syntax paths. The PVM reads opcodes from <code>pvm_program_ptr</code> and
        executes them in sequence.
      </p>
      <p>
        PVM opcodes are designed to be as compact as possible, with each one being one or two bytes in length, except 
        the <code>MATCH_RANGE</code> opcode, which requires two bytes plus two additional bytes for each range. All addresses
        in the DSL are offsets relative to <code>pvm_program_ptr</code> and are limited to 6 bits
        (<code>TRY</code>, <code>ACCEPT</code>) or
        12 bits (<code>JUMP</code>, <code>CALL</code>, <code>TOKENIZE</code>). The 6-bit offsets supported
        by <code>TRY</code> and <code>ACCEPT</code> are adequate
        because those opcodes are used for implementing alternative syntax paths within a single rule.
      </p>
      <table className="pvm-table">
        <thead>
          <tr>
            <th>Opcode</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MATCH char</td>
            <td>
              If the character at <code>buffer_pos</code> matches <code>char</code>, 
              copy it to the tokenized line and increment both pointers; 
              else <code>FAIL</code>.
              The 0 at the end of the input buffer never matches.
            </td>
          </tr>
          <tr>
            <td>MATCH s</td>
            <td>
              Matches an entire string <code>s</code>.
              Exactly equivalent to a sequence of <code>MATCH char</code> opcodes for each character in <code>s</code>.
            </td>
          </tr>
          <tr>
            <td>MATCH *</td>
            <td>
              Matches any character except the 0 at the end of the input buffer.
            </td>
          </tr>
          <tr>
            <td>MATCH_RANGE<br/>&nbsp;&nbsp;r1, r2, ...</td>
            <td>
              Each of <code>r1</code>, <code>r2</code>, etc. is a range of characters, written as <code>{'{'}start, end{'}'}</code>, where <code>start</code> and <code>end</code> are characters.
              If the character at <code>buffer_pos</code> is within any of the specified ranges, copy it to the tokenized line and increment both pointers; else <code>FAIL</code>.
            </td>
          </tr>
          <tr>
            <td>JUMP address</td>
            <td>
              Unconditionally sets <code>pvm_program_ptr</code> to <code>address</code> and resumes execution from that point.
            </td>
          </tr>
          <tr>
            <td>CALL address</td>
            <td>
              Invokes a subrule by pushing the address of the next opcode onto the stack, then performing <code>JUMP</code> to <code>address</code>.
              The PVM resumes execution from that point, until reaching a <code>RETURN</code> opcode.
            </td>
          </tr>
          <tr>
            <td>RETURN</td>
            <td>
              Returns from a <code>CALL</code> opcode by popping the return address from the stack and resuming execution from that point.
              Returning from the initial PVM rule accepts the statement.
            </td>
          </tr>
          <tr>
            <td>FAIL</td>
            <td>
              Fails the current parsing attempt. If the current rule has a savepoint, the PVM restores the savepoint and resumes
              execution from the <code>TRY</code> handler. Otherwise, the PVM abandons the current rule and looks for a savepoint in the caller
              rule, and then the caller's caller, and so on, up the call stack. If no savepoint is found, the statement fails to parse.
            </td>
          </tr>
          <tr>
            <td>TRY address</td>
            <td>
              Creates a savepoint for the current rule by recording the current values of <code>buffer_pos</code> and <code>line_pos</code>, and setting the <code>TRY</code> handler
              to <code>address</code>. If the rule fails, the PVM restores the savepoint and resumes execution from the <code>TRY</code> handler.
            </td>
          </tr>
          <tr>
            <td>ACCEPT address</td>
            <td>
              Accepts the input up to the current position by discarding the current rule's savepoint (if any), then
              performs <code>JUMP</code> to <code>address</code>.
              Using <code>ACCEPT</code> ensures that any subsequent parsing failures will cause the rule to fail rather than invoke the <code>TRY</code> handler.
            </td>
          </tr>
          <tr>
            <td>EMIT char</td>
            <td>
              Writes <code>char</code> to the output buffer.
            </td>
          </tr>
          <tr>
            <td>COMPOSE char</td>
            <td>
              ORs <code>char</code> with the most recently written byte in the output buffer.
            </td>
          </tr>
          <tr>
            <td>WS</td>
            <td>
              Reads and discards whitespace from the input buffer.
            </td>
          </tr>
          <tr>
            <td>ARGSEP</td>
            <td>
              Matches optional whitespace followed by a comma (<code>,</code>).
            </td>
          </tr>
          <tr>
            <td>TOKENIZE address</td>
            <td>
              Matches a previously-parsed sequence of characters against the contents of the name table at <code>address</code>.
              The start of the sequence is determined by the current rule's savepoint, therefore, the rule must 
              use <code>TRY</code> to set up the savepoint before parsing the sequence to be tokenized. If the sequence matches a name in the table, 
              the PVM replaces the sequence in the output buffer with the index number of the matched name table entry.               
            </td>
          </tr>
          <tr>
            <td>DISPATCH</td>
            <td>
              If the name table entry matched by a previous <code>TOKENIZE</code> operation contains data
              following the name, then perform a <code>JUMP</code> to the first byte of that data. If the name table entry does not
              contain any data following the name, then <code>RETURN</code>. Note that, either way, the opcode
              following <code>DISPATCH</code> is not reached.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>PVM Examples</h3>
      <p>
        The following example implements the rule for parsing a statement name. It attempts to 
        match a literal question mark (a shortcut for the <code>PRINT</code> statement). If that 
        fails, it backtracks to the savepoint created by <code>TRY</code> and invokes 
        the <code>pvm_name</code> subrule to match an alphanumeric name.
      </p>
      <div className="example">{`pvm_statement_name:
    TRY pvm_name
    MATCH '?'
    RETURN

pvm_name:
    MATCH_RANGE {'A', 'Z'}
@next:
    TRY @done
    MATCH_RANGE {'A', 'Z'}, {'0', '9'}, {'_', '_'}
    ACCEPT @next
@done:
    RETURN`}</div>

      <p>
        The <code>pvm_name</code> subrule uses a loop for matching an alphanumeric 
        identifier. It mandates that the identifier starts with a letter using <code>MATCH_RANGE</code>. 
        Then, it uses a <code>TRY-ACCEPT</code> loop to repeatedly match characters (A-Z, 0-9, or underscore) 
        until a non-name character is encountered. When matching fails, the PVM backtracks to
        the <code>@done</code> handler to return, terminating the loop.
      </p>
      
      <p>
        In this second example, a simplified version of the main statement parser uses 
        a savepoint to capture and tokenize keyword. The <code>TOKENIZE</code> opcode matches the 
        text captured by <code>pvm_statement_name</code> against a name table of statement keywords and replaces it with a one-byte token. Finally, 
        the rule jumps to a fictitious <code>pvm_args</code> rule to handle the rest of the statement.
        If the PVM fails to parse a statement name, or the name isn't found in the name table, the parse
        fails, invoking the <code>TRY</code> handler <code>@fail</code> and failing the rule.
        Although the <code>TRY</code> handler simply invokes <code>FAIL</code>, creating the savepoint
        was necessary to set the start of the statement name for the <code>TOKENIZE</code> operation.
      </p>
      <div className="example">{`pvm_simple_statement:
    WS
    TRY @fail
    CALL pvm_statement_name
    TOKENIZE keyword_table
    JUMP pvm_args
@fail:
    FAIL`}</div>

      <h2>Floating Point Support</h2>
      <p>
        VC83 BASIC utilizes a custom 5-byte (40-bit) floating point format designed for a balance 
        of precision and performance on 8-bit hardware. This format is conceptually similar to 
        that of a IEEE-754 32-bit single-precision float, but increases the size of the
        significand to 32 bits to support 9 decimal digits of precision, and swaps the ordering of the sign bit and exponent
        fields so that the 8-bit exponent can occupy one full byte in memory. VC83 BASIC floats
        do not support subnormal, NaN, or infinity values.
      </p>
      <table className="fp-bits-table">
        <thead>
          <tr>
            <th>Bits</th>
            <th>Field</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0–30</td>
            <td>Significand</td>
            <td>The 31-bit fractional part (mantissa) of the value. Stored least significant byte first.</td>
          </tr>
          <tr>
            <td>31</td>
            <td>Sign</td>
            <td>The sign bit (0 for positive, 1 for negative).</td>
          </tr>
          <tr>
            <td>32–39</td>
            <td>Exponent</td>
            <td>8-bit biased exponent (excess-128). An exponent of 0 represents a value of zero.</td>
          </tr>
        </tbody>
      </table>
      <p>
        All 40 bits are stored in memory in little-endian format. In other words, the first byte contains bits 0-7, 
        the second byte contains bits 8-15, and so on. The exponent byte therefore occupies the last byte in memory.
      </p>
      <p>
        For any non-zero exponent <code>e</code>, the actual mathematical exponent is <code>e-127</code>. 
        The actual significand includes an <strong>implied 1 bit</strong> to the left of the binary 
        point (e.g., <code>1.[fraction]</code>). This hidden bit allows the 31 bits of stored data 
        to provide 32 bits of precision.
      </p>

      <h3>Internal Registers: FP0, FP1, and FPX</h3>
      <p>
        The interpreter maintains two primary floating point registers in zero page: <strong>FP0</strong> (the accumulator) 
        and <strong>FP1</strong> (the operand). Operations in the floating point module typically 
        follow a standard convention where unary functions (like <code>SQR</code> or <code>LOG</code>) 
        operate directly on <strong>FP0</strong>, while binary operations (like <code>FADD</code> 
        or <code>FMUL</code>) operate on the combination of <strong>FP0</strong> and <strong>FP1</strong>.
      </p>
      <p>
        To preserve precision during intermediate calculations, a 32-bit extension register 
        called <strong>FPX</strong> is used. This register extends 
        the <strong>FP0</strong> significand to 64 bits during 
        multiplication and addition, where bits might otherwise be shifted out 
        before normalization.
      </p>

      <h3>Loading and Storing Values</h3>
      <p>
        Data movement between the interpreter's registers and system memory is handled
        by <code>load_fp</code> and <code>store_fp</code>. These functions convert between the 40-bit, implied-1 memory format
        and the expanded format of the FP0 and FP1 registers.
      </p>
      <table className="fp-ops-table">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Address<br/>(AY)</th>
            <th>Register<br/>(X)</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>load_fp</td>
            <td>Source address</td>
            <td>FP0 or FP1</td>
            <td>Unpacks the 5-byte memory format, restores the implied 1 bit, and breaks out the sign into a separate byte.</td>
          </tr>
          <tr>
            <td>store_fp</td>
            <td>Destination address</td>
            <td>FP0 or FP1</td>
            <td>Re-packs the significand by hiding the implied 1 bit and merging the sign bit back into the 4th significand byte.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Addressing is performed using the 6502's <code>A</code> and <code>Y</code> registers to point 
        to the 16-bit memory address, while the <code>X</code> register specifies whether the 
        operation uses <strong>FP0</strong> or <strong>FP1</strong>.
      </p>

      <h3>Normalization and Rounding</h3>
      <p>
        A floating point value is considered <strong>normalized</strong> when the most-significant bit (MSB) of
        its significand is 1. Storing floating point number in normalized form has significant advantages:
      </p>
      <ul>
        <li>
          <strong>Precision:</strong> It allows the use of an <strong>implied 1-bit</strong>. Because 
          the leading bit of a normalized non-zero number is always 1, it does not need to 
          be stored in memory, effectively giving the significand an extra bit of precision.
        </li>
        <li>
          <strong>Uniqueness:</strong> Normalization ensures that every non-zero number has a 
          unique representation, which simplifies equality testing.
        </li>
        <li>
          <strong>Comparison Efficiency:</strong> Because the MSB is always 1, the magnitude of 
          two normalized numbers can be compared by their exponents first.
        </li>
        <li>
          <strong>Relative Error:</strong> By eliminating leading zeros, 
          normalization ensures that all of the availble bits of the significand are used to
          increase precision.
        </li>
      </ul>
      <p>
        The <code>normalize</code> routine is used after every operation to ensure that the MSB
        of the resulting significand is 1. If an operation results in an overflow or a leading zero, 
        the routine shifts the significand and adjusts the exponent accordingly.
      </p>
      <p>
        During normalization, the system implements a <strong>round-half-up</strong> algorithm.
        Operations that shift the significand right, such as <strong>fadd</strong> and <strong>fmul</strong>, move the
        bits that were shifted out of the significand into the B register.
        If the most-significant bit of B is set, it means that the fractional remainder is 0.5 or greater, so the significand is incremented. If 
        this increment causes an overflow, the system performs a final right-shift and 
        exponent adjustment.
      </p>

      <h3>Floating Point Functions</h3>
      <p>
        VC83 BASIC provides standard arithmetic and higher-level mathematical 
        functions. Arithmetic functions like <code>fadd</code>, <code>fsub</code>,
        and <code>fmul</code> expect their operands to be loaded into the FP registers and yield their
        results in <strong>FP0</strong>. Comparison (<code>fcmp</code>) returns flags in the 
        same manner as the 6502 <code>CMP</code> instruction in order to enable the use of the 6502's conditional branch instructions (<code>BEQ</code>, <code>BCS</code>, etc.).
      </p>
      <p>
        The library includes support for logarithmic and trigonometric 
        calculations.
      </p>
      <table className="fp-functions-table">
        <thead>
          <tr>
            <th>Function</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>fadd</td>
            <td>Adds the value in <strong>FP1</strong> into <strong>FP0</strong>.</td>
          </tr>
          <tr>
            <td>fsub</td>
            <td>Subtracts the value in <strong>FP1</strong> from <strong>FP0</strong>.</td>
          </tr>
          <tr>
            <td>fmul</td>
            <td>Multiplies <strong>FP0</strong> by <strong>FP1</strong>.</td>
          </tr>
          <tr>
            <td>fdiv</td>
            <td>Divides <strong>FP0</strong> by <strong>FP1</strong>; raises ERR_DIVIDE_BY_ZERO error if necessary.</td>
          </tr>
          <tr>
            <td>fcmp</td>
            <td>Compares <strong>FP0</strong> and <strong>FP1</strong>; set Z and C flags for 6502 branches.</td>
          </tr>
          <tr>
            <td>fneg</td>
            <td>Negates the value in <strong>FP0</strong> by toggling the sign bit.</td>
          </tr>
          <tr>
            <td>floor</td>
            <td>Calculates the largest integer less than or equal to <strong>FP0</strong>.</td>
          </tr>
          <tr>
            <td>round</td>
            <td>Rounds <strong>FP0</strong> to the nearest integer (round-half-up).</td>
          </tr>
          <tr>
            <td>int_to_fp</td>
            <td>Converts a 16-bit signed integer (passed in <strong>AX</strong>) into <strong>FP0</strong>.</td>
          </tr>
          <tr>
            <td>truncate_fp_to_int</td>
            <td>Truncates <strong>FP0</strong> to a 16-bit signed integer and returns it in <strong>AX</strong>.</td>
          </tr>
          <tr>
            <td>fsin</td>
            <td>Calculates sine in radians using a Chebyshev polynomial fit for [-&pi;/2, &pi;/2].</td>
          </tr>
          <tr>
            <td>fcos</td>
            <td>Calculates cosine by shifting the argument and invoking the <code>fsin</code> routine.</td>
          </tr>
          <tr>
            <td>ftan</td>
            <td>Calculates tangent as the ratio of <code>fsin</code> to <code>fcos</code>.</td>
          </tr>
          <tr>
            <td>fatn</td>
            <td>Calculates arctangent using a polynomial approximation over the range [0, 1].</td>
          </tr>
          <tr>
            <td>flog</td>
            <td>Calculates the natural logarithm (ln) using a polynomial approximation and range reduction.</td>
          </tr>
          <tr>
            <td>fexp</td>
            <td>Calculates <i>e</i><sup>x</sup> using the Taylor series expansion.</td>
          </tr>
          <tr>
            <td>fpow</td>
            <td>General exponentiation (x<sup>y</sup>), calculated as <code>fexp(y * flog(x))</code>.</td>
          </tr>
        </tbody>
      </table>

      <h3>Polynomial Evaluation</h3>
      <p>
        Transcendental functions are computed using two evaluation
        routines: <code>fpoly</code> and <code>fpoly_odd</code>. The <code>fpoly</code> function implements 
        Horner's Method, iterating through a table of coefficients to solve polynomials with minimal multiplications.
      </p>
      <p>
        The <code>fpoly_odd</code> variant is an optimization for functions containing 
        only odd powers (such as the series for <code>fsin</code>). It squares the 
        input argument once to generate all even powers, then multiplies by the input, raising the power of each term by one
        and making them all odd.
      </p>

      <h2>String Handling</h2>
      <p>
        VC83 BASIC manages strings using a heap at the top of system memory. 
        Data is stored downward from <code>himem_ptr</code> toward the program's <code>free_ptr</code>, allowing the heap to expand and contract as 
        needed. 
      </p>
      <p>
        Strings are stored with a length byte followed by the string data, and two extra 
        bytes used for address relocation information. Each string therefore carries three
        bytes of overhead, the value of the constant <code>STRING_EXTRA</code>.
      </p>

      <h3>Core String Routines</h3>
      <p>
        Allocation is managed by <code>string_alloc</code>. This routine 
        checks for available memory before reserving space. If a 
        request exceeds available RAM, <code>string_alloc</code> triggers the 
        garbage collector. If memory is insufficient after compaction, the interpreter 
        raises an ERR_OUT_OF_MEMORY exception.
      </p>
      <p>
        Input and parsing are handled by <code>read_string</code>. This parser 
        uses different termination rules based on the input. If a string starts with a 
        double quote, it is treated as quoted; in this mode, two consecutive double 
        quotes (<code>""</code>) are interpreted as a single literal double quote. 
        Unquoted strings are treated as comma-delimited, stopping at the first comma.
      </p>
      <p>
        To access data from the heap, the interpreter uses the <code>load_s</code> family 
        of routines. These set one of the two zero page string pointers, <code>S0</code> or <code>S1</code>,
        to point to the string's data, and return the string's length in the <strong>A</strong> register.
        Note that <code>S0</code> and <code>S1</code> occupy the same address space as 
        the <code>FPX</code> floating point register.
      </p>
      
      <h3>The Garbage Collector</h3>
      <p>
        Memory is managed using a <strong>Mark-Sweep-Compact</strong> garbage collector. This routine reclaims memory and 
        eliminates fragmentation. The collector executes in six phases:
      </p>
      <ul>
        <li><strong>Phase 1:</strong> Clear marks for all strings in the heap by setting high byte of each string's relocation field to <code>$FF</code> (unmarked).</li>
        <li><strong>Phase 2:</strong> Scan variables, arrays, and the stack to identify referenced strings. Set the high byte of the relocation field to <code>$00</code> (marked) for any live strings.</li>
        <li><strong>Phase 3:</strong> Calculate relocation offsets for each marked string.</li>
        <li><strong>Phase 4:</strong> Update all string pointers in variables, arrays, and the stack to reflect the relocation.</li>
        <li><strong>Phase 5:</strong> Physically relocate the data for each marked string to the bottom of free space.</li>
        <li><strong>Phase 6:</strong> Shift the entire block of marked strings back to the top of memory.</li>
      </ul>
      <p>
        The garbage collector has to compact all the referenced strings to the bottom of the free space because it can only
        walk the string heap from the lowest address upward. In the last phase it moves all the referenced 
        strings back to the top of the free space.
      </p>
    </>
  );
};

export default Technical;
