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
        and look up strings of characters associated with data. This structure is used for the 
        Variable Name Table (VNT), Array Name Table (ANT), and the lexer's built-in keyword table.
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
          (with the high bit masked out) is the high byte of the length, followed by a low byte.</li>
      </ul>
      <p>
        Following the length is the name itself, stored as a sequence of ASCII characters.
        The <strong>last character</strong> of the name is marked by having its 
        high bit (bit 7) set. Any data payload associated with the name (such as the 40-bit 
        floating-point value of a numeric variable or a 16-bit string descriptor) immediately follows the 
        terminated name string.
      </p>

      <h3>Usage and Pointers</h3>
      <p>
        While the Variable Name Table (VNT) and Array Name Table (ANT) map identifiers to their 
        current runtime values and dimension metadata, the lexer's <code>keywords</code> table maps statement, 
        operator, and function names to single-byte token IDs based on their offsets within token blocks.
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

      <h2 id="lexer">Lexer (DFA Tokenization)</h2>
      <p>
        Line processing begins with a dedicated, high-performance lexer (<code>lexer.s</code>). 
        The lexer converts raw ASCII input characters in <code>buffer</code> into a stream of 
        compact token codes and formatted literal values in <code>line_buffer</code>.
      </p>
      <p>
        The lexer is powered by Deterministic Finite Automaton (DFA) state tables that are generated 
        ahead of time from regular expression specifications using a Python build script 
        (<code>generate_lexer_data.py</code>). The script uses Thompson's construction to build an NFA 
        and powerset subset construction to compile it into an optimized DFA table (<code>lexer_data.inc</code>).
      </p>

      <h3>Token Ranges</h3>
      <p>
        Tokens are organized into contiguous classes to facilitate fast range checking in both the 
        lexer and the parser:
      </p>
      <table className="pvm-table token-ranges-table">
        <thead>
          <tr>
            <th>Hex Range</th>
            <th>Category</th>
            <th>Description &amp; Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$00</td>
            <td>End of Line</td>
            <td><code>TOK_EOL</code> (statement/line terminator)</td>
          </tr>
          <tr>
            <td>$01–$1F</td>
            <td>Structural &amp; Values</td>
            <td>
              Delimiters (<code>,</code>, <code>;</code>, <code>(</code>, <code>)</code>, <code>:</code>, <code>NOT</code>, <code>THEN</code>, <code>TO</code>, <code>STEP</code>), 
              value tokens (<code>TOK_NUM</code>, <code>TOK_SYMBOL</code>, <code>TOK_NAME</code>, <code>TOK_STRING</code>), 
              and target-specific custom syntax keywords (e.g., <code>AT</code> at <code>$15</code>).
            </td>
          </tr>
          <tr>
            <td>$20–$2F</td>
            <td>Binary Operators</td>
            <td>
              <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>^</code>, <code>&amp;</code>, <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>AND</code>, <code>OR</code>
            </td>
          </tr>
          <tr>
            <td>$30–$37</td>
            <td>I/O Channels</td>
            <td>Channel specifiers <code>#0</code> through <code>#7</code> (when I/O channels are enabled)</td>
          </tr>
          <tr>
            <td>$40–$7F</td>
            <td>Statements</td>
            <td>
              Core statement keywords (<code>PRINT</code>, <code>LET</code>, <code>FOR</code>, <code>NEXT</code>, <code>IF</code>, <code>INPUT</code>, <code>GOTO</code>, <code>DIM</code>, <code>DATA</code>, <code>POKE</code>, <code>RUN</code>, etc.) 
              and platform extension statements (e.g., <code>CLS</code>, <code>GR</code>, <code>SOUND</code>).
            </td>
          </tr>
          <tr>
            <td>$80–$BF</td>
            <td>Functions</td>
            <td>
              Built-in functions (<code>LEN</code>, <code>STR$</code>, <code>CHR$</code>, <code>ASC</code>, <code>VAL</code>, <code>PEEK</code>, <code>SIN</code>, <code>COS</code>, <code>RND</code>, <code>MID$</code>, <code>FRE</code>, <code>INKEY$</code>, etc.) 
              and platform extension functions (e.g., <code>JOY</code>, <code>PDL</code>).
            </td>
          </tr>
          <tr>
            <td>$C0–$FF</td>
            <td>PVM Opcodes</td>
            <td>Parser Virtual Machine instructions (<code>MATCH</code>, <code>CALL</code>, <code>BRANCH_IF</code>, <code>RETURN</code>, etc.)</td>
          </tr>
        </tbody>
      </table>

      <h3>DFA State Table Encoding</h3>
      <p>
        The state tables in <code>lexer_data.inc</code> are encoded compactly for the 6502:
      </p>
      <ul>
        <li><strong>Byte 0:</strong> Terminal token tag. If the high bit (<code>CASE_INSENSITIVE = $80</code>) is set, 
        the lexer automatically folds input characters <code>'a'..'z'</code> to uppercase <code>'A'..'Z'</code> before matching.</li>
        <li><strong>Byte 1:</strong> Number of transition records (<em>N</em>) out of this state.</li>
        <li><strong>N Transition Triplets (3 bytes each):</strong>
          <ul>
            <li><code>min_char</code>: Inclusive start ASCII character of the matching range.</li>
            <li><code>count_chars</code>: Number of contiguous ASCII characters in the range.</li>
            <li><code>target_state_id</code>: Byte offset of the destination state relative to <code>state_0</code>.</li>
          </ul>
        </li>
      </ul>

      <h3>Token Value Formatting</h3>
      <p>
        When <code>next_token</code> executes, it advances past whitespace, walks the DFA states matching input characters, 
        and writes the output token and values into <code>line_buffer</code>:
      </p>
      <ul>
        <li><strong>Numbers (<code>TOK_NUM</code>):</strong> Digits and optional decimal points/exponents are copied directly into the line buffer, with bit 7 set on the final character.</li>
        <li><strong>Strings (<code>TOK_STRING</code>):</strong> The opening quote is replaced with a single-byte length prefix. The trailing quote is retained with bit 7 set, making <code>LIST</code> fast to execute.</li>
        <li><strong>Keywords &amp; Identifiers (<code>TOK_NAME</code>, <code>TOK_SYMBOL</code>):</strong> The lexer searches the <code>keywords</code> name table using <code>find_name</code>. If a match is found, the token and characters in the buffer are replaced with the single-byte keyword token. If unmatched, it remains as a variable name or unresolved symbol with bit 7 set on the last character.</li>
      </ul>

      <h2 id="parser">Parser Virtual Machine (PVM)</h2>
      <p>
        Once a line is tokenized by the lexer, it is parsed by the <strong>Parser Virtual Machine (PVM)</strong>. 
        The PVM is an <strong>LL(1) predictive recursive-descent parser</strong> that operates on the token stream.
      </p>
      <p>
        Because the dedicated lexer resolves keywords and operators into unambiguous single-byte tokens up front, 
        the grammar of BASIC is LL(1). The PVM therefore operates <strong>without backtracking</strong> or savepoints. 
        Parsing decisions are made deterministically by inspecting a single lookahead token held in CPU register <code>C</code>.
      </p>

      <h3>PVM Execution Model</h3>
      <p>
        The parser entry point is <code>parse_line</code>, which reads optional line numbers and iteratively invokes 
        <code>pvm_statement</code> for each colon-separated statement.
      </p>
      <p>
        PVM rules are compact bytecode subroutines embedded in the assembly source. The interpreter loop (<code>run_pvm</code>) 
        fetches opcodes from <code>pvm_program_ptr</code>:
      </p>
      <ul>
        <li><strong>Single-Token Lookahead:</strong> <code>run_pvm_next_token</code> reads the next token from the lexer into register <code>C</code> and records buffer positions in <code>D</code> and <code>E</code> so unconsumed lookahead tokens can be preserved across rules.</li>
        <li><strong>Rule Calls:</strong> The <code>CALL</code> opcode pushes the 16-bit PVM return address onto the 6502 hardware stack and jumps to a subrule. <code>RETURN</code> pops the return address and clears the carry flag to signal success.</li>
        <li><strong>Deterministic Failure:</strong> If a syntax mismatch occurs, the PVM immediately fails the rule by setting the carry flag (<code>sec ; rts</code>). The failure propagates up the call stack, raising <code>ERR_SYNTAX_ERROR</code>.</li>
      </ul>

      <h3>PVM Opcode Reference</h3>
      <p>
        PVM opcodes are designed for maximum density. Instruction jump targets use 10-bit signed relative offsets 
        (−512 to +511 bytes relative to the instruction), allowing compact 2-byte branch and call instructions:
      </p>
      <table className="pvm-table pvm-opcode-table">
        <thead>
          <tr>
            <th>Opcode</th>
            <th>Encoding</th>
            <th>Bytes</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MATCH token</td>
            <td>$00–$BF</td>
            <td>1</td>
            <td>
              Matches lookahead token <code>C</code> against <code>token</code>. If it matches, advances to the next token via <code>next_token</code>. If it does not match, fails the rule (sets carry and returns).
            </td>
          </tr>
          <tr>
            <td>MATCH_RANGE min, count</td>
            <td>$C0–$CF, min</td>
            <td>2</td>
            <td>
              Matches lookahead token <code>C</code> if <code>min &le; C &lt; min + count</code> (count 1–16). On match, advances to the next token; otherwise fails the rule.
            </td>
          </tr>
          <tr>
            <td>CALL address</td>
            <td>$D0–$D3, offset_lo</td>
            <td>2</td>
            <td>
              Pushes the next PVM address onto the 6502 CPU stack and jumps to <code>address</code> (10-bit signed relative offset). If the called rule returns failure (carry set), the caller immediately fails.
            </td>
          </tr>
          <tr>
            <td>JUMP address</td>
            <td>$D4–$D7, offset_lo</td>
            <td>2</td>
            <td>
              Unconditionally jumps to <code>address</code> (10-bit signed relative offset) and resumes execution.
            </td>
          </tr>
          <tr>
            <td>BRANCH_IF token, address</td>
            <td>$D8–$DB, offset_lo, token</td>
            <td>3</td>
            <td>
              If lookahead token <code>C</code> matches <code>token</code>, consumes the token (advances to next token) and branches to <code>address</code>. Otherwise, does not consume the token and continues to the next PVM instruction.
            </td>
          </tr>
          <tr>
            <td>BRANCH_IF_RANGE min, count, address</td>
            <td>$D8–$DB, offset_lo, range_byte, min</td>
            <td>4</td>
            <td>
              Range variant of <code>BRANCH_IF</code>. If lookahead token <code>C</code> is within the specified range, consumes the token and branches to <code>address</code>.
            </td>
          </tr>
          <tr>
            <td>RETURN</td>
            <td>$F0</td>
            <td>1</td>
            <td>
              Returns from a subrule with success (clears carry and executes <code>rts</code>).
            </td>
          </tr>
          <tr>
            <td>GUARD token</td>
            <td>$F1, token</td>
            <td>2</td>
            <td>
              If lookahead token <code>C</code> matches <code>token</code>, terminates the current rule and returns success (carry clear) <strong>without</strong> consuming the token. Otherwise continues to the next instruction.
            </td>
          </tr>
          <tr>
            <td>GUARD_RANGE min, count</td>
            <td>$F1, range_byte, min</td>
            <td>3</td>
            <td>
              Range variant of <code>GUARD</code>. Returns success without consuming if <code>C</code> falls within the range.
            </td>
          </tr>
          <tr>
            <td>SLURP</td>
            <td>$F2</td>
            <td>1</td>
            <td>
              Directly copies raw un-tokenized characters from <code>buffer</code> to <code>line_buffer</code> until a NUL byte is reached. Used by <code>REM</code> and <code>DATA</code> statements to bypass the lexer.
            </td>
          </tr>
          <tr>
            <td>FAIL</td>
            <td>$FF</td>
            <td>1</td>
            <td>
              Unconditionally sets the carry flag and returns, failing the current parse.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>PVM Grammar Examples</h3>
      <p>
        The following excerpt from <code>parser.s</code> illustrates how <code>pvm_statement</code> dispatches 
        statements deterministically using <code>BRANCH_IF</code>:
      </p>
      <div className="example">{`pvm_statement:
        BRANCH_IF TOK_PRINT, pvm_print
        BRANCH_IF TOK_ALT_PRINT, pvm_print
        BRANCH_IF TOK_LET, pvm_let
        BRANCH_IF TOK_NAME, pvm_impl_let        ; Implied LET: name followed by '='
        BRANCH_IF TOK_FOR, pvm_for
        BRANCH_IF TOK_NEXT, pvm_next
        BRANCH_IF TOK_IF, pvm_if
        BRANCH_IF TOK_INPUT, pvm_input
        BRANCH_IF TOK_READ, pvm_read
        BRANCH_IF TOK_ON, pvm_on
        BRANCH_IF TOK_GOTO, pvm_goto
        BRANCH_IF TOK_GOSUB, pvm_gosub
        BRANCH_IF TOK_LIST, pvm_list
        BRANCH_IF TOK_POKE, pvm_arg_2
        BRANCH_IF TOK_DPOKE, pvm_arg_2
        BRANCH_IF TOK_DIM, pvm_read
        BRANCH_IF TOK_DATA, pvm_data
        BRANCH_IF TOK_REM, pvm_rem
        BRANCH_IF TOK_RESTORE, pvm_restore
        BRANCH_IF_RANGE TOK_RUN, 8, @done       ; Any no-arg statement (RUN..POP)
        ...
        invoke_if_defined extension_pvm_statements
        FAIL
@done:
        RETURN`}</div>

      <p>
        Statement rules invoke subrules for argument validation. For example, <code>pvm_for</code> verifies the 
        <code>variable = expr TO expr [STEP expr]</code> structure:
      </p>
      <div className="example">{`pvm_for:
        MATCH TOK_NAME
        MATCH TOK_EQ
        CALL pvm_expression
        MATCH TOK_TO
        CALL pvm_expression
        BRANCH_IF TOK_STEP, pvm_expression
        RETURN`}</div>

      <p>
        The <code>PRINT</code> statement demonstrates how <code>GUARD</code> allows cleanly exiting a repetition loop 
        when a statement delimiter (<code>:</code> or <code>EOL</code>) is encountered without consuming it:
      </p>
      <div className="example">{`pvm_print:
.ifdef enable_io_channels
        CALL pvm_channel
.endif
@loop:
        BRANCH_IF TOK_SEMI, @loop
        BRANCH_IF TOK_COMMA, @loop
        GUARD TOK_COLON                 ; Exit PRINT without consuming ':'
        GUARD TOK_EOL                   ; Exit PRINT without consuming EOL
        CALL pvm_expression             ; Otherwise it must be an expression
        BRANCH_IF TOK_SEMI, @loop
        BRANCH_IF TOK_COMMA, @loop
        GUARD TOK_COLON
        GUARD TOK_EOL
        FAIL`}</div>

      <p>
        Expressions and helper rules are parsed with tight recursive descent:
      </p>
      <div className="example">{`pvm_expression:
        CALL pvm_primary_expression
        BRANCH_IF_RANGE TOK_ADD, 14, pvm_expression
        RETURN

pvm_arg_2:
        CALL pvm_expression
        MATCH TOK_COMMA
        JUMP pvm_expression

pvm_arg_list:
        CALL pvm_expression
        BRANCH_IF TOK_COMMA, pvm_arg_list
        RETURN`}</div>

      <h2>Expression Evaluation</h2>
      <p>
        Runtime expression evaluation in VC83 BASIC is handled by <code>evaluate_expression</code> in <code>expression.s</code>. 
        It evaluates mathematical, string, relational, and logical expressions using a two-stack architecture combined with an 
        efficient <strong>lazy evaluation</strong> strategy.
      </p>

      <h3>Expression and Operator Stacks</h3>
      <p>
        The evaluator maintains two distinct stacks to track operands and pending operations:
      </p>
      <ul>
        <li>
          <strong>The Value Stack (<code>stack</code>):</strong> A page-aligned memory buffer managed by the zero-page pointer <code>stack_pos</code>. 
          It grows downward and stores 6-byte <code>Value</code> structures. Each entry contains a 1-byte <code>type</code> tag 
          (<code>TYPE_NUMBER = $00</code> or <code>TYPE_STRING = $01</code>) and a 5-byte data payload (packed 40-bit floating-point value or a 2-byte string header pointer).
        </li>
        <li>
          <strong>The Operator Stack (<code>op_stack</code>):</strong> A byte array managed by the zero-page pointer <code>op_stack_pos</code> that grows downward. 
          Each entry is a single 1-byte value encoding both the operator's precedence and its vector dispatch ID.
        </li>
      </ul>
      <p>
        When <code>evaluate_expression</code> is invoked, it immediately pushes a bottom sentinel, <code>PR_OPEN_PAREN</code> (precedence <code>$00</code>), 
        onto <code>op_stack</code>. Because <code>PR_OPEN_PAREN</code> has the lowest possible precedence, operator reduction loops will never pop below this 
        sentinel while evaluating subexpressions. When the expression ends, remaining pending operators are evaluated against <code>PR_CLOSE_PAREN</code> (<code>$20</code>), 
        and the sentinel is popped directly with <code>inc op_stack_pos</code>.
      </p>
      <p>
        Parenthesized subexpressions (<code>evaluate_paren</code>) leverage this same mechanism: pushing <code>PR_OPEN_PAREN</code>, recursively calling <code>evaluate_expression</code>, 
        and popping the sentinel upon encountering the closing parenthesis.
      </p>

      <h3>Lazy Evaluation with FP0 and S0</h3>
      <p>
        To minimize memory traffic and stack overhead, VC83 BASIC employs a <strong>lazy evaluation</strong> strategy. 
        Primary expressions leave their results directly in zero-page working registers without immediately pushing them to the value stack:
      </p>
      <ul>
        <li><strong>Numeric values:</strong> Left unpacked in the 40-bit <code>FP0</code> floating-point accumulator.</li>
        <li><strong>String values:</strong> Left in <code>S0</code> as a 2-byte pointer to the string's length header.</li>
        <li><strong><code>expr_type</code>:</strong> A zero-page register updated during primary evaluation (<code>TYPE_NUMBER = 0</code>, <code>TYPE_STRING = 1</code>).</li>
      </ul>
      <p>
        Retaining intermediate values directly in registers avoids the overhead of packing and unpacking floating-point numbers to and from memory. 
        Consequently, simple assignments and single-term expressions (e.g. <code>X = 42</code>, <code>PRINT A$</code>, unary operations like <code>-X</code>, or single-argument functions) execute entirely within <code>FP0</code> and <code>S0</code> without touching the stack.
      </p>

      <h3>When Values Are Pushed to the Stack</h3>
      <p>
        The evaluator defers pushing the pending value in <code>FP0</code>/<code>S0</code> to the value stack (via <code>push_pending</code>) until strictly necessary:
      </p>
      <ul>
        <li>
          <strong>Holding Left Operands:</strong> When a binary operator is parsed, the evaluator must preserve the left-hand operand while evaluating the right-hand operand. 
          <code>push_pending</code> writes the left operand to the value stack, freeing <code>FP0</code>/<code>S0</code> for the right operand.
        </li>
        <li>
          <strong>Argument Lists:</strong> When parsing multi-argument statements, functions, or array indexing (<code>evaluate_argument_list</code>), each evaluated parameter is pushed to the stack before the next is evaluated.
        </li>
        <li>
          <strong>Garbage Collection Safety:</strong> Active strings are pushed onto the value stack before allocating new strings on the heap (such as in string concatenation <code>op_concat</code>) so they remain discoverable during mark-sweep compaction.
        </li>
      </ul>

      <h3>Single-Byte Precedence &amp; Operator Encoding</h3>
      <p>
        To minimize code size and execution overhead, the operator stack packs both the operator's precedence level and its dispatch index into a single byte:
      </p>
      <table className="pvm-table operator-precedence-table">
        <thead>
          <tr>
            <th>Precedence</th>
            <th>Constant</th>
            <th>Operators &amp; Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$F0</td>
            <td>PR_UNARY_OP</td>
            <td>Unary <code>-</code>, Unary <code>NOT</code></td>
          </tr>
          <tr>
            <td>$C0</td>
            <td>PR_POW</td>
            <td><code>^</code> (exponentiation)</td>
          </tr>
          <tr>
            <td>$A0</td>
            <td>PR_MUL</td>
            <td><code>*</code>, <code>/</code></td>
          </tr>
          <tr>
            <td>$80</td>
            <td>PR_ADD</td>
            <td><code>+</code>, <code>-</code>, <code>&amp;</code> (string concatenation)</td>
          </tr>
          <tr>
            <td>$60</td>
            <td>PR_RELATIONAL</td>
            <td><code>=</code>, <code>&lt;&gt;</code>, <code>&lt;=</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&gt;</code></td>
          </tr>
          <tr>
            <td>$40</td>
            <td>PR_LOGICAL</td>
            <td><code>AND</code>, <code>OR</code></td>
          </tr>
          <tr>
            <td>$20</td>
            <td>PR_CLOSE_PAREN</td>
            <td>End-of-expression reduction sentinel</td>
          </tr>
          <tr>
            <td>$00</td>
            <td>PR_OPEN_PAREN</td>
            <td>Stack bottom sentinel / <code>(</code></td>
          </tr>
        </tbody>
      </table>
      <p>
        When a binary operator token (<code>TOK_ADD = $20</code> to <code>TOK_OR = $2D</code>) is read:
      </p>
      <ol>
        <li>The token's low nibble (0–13) is extracted with <code>and #$0F</code>.</li>
        <li>Dividing by 2 (<code>lsr A</code>) provides an index into <code>operator_precedence_table</code>, fetching the high-nibble precedence byte.</li>
        <li>The precedence byte is bitwise OR'd with the low-nibble operator index:
          <br/>
          <code>encoded_op = precedence | (token &amp; $0F)</code>
        </li>
      </ol>
      <p>
        Unary operators (unary minus and <code>NOT</code>) are assigned maximum precedence directly: <code>PR_UNARY_OP | TOK_UNARY_MINUS</code> (<code>$FE</code>) and <code>PR_UNARY_OP | TOK_UNARY_NOT</code> (<code>$FF</code>).
      </p>

      <div className="note">
        <strong>Why This Encoding Is Fast:</strong><br/>
        Because precedence occupies the upper bits (bits 4–7), <code>process_operators</code> can compare the incoming operator against pending operators with a single <code>cmp min_precedence</code> instruction. When ready to evaluate, masking with <code>and #$0F</code> directly indexes the split vector tables (<code>operator_vectors_l</code> and <code>operator_vectors_h</code>), which are dispatched in two instructions using the 6502 <code>RTS</code> trick (<code>pha</code>/<code>pha</code>/<code>rts</code>).
      </div>

      <h3>Operator Dispatch and Execution Details</h3>
      <p>
        The operator execution routines incorporate several low-level 6502 optimizations:
      </p>
      <ul>
        <li>
          <strong>Negated Addition for Subtraction:</strong> Rather than implementing separate subtraction logic, <code>op_sub</code> negates the right-hand operand in <code>FP0</code> (using <code>fneg</code>) and jumps directly into <code>fadd</code>, computing <code>(-right) + left = left - right</code>.
        </li>
        <li>
          <strong>Polymorphic Relational Operators:</strong> Relational comparisons (<code>=</code>, <code>&lt;</code>, <code>&gt;</code>, etc.) verify that operand types match using <code>compare_values</code>. For numbers, it dispatches to <code>fcmp_2</code>; for strings, it calls <code>compare_string_values</code> for lexicographical comparison. True is loaded as float <code>1.0</code> via <code>load_one_fp0</code> and False as float <code>0.0</code> via <code>clear_fp0</code>.
        </li>
        <li>
          <strong>Logical Bitwise Operators:</strong> <code>AND</code> and <code>OR</code> convert <code>FP0</code> and the stacked left operand into 16-bit signed integers via <code>truncate_fp_to_int</code>, execute 16-bit bitwise logic across register pairs, and convert the result back to float via <code>int_to_fp</code>.
        </li>
        <li>
          <strong>Unary Operators:</strong> Unary <code>+</code> is ignored and discarded during parsing. Unary <code>-</code> (<code>fneg</code>) and <code>NOT</code> (testing if exponent is zero) execute with highest precedence before any binary operator.
        </li>
      </ul>

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
        For any non-zero exponent <code>e</code>, the actual mathematical exponent is <code>e-128</code>. 
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
