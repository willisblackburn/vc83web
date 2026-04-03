import React from 'react';

const Technical: React.FC = () => {
  return (
    <>
      <h2>Architecture &amp; Memory Map</h2>
      <p>The interpreter uses several zero-page pointers to manage dynamic structures:</p>
      <ul>
        <li><code>program_ptr</code>: Start of the BASIC program (sequentially stored line records)</li>
        <li><code>variable_name_table_ptr</code>: Start of the Variable Name Table (VNT)</li>
        <li><code>array_name_table_ptr</code>: Points to the Array Name Table (ANT)</li>
        <li><code>free_ptr</code>: First byte of free memory after the ANT</li>
        <li><code>string_ptr</code>: Bottom of the string space (grows downwards from himem_ptr)</li>
        <li><code>himem_ptr</code>: The highest address used; ceiling for the string space</li>
      </ul>

      <h2>Parser Virtual Machine (PVM)</h2>
      <p>
        VC83 uses a Parser Virtual Machine that implements a domain-specific language (DSL) to parse and tokenize statements.
        Each invocation of the PVM parses one statement; line numbers and statement separators are handled by 
        the <code>parse_line</code> function.
      </p>
      <p>
        The PVM reads input from <code>buffer</code> and outputs the tokenized program line to <code>line_buffer</code>.
        It maintains two pointers:
      </p>
      <ul>
        <li><code>buffer_pos</code>: The read position in <code>buffer</code></li>
        <li><code>line_pos</code>: The write position in <code>line_buffer</code></li>
      </ul>
      <p>
        PVM opcodes instruct the parser to match characters in the input and copy them to the tokenized program line, apply transformations
        to the tokenized program, and resolve alternative syntax paths. The PVM reads opcodes from <code>pvm_program_ptr</code> and
        executes them in sequence.
      </p>
      <h4>PVM Opcodes</h4>
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
            </td>
          </tr>
          <tr>
            <td>MATCH s</td>
            <td>
              Matches a entire string <code>s</code>. Exactly equivalent to a sequence of <code>MATCH char</code> opcodes for each character in <code>s</code>.
            </td>
          </tr>
          <tr>
            <td>MATCH *</td>
            <td>
              Matches any character except the 0 at the end of the line.
            </td>
          </tr>
          <tr>
            <td>MATCH_RANGE r1, r2, ...</td>
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
              Fails the current parsing attempt. If the current rule has a TRY handler, the PVM restores the savepoint and resumes
              execution from the TRY handler. Otherwise, the PVM abandons the current rule and looks for a TRY handler in the caller
              rule, and then the caller's caller, and so on, up the call stack. If no TRY handler is found, the statement fails to parse.
            </td>
          </tr>
          <tr>
            <td>TRY address</td>
            <td>
              Creates a savepoint for the current rule by recording the current values of <code>buffer_pos</code> and <code>line_pos</code>, and setting the TRY handler
              to <code>address</code>. If the rule fails, the PVM restores the savepoint and resumes execution from the TRY handler.
            </td>
          </tr>
          <tr>
            <td>ACCEPT address</td>
            <td>
              Accepts the input up to the current position by discarding the current rule's savepoint (if any), then
              performs <code>JUMP</code> to <code>address</code>.
              Using <code>ACCEPT</code> ensures that any subsequent parsing failures will cause the rule to fail rather than invoke the TRY handler.
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
              contain any data following the name, then <code>RETURN</code>. Note that, either way, the opcode following <code>DISPATCH</code>
              is not reached.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Floating Point Support</h2>
      <p>VC83 BASIC uses a custom 5-byte floating-point format:</p>
      <ul>
        <li><strong>Precision:</strong> 32-bit fractional significand with an implied <code>1.</code> (similar to IEEE-754)</li>
        <li><strong>Exponent:</strong> 8-bit, excess-128</li>
        <li><strong>Registers:</strong> Uses two main zero-page registers, <code>FP0</code> and <code>FP1</code>, with <code>FPX</code> extending <code>FP0</code> to 64-bit precision for intermediate calculations</li>
        <li><strong>Operations:</strong> Includes a full suite of unary (SIN, LOG, EXP, etc.) and binary (FADD, FMUL, etc.) operations</li>
      </ul>

      <h2>String Handling</h2>
      <p>Strings are managed via a robust garbage collection system:</p>
      <ul>
        <li><strong>Structure:</strong> <code>[Length Byte] [Data...] [Extra Byte 1] [Extra Byte 2]</code>. The extra bytes store forwarding addresses during compaction.</li>
        <li><strong>Allocation:</strong> New strings are created at <code>string_ptr</code>, which moves downwards.</li>
        <li><strong>Garbage Collection:</strong> Triggered automatically when <code>string_ptr</code> reaches <code>free_ptr</code>, moving all referenced strings to the top of memory for efficient space recovery.</li>
      </ul>

      <h2>VC83 vs. Microsoft BASIC</h2>
      <ul>
        <li><strong>Variable Names:</strong> Can be any length (standard BASIC is limited to 2 characters)</li>
        <li><strong>Efficiency:</strong> Features a significantly more efficient string garbage collector to prevent the long "pauses" common in older interpreters</li>
      </ul>
    </>
  );
};

export default Technical;
