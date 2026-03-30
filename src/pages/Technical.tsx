import React from 'react';

const Technical: React.FC = () => {
  return (
    <>
      <h2>Architecture &amp; Memory Map</h2>
      <p>
        VC83 BASIC is designed as a high-performance replacement for Applesoft BASIC, 
        typically residing in the <code>$D000-$FFFF</code> memory range (Language Card/Firmware area).
      </p>

      <p><strong>System Memory Map:</strong></p>
      <ul>
        <li><strong>$0000-$07FF</strong>: Zero Page, Stack, and System Globals.</li>
        <li><strong>$0800-$BFFF</strong>: User Program and Variable Space.</li>
        <li><strong>$C000-$CFFF</strong>: I/O Space.</li>
        <li><strong>$D000-$FFFF</strong>: VC83 BASIC Interpreter ROM.</li>
      </ul>

      <p><strong>Internal Memory Management:</strong></p>
      <p>The interpreter uses several zero-page pointers to manage dynamic structures:</p>
      <ul>
        <li><code>program_ptr</code>: Start of the BASIC program (sequentially stored line records).</li>
        <li><code>variable_name_table_ptr</code>: Start of the Variable Name Table (VNT).</li>
        <li><code>array_name_table_ptr</code>: Points to the Array Name Table (ANT).</li>
        <li><code>free_ptr</code>: First byte of free memory after the ANT.</li>
        <li><code>string_ptr</code>: Bottom of the string space (grows downwards from himem_ptr).</li>
        <li><code>himem_ptr</code>: The highest address used; ceiling for the string space.</li>
      </ul>

      <h2>Parser Virtual Machine (PVM)</h2>
      <p>
        VC83 uses a domain-specific language (DSL) and a dedicated Parser Virtual Machine to 
        tokenize programs.
      </p>
      <ul>
        <li><strong>Efficiency</strong>: Keywords are replaced with 1-byte tokens for fast execution.</li>
        <li><strong>Validation</strong>: Syntax errors are detected up-front during tokenization.</li>
        <li><strong>Reversibility</strong>: The <code>LIST</code> command uses the PVM to expand tokens back into human-readable code.</li>
      </ul>

      <h2>Floating Point Support</h2>
      <p>VC83 BASIC uses a custom 5-byte floating-point format:</p>
      <ul>
        <li><strong>Precision</strong>: 32-bit fractional significand with an implied <code>1.</code> (similar to IEEE-754).</li>
        <li><strong>Exponent</strong>: 8-bit, excess-128.</li>
        <li><strong>Registers</strong>: Uses two main zero-page registers, <code>FP0</code> and <code>FP1</code>, with <code>FPX</code> extending <code>FP0</code> to 64-bit precision for intermediate calculations.</li>
        <li><strong>Operations</strong>: Includes a full suite of unary (SIN, LOG, EXP, etc.) and binary (FADD, FMUL, etc.) operations.</li>
      </ul>

      <h2>String Handling</h2>
      <p>Strings are managed via a robust garbage collection system:</p>
      <ul>
        <li><strong>Structure</strong>: <code>[Length Byte] [Data...] [Extra Byte 1] [Extra Byte 2]</code>. The extra bytes store forwarding addresses during compaction.</li>
        <li><strong>Allocation</strong>: New strings are created at <code>string_ptr</code>, which moves downwards.</li>
        <li><strong>Garbage Collection</strong>: Triggered automatically when <code>string_ptr</code> reaches <code>free_ptr</code>, moving all referenced strings to the top of memory for efficient space recovery.</li>
      </ul>

      <h2>VC83 vs. Microsoft BASIC</h2>
      <ul>
        <li><strong>Variable Names</strong>: Can be any length (standard BASIC is limited to 2 characters).</li>
        <li><strong>Efficiency</strong>: Features a significantly more efficient string garbage collector to prevent the long "pauses" common in older interpreters.</li>
      </ul>
    </>
  );
};

export default Technical;
