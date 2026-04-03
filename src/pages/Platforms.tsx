import React from 'react';

const Platforms: React.FC = () => {
  return (
    <>
      <h2>Porting to a New Platform</h2>
      <p>
        VC83 BASIC is designed to be portable. To port the interpreter to a 
        new 6502-based platform, follow these technical requirements.
      </p>

      <h3>1. Linker Configuration (.cfg)</h3>
      <p>Create a custom <code>ld65</code> configuration file (e.g., <code>platform/platform.cfg</code>).</p>
      <ul>
        <li><strong>Memory Map:</strong> Define <code>ZEROPAGE</code> (typically starting at <code>$80</code>), <code>MAIN</code> RAM, and any platform-specific areas like <code>LC</code> (bank-switched RAM).</li>
        <li><strong>Required Segments:</strong>
          <ul>
            <li><code>CODE</code>: The main interpreter logic</li>
            <li><code>VECTORS</code>: Jump tables for opcodes and statements</li>
            <li><code>FUNCTABS</code>: The function metadata table</li>
            <li><code>PARSER</code>: PVM bytecode and name tables</li>
            <li><code>ZEROPAGE</code>: 128 bytes of contiguous ZP space</li>
            <li><code>ONCE</code>: Startup code that is only needed during initialization</li>
          </ul>
        </li>
      </ul>

      <div className="note">
        <strong>Note: The ONCE Segment</strong><br/>
        For disk-loaded applications, the <code>ONCE</code> segment can share address space with 
        the <code>BSS</code> segment. This code runs first to initialize the system and is 
        immediately overwritten by program data once the interpreter is ready.
      </div>

      <h3>2. Memory &amp; Zero-Page Utilization</h3>
      <ul>
        <li><strong>Zero-Page:</strong> VC83 requires approximately 128 bytes of contiguous zero-page space. This is where the virtual registers (<code>FP0</code>, <code>FP1</code>, <code>BC</code>, <code>DE</code>) and interpreter state pointers reside.</li>
        <li><strong>Buffers:</strong>
          <ul>
            <li><code>line_buffer</code>: A 256-byte area for storing a single line of BASIC text</li>
            <li><code>stack</code>: The 6502 hardware stack (<code>$0100-$01FF</code>) is used for return addresses</li>
            <li><strong>Internal Stacks:</strong> The interpreter manages its own primary and operator stacks within its memory space</li>
          </ul>
        </li>
      </ul>

      <h3>3. Mandatory I/O Functions</h3>
      <p>Implement these functions in a platform-specific assembly file (e.g., <code>platform_io.s</code>):</p>
      <ul>
        <li><strong>readline:</strong> Reads a line of text from the user into the <code>buffer</code>.
          <ul>
            <li>Must null-terminate the string.</li>
            <li>Must return the length of the string in the <code>A</code> register.</li>
          </ul>
        </li>
        <li><strong>write:</strong> Writes a string of characters.
          <ul>
            <li>Address of string in <code>AX</code> (little-endian).</li>
            <li>Length of string in <code>Y</code>.</li>
          </ul>
        </li>
        <li><strong>putch:</strong> Writes a single character to the output device.
          <ul>
            <li>Character passed in the <code>A</code> register.</li>
          </ul>
        </li>
      </ul>

      <h3>4. Extension Statements</h3>
      <p>You can add platform-specific commands (like <code>GR</code> or <code>TEXT</code> on Apple II) via the extension tables:</p>
      <ul>
        <li><code>ex_statement_name_table</code>: List of uppercase command names (e.g., <code>"COLOR"</code>). Ending the list with a null byte or using <code>name_table_end</code>.</li>
        <li><code>ex_statement_vectors</code>: Word-aligned jump table to the implementation routines (one per name in the table).</li>
      </ul>

      <h3>5. Extension Functions</h3>
      <p>Functions (like <code>PDL(n)</code>) are defined in <code>ex_function_table</code>. Each entry consists of:</p>
      <ul>
        <li><strong>Handler Address:</strong> <code>.word handler_address - 1</code>.</li>
        <li><strong>Metadata Byte:</strong>
          <ul>
            <li><strong>Bits 0-3:</strong> Arity (number of expected arguments).</li>
            <li><strong>Flags:</strong>
              <ul>
                <li><code>PROLOG_POP_INT</code> / <code>PROLOG_POP_FP</code>: Automatically pop arguments into X/Y or FP0.</li>
                <li><code>EPILOG_PUSH_INT</code> / <code>EPILOG_PUSH_FP</code>: Automatically push return value from A/X or FP0 back to the stack.</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <h3>6. Makefile Integration</h3>
      <p>Add your new platform to the root <code>Makefile</code>:</p>
      <ol>
        <li>Add the platform name to the <code>TARGETS</code> variable.</li>
        <li>Define the build rule for <code>basic_&#123;platform&#125;.o</code> (linking <code>basic.s</code> and your platform files).</li>
        <li>Define the link rule for <code>basic_&#123;platform&#125;</code> using your custom <code>.cfg</code> file.</li>
      </ol>
    </>
  );
};

export default Platforms;
