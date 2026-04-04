import React, { Fragment } from 'react';

const STATEMENT_GROUPS = [
  ['GOTO', 'GOSUB', 'RETURN', 'ON', 'IF', 'END', 'STOP', 'CONT', 'POP', 'RUN'],
  ['FOR', 'NEXT'],
  ['LET', 'DIM', 'CLR', 'NEW', 'POKE', 'PEEK', 'ADR'],
  ['DATA', 'READ', 'RESTORE'],
  ['PRINT', 'INPUT', 'LIST'],
  ['REM']
];

interface StatementReferenceProps {
  keyword: string;
  synopsis: string;
  syntax: string;
  args?: { name: string; desc: string }[];
  children: React.ReactNode;
  example: React.ReactNode;
}

const StatementReference: React.FC<StatementReferenceProps> = ({ 
  keyword, 
  synopsis, 
  syntax, 
  args, 
  children, 
  example 
}) => {
  const group = STATEMENT_GROUPS.find(g => g.includes(keyword));
  const seeAlso = (group ? group.filter(k => k !== keyword) : []);

  return (
    <div className="reference-entry" id={keyword}>
      <div className="reference-header">
        <span className="reference-keyword">{keyword}</span>
        <span className="reference-synopsis">{synopsis}</span>
      </div>

      <div className="reference-grid">
        <div className="reference-label">Syntax</div>
        <div className="reference-value reference-syntax">{syntax}</div>

        {args && args.length > 0 && (
          <>
            <div className="reference-label">Arguments</div>
            <div className="reference-value">
              <ul className="reference-args">
                {args.map(arg => (
                  <li key={arg.name} className="reference-arg">
                    <span className="reference-arg-name">{arg.name}:</span>
                    <span className="reference-arg-desc">{arg.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="reference-label">Description</div>
        <div className="reference-value">{children}</div>

        <div className="reference-label">Example</div>
        <div className="reference-value">
          <div className="example">{example}</div>
        </div>

        {seeAlso.length > 0 && (
          <>
            <div className="reference-label">See also</div>
            <div className="reference-value">
              <div className="reference-see-also">
                {seeAlso.map((k, index) => (
                  <Fragment key={k}>
                    <a href={`#${k}`}>{k}</a>
                    {index < seeAlso.length - 1 ? ', ' : ''}
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

const FUNCTION_GROUPS = [
  ['SIN', 'COS', 'TAN', 'ATN'],
  ['LEFT$', 'RIGHT$', 'MID$', 'LEN', 'ASC', 'CHR$', 'STR$', 'VAL'],
  ['LOG', 'EXP', 'SQR'],
  ['INT', 'ABS', 'SGN'],
  ['PEEK', 'POKE', 'ADR', 'USR', 'FRE'],
  ['RND']
];

interface FunctionReferenceProps {
  keyword: string;
  synopsis: string;
  syntax: string;
  args?: { name: string; desc: string }[];
  returns: string;
  children: React.ReactNode;
  example: React.ReactNode;
}

const FunctionReference: React.FC<FunctionReferenceProps> = ({ 
  keyword, 
  synopsis, 
  syntax, 
  args, 
  returns,
  children, 
  example 
}) => {
  const group = FUNCTION_GROUPS.find(g => g.includes(keyword));
  const seeAlso = (group ? group.filter(k => k !== keyword) : []);

  return (
    <div className="reference-entry" id={keyword}>
      <div className="reference-header">
        <span className="reference-keyword">{keyword}</span>
        <span className="reference-synopsis">{synopsis}</span>
      </div>

      <div className="reference-grid">
        <div className="reference-label">Syntax</div>
        <div className="reference-value reference-syntax">{syntax}</div>

        {args && args.length > 0 && (
          <>
            <div className="reference-label">Arguments</div>
            <div className="reference-value">
              <ul className="reference-args">
                {args.map(arg => (
                  <li key={arg.name} className="reference-arg">
                    <span className="reference-arg-name">{arg.name}:</span>
                    <span className="reference-arg-desc">{arg.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="reference-label">Returns</div>
        <div className="reference-value">{returns}</div>

        <div className="reference-label">Description</div>
        <div className="reference-value">{children}</div>

        <div className="reference-label">Example</div>
        <div className="reference-value">
          <div className="example">{example}</div>
        </div>

        {seeAlso.length > 0 && (
          <>
            <div className="reference-label">See also</div>
            <div className="reference-value">
              <div className="reference-see-also">
                {seeAlso.map((k, index) => (
                  <Fragment key={k}>
                    <a href={`#${k}`}>{k}</a>
                    {index < seeAlso.length - 1 ? ', ' : ''}
                  </Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Manual: React.FC = () => {
  return (
    <>
      <h2>1. Immediate Mode</h2>
      <p>
        As soon as you see the <code>READY</code> prompt, the computer is waiting for your instructions. 
        In "immediate mode" (sometimes called "direct mode"), you can type any BASIC statement, 
        and the computer will execute it as soon as you press <strong>Enter</strong>. This makes 
        the system feel like a powerful scientific calculator or a command-line interface. 
        For example, you can perform quick calculations or test commands without writing a full program.
      </p>
      <div className="example">
        PRINT 12 * (3 + 4)      
      </div>
      <p>
        You can even string multiple commands together on a single line by separating them 
        with a colon (<code>:</code>). This allows you to perform complex actions 
        instantly:
      </p>
      <div className="example">
        INPUT "WHAT IS YOUR NAME? ";A$:PRINT "HELLO ";A$
      </div>
      <p>
        Any variables you create in immediate mode will remain in the computer's memory, 
        waiting to be used by further commands.
      </p>

      <h2>2. Entering and Editing the Program</h2>
      <p>
        To create a program that can be saved and executed repeatedly, you must begin each line 
        with a line number between 0 and 32767. When the computer sees a line number, it 
        doesn't execute the statement immediately; instead, it stores it in memory. The line
        numbers determine the ordering of the program lines in memory and their execution order.
      </p>
      <p>
        When entering programs in BASIC, it is common to use line numbers that are multiples of 10.
        This leaves some extra line numbers "between" the lines in case you need to insert a new line later.
      </p>
      <p>
        Managing your code is straightforward. To <strong>add</strong> a new line, simply type 
        a new line number followed by the statement. If you need 
        to <strong>replace</strong> an existing line, re-type that same number with the corrected text;
        the computer 
        always keeps the most recent version. To <strong>delete</strong> a line entirely, type its number 
        on a blank line and press <strong>Enter</strong>.
      </p>
      <p>
        As your program grows, you will want to review your work. The <code>LIST</code> command 
        displays your stored program on the screen. You can view the entire program by
        typing <code>LIST</code>, or display a specific line:
      </p>
      <div className="example">
        LIST 100
      </div>
      <p>or a range of lines:</p>
      <div className="example">
        LIST 10,100
      </div>
      <p>
        When you are finished with one project and ready to start something completely fresh, 
        type <code>NEW</code>. This command wipes the current program and all variables from 
        memory, giving you a clean slate.
      </p>

      <h2>3. Running the Program</h2>
      <p>
        After you have entered your program lines, you use the <code>RUN</code> command to begin execution. 
        Execution always starts at the lowest line number and proceeds sequentially.
      </p>
      <div className="example">
        RUN
      </div>
      <p>
        <code>RUN</code> automatically performs <code>CLR</code>, which wipes all variables 
        and arrays from memory, resetting everything to zero or empty strings before the program starts.
      </p>
      <p>
        If you want to start execution from a specific line number—perhaps for debugging or testing a specific routine—without 
        clearing your variables, you can use the <code>GOTO</code> command in immediate mode:
      </p>
      <div className="example">
        GOTO 500
      </div>
      <p>
        Unlike modern environments where variables often have limited "scope" or are cleared when a function ends, 
        BASIC variables are global and persistent. If your program finishes or is interrupted, 
        all variables remain in memory with their last-assigned values. You can even access and change them 
        in immediate mode. If you then restart the program using <code>GOTO</code> instead of <code>RUN</code>, 
        those variables will still have their previous values. This "living" memory can be a powerful tool 
        for debugging, but it can also lead to bugs if you expect a fresh start! To manually reset all variables
        at any time, simply type <code>CLR</code>.
      </p>
      <p>
        To temporarily halt a running program, include a <code>STOP</code> statement in your code. The computer will 
        report the line where it stopped and wait for your next command. To resume execution, 
        type <code>CONT</code> (continue). However, keep in mind that modifying your program lines 
        while execution is paused will "break the link," making it impossible to <code>CONT</code>inue.
      </p>
      <p>
        When you want a program to terminate explicitly and return to the <code>READY</code> prompt, 
        use the <code>END</code> statement. Finally, if a program enters an infinite loop and 
        refuses to stop through normal means, use the <strong>RESET</strong> button on the emulator 
        control panel to regain control of the system. (Note that this is unique to VC83 BASIC on the Apple II. 
        Other platforms may have some other means of interrupting the program.)
      </p>

      <h2>4. Variables and Types</h2>

      <h3>Single Variables</h3>
      <p>
        VC83 BASIC supports two fundamental types of data: <strong>numbers</strong> and <strong>strings</strong>.
      </p>
      <ul>
        <li><strong>Numbers</strong> are used for any numeric value, including integers and 
          decimal (floating point) numbers. Example: <code>X=42</code>.</li>
        <li><strong>Strings</strong> are used for text. String variable names must always end 
          with a dollar sign (<code>$</code>), which is pronounced "string." Example: <code>A$="HELLO"</code>.
          Strings can be up to 255 characters in length.</li>
      </ul>
      <p>
        To assign a value to a variable, you can use the <code>LET</code> statement, or 
        simply omit it for a more concise syntax:
      </p>
      <div className="example">
        10 LET A=100<br />
        20 B$="VC83"
      </div>

      <h3>Array Variables</h3>
      <p>
        When you need to store a collection of related values, use an <strong>array</strong>. 
        Before using an array, you should "dimension" it using the <code>DIM</code> statement 
        to specify its maximum size. Array indices start at zero.
      </p>
      <p>For example, to create and assign an array of strings:</p>
      <div className="example">
        10 DIM NAMES$(50)<br/>
        20 NAMES$(1)="CHRIS"
      </div>
      <p>
        <code>NAME$</code> is a string array with a maximum index of 50. Becuase indices start at 
        0, <code>NAME$</code> holds 51 string values.
      </p>
      <p>Arrays can have more than one dimension. VC83 BASIC supports any number of dimensions,
        although is rare to need more than 2 or 3.
        In this example, <code>GRID</code> is an array of 121 (not 100) numbers.</p>
      <div className="example">
        10 DIM GRID(10,10)<br/>
        20 GRID(1,1)=10:GRID(1,2)=20:GRID(2,1)=30:GRID(2,2)=40
      </div>
      <p>
        If you use an array without a <code>DIM</code> statement, VC83 BASIC will 
        automatically dimension it with a default size of 10.
      </p>
      <h2>5. Expressions</h2>
      <p>
        Expressions are the building blocks of BASIC logic. An expression can be as simple as a single 
        number (<code>42</code>) or variable (<code>X</code>), or a complex combination of values, 
        operators, and functions. Every expression eventually resolves to one of the two types supported by
        VC83 BASIC: either a <strong>number</strong> or a <strong>string</strong>.
      </p>

      <h3>Functions and Values</h3>
      <p>
        Functions take expressions as arguments and return a new value that can be used immediately 
        within a larger calculation. For example, in <code>PRINT 10 + LEN(A$)</code>, 
        the <code>LEN</code> function calculates the length of a string, which is then added to 10. 
        To convert between types, use <code>VAL(S$)</code> to extract a number from a string, 
        or <code>STR$(N)</code> to convert a number into text.
      </p>

      <h3>Mathematical Operators</h3>
      <p>
        VC83 supports standard arithmetic:
      </p>
      <ul>
        <li><strong>Exponentiation</strong> (<code>^</code>): Raises a number to a power</li>
        <li><strong>Multiplication</strong> (<code>*</code>) and <strong>Division</strong> (<code>/</code>)</li>
        <li><strong>Addition</strong> (<code>+</code>) and <strong>Subtraction</strong> (<code>-</code>)</li>
        <li><strong>Unary Minus</strong> (<code>-</code>): Negates a value (e.g., <code>-5</code>)</li>
      </ul>

      <h3>String Concatenation</h3>
      <p>
        To join two strings together, use the <code>&amp;</code> operator:
      </p>
      <div className="example">
        A$="HELLO":B$="WORLD"<br />
        PRINT A$&amp;" "&amp;B$
      </div>

      <h3>Relational Operators</h3>
      <p>
        These operators compare two values (<code>=</code>, <code>&lt;&gt;</code>, <code>&lt;</code>, 
        <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>). Unlike some languages that have a 
        dedicated "boolean" type, BASIC relational operators always return a number: <strong>1</strong> if the 
        condition is true, and <strong>0</strong> if it is false. Relational operators work with both numbers 
        and strings (e.g., <code>A$ &lt; B$</code> for alphabetization), but both operands must 
        be of the same type; you cannot compare a number to a string. Because relational operators return 
        numbers, you can use them in math, such as <code>SCORE=SCORE+(X&gt;10)</code>.
      </p>

      <h3>Logical and Bitwise Operators</h3>
      <p>
        The <code>AND</code>, <code>OR</code>, and <code>NOT</code> operators are primarily used 
        for complex conditions.
      </p>
      <div className="example">
        IF X&gt;0 AND X&lt;10 THEN PRINT "IN RANGE"
      </div>
      <p>
        When used with numbers, <code>AND</code> and <code>OR</code> perform bitwise operations 
        on the integer part of the value. For example, <code>PRINT 5 AND 3</code> outputs <code>1</code> (binary 
        101 AND 011 is 001).
      </p>

      <h3>Precedence and Parentheses</h3>
      <p>
        BASIC follows a strict order of operations: exponentiation first, followed by multiplication 
        and division, then addition and subtraction, and finally relational and logical tests. 
        You can always use <strong>parentheses</strong> <code>()</code> to override this order 
        or simply to make your code easier to read:
      </p>
      <div className="example">
        PRINT 2+3*4<br/>
        PRINT (2+3)*4
      </div>

      <h2>6. Controlling Program Flow</h2>
      <p>
        Programs typically run from top to bottom, but "flow control" statements allow your 
        programs to make decisions, repeat actions, and jump between different routines.
      </p>

      <h3>Decisions: IF and THEN</h3>
      <p>
        The <code>IF</code> statement tests a numeric expression. If the result 
        is <strong>non-zero</strong> (true), 
        the statement following <code>THEN</code> is executed. 
        Crucially, <code>IF</code> executes <strong>all remaining statements on the line</strong> if the condition is met. If the 
        condition is <strong>zero</strong> (false), BASIC immediately skips the rest of the line and 
        proceeds to the next numbered line. Note that the condition must be a number; 
        testing a string directly will result in an error.
      </p>
      <div className="example">
        10 INPUT "GUESS THE NUMBER (1-10)? ";G<br />
        20 IF G=7 THEN PRINT "WINNER!":END<br />
        30 PRINT "TRY AGAIN":GOTO 10<br />
      </div>

      <h3>Branching: GOTO and GOSUB</h3>
      <p>
        <code>GOTO</code> performs an immediate jump to a specific line number. <code>GOSUB</code> is more powerful:
        it jumps to a line but remembers where it came from. When the system 
        reaches a <code>RETURN</code>, it jumps back to the command immediately following the <code>GOSUB</code>. This 
        allows you to write subroutines, blocks of code you can reuse from many places.
      </p>
      <div className="example">
        10 PRINT "MAIN CODE"<br />
        20 GOSUB 100:PRINT "BACK AGAIN"<br />
        30 END<br />
        100 PRINT "INSIDE SUBROUTINE"<br />
        110 RETURN<br />
        RUN<br />
        MAIN CODE<br />
        INSIDE SUBROUTINE<br />
        BACK AGAIN
      </div>

      <h3>Repeating: FOR and NEXT</h3>
      <p>
        To run a block of code multiple times, use <code>FOR</code>. You define a counter variable, its 
        starting and ending values, and an optional <code>STEP</code> to determine how much the 
        counter increases (or decreases, if the step value is negative) each time.
      </p>
      <div className="example">
        10 FOR I=1 TO 5 STEP 2<br />
        20 PRINT "COUNT:"; I<br />
        30 NEXT I<br />
        RUN<br />
        COUNT: 1<br />
        COUNT: 3<br />
        COUNT: 5
      </div>
      <p>
        If you need to leave a loop or a subroutine early using a <code>GOTO</code>,
        use the <code>POP</code> command first. This removes the top entry from the internal control 
        stack, ensuring the system doesn't try to <code>RETURN</code> to a subroutine or 
        loop that is no longer active.
      </p>

      <h3>Multi-way Jumps: ON ... GOTO/GOSUB</h3>
      <p>
        When you have many potential destinations, use <code>ON ... GOTO</code> or <code>ON ... GOSUB</code>.
        This command looks at a numeric value and jumps to the 
        Nth line number in the comma-separated list.
      </p>
      <ul>
        <li>If the value is <strong>0</strong>, the jump is skipped and execution continues on the next line.</li>
        <li>Numbers from <strong>1 to N</strong> jump to the corresponding line in the list.</li>
        <li>Numbers <strong>less than 0</strong> or <strong>greater than N</strong> will cause an error.</li>
      </ul>
      <div className="example">
        10 INPUT "PICK 1 OR 2: ";X<br />
        20 ON X GOTO 100,200<br />
        30 PRINT "INVALID SELECTION":GOTO 10
      </div>

      <h2>7. Statements</h2>
      <p>VC83 BASIC includes a full suite of standard statements:</p>

      <StatementReference
        keyword="CLR"
        synopsis="resets all variables"
        syntax="CLR"
        example={<>10 A=10:B$="HI"<br />20 CLR<br />30 PRINT A;B$</>}
      >
        The <code>CLR</code> statement deletes all variables from memory and resets their values to zero 
        (for numbers) or empty strings (for strings). It also resets the internal stack, effectively 
        canceling any active <code>GOSUB</code> or <code>FOR</code> loops.
      </StatementReference>

      <StatementReference
        keyword="CONT"
        synopsis="continues program execution"
        syntax="CONT"
        example={<>10 STOP<br/>20 PRINT "AT 20"<br />RUN<br/><br/>STOPPED AT 10<br />CONT<br/>AT 20</>}
      >
        Use <code>CONT</code> to resume program execution after it has been paused by a <code>STOP</code> 
        statement or by pressing the break key. Note that you cannot use <code>CONT</code> if you 
        have edited any program lines while execution was paused.
      </StatementReference>

      <StatementReference
        keyword="DATA"
        synopsis="defines constant data"
        syntax="DATA value1 [, value2 [, ...]]"
        args={[
          { name: "value", desc: "a numeric or string constant to be stored" }
        ]}
        example={<>10 DATA 10, 20, "APPLE", 30<br />20 READ A, B, C$, D</>}
      >
        <code>DATA</code> statements allow you to store list of values within your program. These 
        values can be retrieved using the <code>READ</code> statement. String values in <code>DATA</code> 
        only need quotation marks if they contain commas or leading spaces.
      </StatementReference>

      <StatementReference
        keyword="DIM"
        synopsis="declares an array"
        syntax="DIM name(size1 [, size2 [, ...]])"
        args={[
          { name: "name", desc: "the name of the array variable" },
          { name: "size", desc: "the maximum index for that dimension" }
        ]}
        example={<>10 DIM A(100)<br />20 DIM MAP(10, 10)<br />30 A(50)=42</>}
      >
        <code>DIM</code> sets aside memory for an array with one or more dimensions. The index 
        of each dimension starts at 0, so <code>DIM A(10)</code> actually creates 11 elements. 
        If you use an array without <code>DIM</code>ming it first, BASIC defaults to a size of 10.
      </StatementReference>

      <StatementReference
        keyword="END"
        synopsis="terminates the program"
        syntax="END"
        example={<>10 PRINT "DONE"<br />20 END</>}
      >
        <code>END</code> stops program execution and returns the system to the <code>READY</code> 
        prompt. Unlike <code>STOP</code>, it does not print a "BREAK IN LINE" message. It is 
        often used to prevent execution from "falling into" subroutines at the end of a program.
      </StatementReference>
      <StatementReference
        keyword="FOR"
        synopsis="starts a counted loop"
        syntax="FOR variable=start TO end [STEP increment]"
        args={[
          { name: "variable", desc: "a numeric variable used as the loop counter" },
          { name: "start/end", desc: "the initial and final values for the counter" },
          { name: "increment", desc: "(optional) the amount to change the counter by each loop" }
        ]}
        example={<>10 FOR I=1 TO 10 STEP 2<br />20 PRINT I<br />30 NEXT I</>}
      >
        <code>FOR</code> begins a loop that repeats until the counter variable reaches the 
        <code>end</code> value. If <code>STEP</code> is omitted, BASIC assumes an increment of 1. 
        Loops can count backwards if the <code>start</code> is greater than the <code>end</code> 
        and the <code>STEP</code> is negative.
      </StatementReference>

      <StatementReference
        keyword="GOSUB"
        synopsis="calls a subroutine"
        syntax="GOSUB line_number"
        args={[
          { name: "line_number", desc: "the starting line of the subroutine" }
        ]}
        example={<>10 GOSUB 500<br />20 PRINT "RETURNED"<br />30 END<br />500 PRINT "IN SUB":RETURN</>}
      >
        <code>GOSUB</code> jumps to the specified line number and saves its current position 
        on the internal stack. When the program later encounters a <code>RETURN</code>, 
        it will jump back to the statement following the <code>GOSUB</code>.
      </StatementReference>

      <StatementReference
        keyword="GOTO"
        synopsis="jumps to a line"
        syntax="GOTO line_number"
        args={[
          { name: "line_number", desc: "the destination line number" }
        ]}
        example={<>10 PRINT "LOOPING forever"<br />20 GOTO 10</>}
      >
        <code>GOTO</code> causes an unconditional jump to the specified line number. It is 
        often used at the end of a block of code to loop back to an earlier point 
        or to skip over subroutines.
      </StatementReference>

      <StatementReference
        keyword="IF"
        synopsis="conditional execution"
        syntax="IF condition THEN statement | line_number"
        args={[
          { name: "condition", desc: "a numeric expression (non-zero is true)" },
          { name: "statement", desc: "the action to perform if true" }
        ]}
        example={<>10 INPUT X<br />20 IF X&gt;10 THEN PRINT "BIG"</>}
      >
        The <code>IF</code> statement evaluates a condition. If the result is true (non-zero), 
        the code following <code>THEN</code> is executed. If false (zero), BASIC ignores 
        the rest of the current line and moves to the next line number.
      </StatementReference>

      <StatementReference
        keyword="INPUT"
        synopsis="gets data from the user"
        syntax='INPUT ["prompt";] variable1 [, variable2 [, ...]]'
        args={[
          { name: "prompt", desc: "(optional) text to display to the user; if not provided, the prompt is \"?\"" },
          { name: "variable", desc: "the variable(s) to store the result in" }
        ]}
        example={<>10 INPUT "WHAT IS YOUR NAME? ";N$<br />20 PRINT "HELLO ";N$</>}
      >
        <code>INPUT</code> pauses the program and displays a question mark (plus any optional 
        prompt text) to the user. The values typed by the user are assigned to the 
        specified variables. Multiple variables can be input at once, separated by 
        commas.
      </StatementReference>
      <StatementReference
        keyword="LET"
        synopsis="assigns a value to a variable"
        syntax="[LET] variable=expression"
        args={[
          { name: "variable", desc: "the name of the variable to store the value in" },
          { name: "expression", desc: "the numeric or string value to assign" }
        ]}
        example={<>10 LET A=5<br />20 B$="RETRO"</>}
      >
        <code>LET</code> is used to assign values to variables. In VC83 BASIC, the 
        <code>LET</code> keyword itself is optional—you can simply write <code>A=5</code>.
      </StatementReference>

      <StatementReference
        keyword="LIST"
        synopsis="displays program lines"
        syntax="LIST [start_line [, end_line]]"
        args={[
          { name: "start_line", desc: "(optional) the first line to display" },
          { name: "end_line", desc: "(optional) the last line to display" }
        ]}
        example={<>LIST 10,100</>}
      >
        <code>LIST</code> output your stored program to the screen. If no line numbers are 
        provided, the entire program is shown. You can list a single line or a range 
        of lines separated by a comma.
      </StatementReference>

      <StatementReference
        keyword="NEW"
        synopsis="erases the current program"
        syntax="NEW"
        example={<>NEW</>}
      >
        The <code>NEW</code> command deletes the program currently in memory and 
        resets all variables. Use this when you want to start a completely new 
        program from scratch.
      </StatementReference>

      <StatementReference
        keyword="NEXT"
        synopsis="ends a FOR loop"
        syntax="NEXT [variable]"
        args={[
          { name: "variable", desc: "(optional) the counter variable of the loop" }
        ]}
        example={<>10 FOR I=1 TO 10:PRINT I:NEXT I</>}
      >
        <code>NEXT</code> marks the end of a <code>FOR</code> loop block. It increments the 
        loop counter and returns execution to the corresponding <code>FOR</code> statement 
        if the end value hasn't been reached. The variable name is optional but 
        recommended for clarity.
      </StatementReference>

      <StatementReference
        keyword="ON"
        synopsis="multi-way branching"
        syntax="ON expression GOTO | GOSUB line1 [, line2 [, ...]]"
        args={[
          { name: "expression", desc: "a numeric value determining the jump index" },
          { name: "line", desc: "comma-separated list of destination line numbers" }
        ]}
        example={<>10 INPUT X<br />20 ON X GOTO 100, 200, 300</>}
      >
        The <code>ON</code> statement is a "computed jump." It evaluates the expression 
        and jumps to the Nth line number in the list. If the result is 0, execution 
        continues on the next line. Values 1 through N jump to the corresponding 
        line. Values outside this range will cause an error.
      </StatementReference>
      <StatementReference
        keyword="POKE"
        synopsis="writes to a memory address"
        syntax="POKE address, value"
        args={[
          { name: "address", desc: "the decimal memory address to write to" },
          { name: "value", desc: "the byte value (0–255) to store" }
        ]}
        example={<>POKE 49152, 0</>}
      >
        <code>POKE</code> allows you to directly modify the computer's memory. It is often used 
        to trigger hardware effects, change system settings, or store small amounts 
        of data in memory locations not used by BASIC.
      </StatementReference>

      <StatementReference
        keyword="POP"
        synopsis="removes an entry from the stack"
        syntax="POP"
        example={<>10 GOSUB 100<br />20 END<br />100 POP:GOTO 20</>}
      >
        <code>POP</code> removes the most recent <code>GOSUB</code> or <code>FOR</code> return 
        address from the internal stack. This is necessary if you intend to exit 
        from a subroutine or loop using a <code>GOTO</code> instead of the standard 
        <code>RETURN</code> or <code>NEXT</code>.
      </StatementReference>

      <StatementReference
        keyword="PRINT"
        synopsis="outputs text and data"
        syntax='PRINT [expression] [; | ,] ...'
        args={[
          { name: "expression", desc: "the value(s) to display" },
          { name: ";", desc: "concatenates the next item without spaces" },
          { name: ",", desc: "tabs the next item to the next column" }
        ]}
        example={<>PRINT "SCORE: ";S,"LIVES: ";L<br/>?"HELLO, ";NAME$</>}
      >
        <code>PRINT</code> (which can be abbreviated as <code>?</code>) displays information 
        on the screen. A semicolon (<code>;</code>) keeps the cursor at the end 
        of the current item, while a comma (<code>,</code>) moves it to the 
        next tab stop (usually every 10 characters).
      </StatementReference>

      <StatementReference
        keyword="READ"
        synopsis="gets values from DATA statements"
        syntax="READ variable1 [, variable2 [, ...]]"
        args={[
          { name: "variable", desc: "the name of the variable to load data into" }
        ]}
        example={<>10 DATA 10, 20<br />20 READ A, B</>}
      >
        <code>READ</code> retrieves values from the program's <code>DATA</code> statements 
        and assigns them to variables. BASIC keeps an internal pointer that 
        advances with each <code>READ</code>.
      </StatementReference>

      <StatementReference
        keyword="REM"
        synopsis="identifies a comment"
        syntax="REM [comment text]"
        example={<>10 REM *** SCORE ROUTINE ***</>}
      >
        <code>REM</code> (short for Remark) allows you to add comments to your program. 
        Anything following <code>REM</code> on a line is ignored by the computer 
        during execution.
      </StatementReference>
      <StatementReference
        keyword="RESTORE"
        synopsis="resets the DATA pointer"
        syntax="RESTORE"
        example={<>10 DATA 1, 2<br />20 READ A:RESTORE:READ B</>}
      >
        <code>RESTORE</code> resets the program's internal <code>DATA</code> pointer to 
        the very first <code>DATA</code> statement in the program. This allows you 
        to read the same values multiple times.
      </StatementReference>

      <StatementReference
        keyword="RETURN"
        synopsis="returns from a subroutine"
        syntax="RETURN"
        example={<>100 PRINT "SUBROUTINE":RETURN</>}
      >
        <code>RETURN</code> marks the end of a subroutine. It retrieves the return 
        address from the stack and jumps back to the statement immediately 
        following the most recent <code>GOSUB</code>.
      </StatementReference>

      <StatementReference
        keyword="RUN"
        synopsis="starts program execution"
        syntax="RUN [line_number]"
        args={[
          { name: "line_number", desc: "(optional) the line to start at" }
        ]}
        example={<>RUN</>}
      >
        <code>RUN</code> clears all variables and begins executing the program from the 
        lowest line number (or the specified line).
      </StatementReference>

      <StatementReference
        keyword="STOP"
        synopsis="pauses program execution"
        syntax="STOP"
        example={<>10 PRINT "PAUSING":STOP</>}
      >
        <code>STOP</code> halts the program and prints a "BREAK IN LINE" message. Unlike 
        <code>END</code>, it is intended for debugging, and you can resume execution 
        using the <code>CONT</code> command.
      </StatementReference>

      <h2>8. Functions</h2>
      <p>Functions perform calculations or transformations and return a single value.</p>

      <FunctionReference
        keyword="ABS"
        synopsis="absolute value"
        syntax="ABS(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the value to process" }]}
        returns="The positive equivalent of the input number."
        example={<>PRINT ABS(-5)<br />5</>}
      >
        Returns the absolute value of a number, effectively removing its sign.
      </FunctionReference>

      <FunctionReference
        keyword="ADR"
        synopsis="get memory address of string"
        syntax="ADR(string_variable)"
        args={[{ name: "string_variable", desc: "the string to inspect" }]}
        returns="The memory address where the string data is stored."
        example={<>10 A$="CAT":PRINT ADR(A$)</>}
      >
        Returns the actual memory address pointing to the start of the string's character data. 
        This is useful for passing string data to machine language routines.
        To obtain the length of the string, <code>PEEK</code> at the <code>ADR</code>
        address minus one.
      </FunctionReference>

      <FunctionReference
        keyword="ASC"
        synopsis="ASCII character code"
        syntax="ASC(string_expression)"
        args={[{ name: "string_expression", desc: "the string to read" }]}
        returns="The numeric ASCII code of the first character."
        example={<>PRINT ASC("APPLE")<br />65</>}
      >
        Returns the numeric representation of the first character in the provided string.
      </FunctionReference>

      <FunctionReference
        keyword="ATN"
        synopsis="arctangent"
        syntax="ATN(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the tangent value" }]}
        returns="The angle in radians."
        example={<>PRINT ATN(1)</>}
      >
        Returns the arctangent of the specified value.
      </FunctionReference>

      <FunctionReference
        keyword="CHR$"
        synopsis="character from code"
        syntax="CHR$(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the ASCII code" }]}
        returns="A single-character string."
        example={<>PRINT CHR$(65)<br />A</>}
      >
        Converts an ASCII code into its corresponding text character.
      </FunctionReference>

      <FunctionReference
        keyword="COS"
        synopsis="cosine"
        syntax="COS(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the angle in radians" }]}
        returns="The cosine of the angle."
        example={<>PRINT COS(0)<br />1</>}
      >
        Calculates the cosine of an angle specified in radians.
      </FunctionReference>
      <FunctionReference
        keyword="EXP"
        synopsis="exponential"
        syntax="EXP(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the value for the power" }]}
        returns="e raised to the power of the specified number."
        example={<>PRINT EXP(1)<br />2.71828182</>}
      >
        Returns the value of the mathematical constant e (~2.718) raised to the 
        provided power.
      </FunctionReference>

      <FunctionReference
        keyword="FRE"
        synopsis="free memory"
        syntax="FRE(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "any numeric value (usually 0)" }]}
        returns="The number of free bytes remaining for BASIC variables."
        example={<>PRINT FRE(0)</>}
      >
        Returns the amount of available RAM in the system. The argument is required 
        but ignored by the computer.
      </FunctionReference>

      <FunctionReference
        keyword="INT"
        synopsis="integer truncation"
        syntax="INT(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the number to truncate" }]}
        returns="The closest integer value towards zero."
        example={<>PRINT INT(3.9)<br />3</>}
      >
        Removes the fractional part of a number, returning the integer component.
      </FunctionReference>

      <FunctionReference
        keyword="LEFT$"
        synopsis="leftmost character extraction"
        syntax="LEFT$(string_expression, numeric_expression)"
        args={[
          { name: "string_expression", desc: "the source text" },
          { name: "numeric_expression", desc: "number of characters to take" }
        ]}
        returns="A string containing the characters from the left side."
        example={<>PRINT LEFT$("BASIC",2)<br />BA</>}
      >
        Extracts a specific number of characters starting from the far left of 
        the string.
      </FunctionReference>

      <FunctionReference
        keyword="LEN"
        synopsis="string length"
        syntax="LEN(string_expression)"
        args={[{ name: "string_expression", desc: "the string to measure" }]}
        returns="The number of characters in the string."
        example={<>PRINT LEN("APPLE")<br />5</>}
      >
        Calculates and returns the total character count of a string.
      </FunctionReference>

      <FunctionReference
        keyword="LOG"
        synopsis="natural logarithm"
        syntax="LOG(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "a value greater than zero" }]}
        returns="The natural logarithm of the number."
        example={<>PRINT LOG(10)</>}
      >
        Calculates the natural logarithm (base e) of the provided number.
      </FunctionReference>
      <FunctionReference
        keyword="MID$"
        synopsis="substring extraction"
        syntax="MID$(string_expression, start [, count])"
        args={[
          { name: "string_expression", desc: "the source text" },
          { name: "start", desc: "the starting position (1-indexed)" },
          { name: "count", desc: "(optional) number of characters to take" }
        ]}
        returns="A substring from the middle of the source string."
        example={<>PRINT MID$("COMPUTER",4,3)<br />PUT</>}
      >
        Returns a portion of a string starting from a specific position. If 
        the count argument is omitted, all characters until the end of 
        the string are returned.
      </FunctionReference>

      <FunctionReference
        keyword="PEEK"
        synopsis="read memory"
        syntax="PEEK(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the memory address to read" }]}
        returns="A byte value (0–255) from the specified address."
        example={<>PRINT PEEK(33)</>}
      >
        Reads and returns the numeric value stored at a specific memory location. 
        Complements the <code>POKE</code> statement.
      </FunctionReference>

      <FunctionReference
        keyword="RIGHT$"
        synopsis="rightmost character extraction"
        syntax="RIGHT$(string_expression, numeric_expression)"
        args={[
          { name: "string_expression", desc: "the source text" },
          { name: "numeric_expression", desc: "number of characters to take" }
        ]}
        returns="A string containing characters from the end of the source."
        example={<>PRINT RIGHT$("VC83", 2)<br />83</>}
      >
        Extracts a specific number of characters from the far right side of 
        the string.
      </FunctionReference>

      <FunctionReference
        keyword="RND"
        synopsis="random number"
        syntax="RND(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "seed value" }]}
        returns="A floating point number between 0 and 1."
        example={<>PRINT RND(1)</>}
      >
        Returns a pseudo-random decimal number. The behavior varies slightly 
        depending on the seed argument's value (positive, negative, or zero).
      </FunctionReference>

      <FunctionReference
        keyword="SGN"
        synopsis="numeric sign"
        syntax="SGN(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the value to test" }]}
        returns="1 if positive, 0 if zero, or -1 if negative."
        example={<>PRINT SGN(-42)<br />-1</>}
      >
        Indicates whether a number is positive, negative, or zero.
      </FunctionReference>
      <FunctionReference
        keyword="SIN"
        synopsis="sine"
        syntax="SIN(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the angle in radians" }]}
        returns="The sine of the angle."
        example={<>PRINT SIN(0)<br />0</>}
      >
        Calculates the sine of an angle specified in radians.
      </FunctionReference>

      <FunctionReference
        keyword="SQR"
        synopsis="square root"
        syntax="SQR(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "a non-negative value" }]}
        returns="The positive square root of the number."
        example={<>PRINT SQR(64)<br />8</>}
      >
        Calculates the principal square root of the provided number.
      </FunctionReference>

      <FunctionReference
        keyword="STR$"
        synopsis="convert number to string"
        syntax="STR$(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the number to convert" }]}
        returns="A string representation of the number."
        example={<>10 A$=STR$(42):PRINT A$</>}
      >
        Converts a numeric value into a string of text characters.
      </FunctionReference>

      <FunctionReference
        keyword="TAN"
        synopsis="tangent"
        syntax="TAN(numeric_expression)"
        args={[{ name: "numeric_expression", desc: "the angle in radians" }]}
        returns="The tangent of the angle."
        example={<>PRINT TAN(0)<br />0</>}
      >
        Calculates the tangent of an angle specified in radians.
      </FunctionReference>

      <FunctionReference
        keyword="USR"
        synopsis="call machine language"
        syntax="USR(address, argument)"
        args={[
          { name: "address", desc: "the entry point of the routine" },
          { name: "argument", desc: "numeric value passed in the accumulator" }
        ]}
        returns="The numeric value returned by the machine language routine."
        example={<>X=USR(49152, 10)</>}
      >
        Calls a machine language subroutine at the specified memory address. The 
        argument is passed to the routine, and the routine's result is returned 
        as the function's value.
      </FunctionReference>

      <FunctionReference
        keyword="VAL"
        synopsis="convert string to number"
        syntax="VAL(string_expression)"
        args={[{ name: "string_expression", desc: "the string to convert" }]}
        returns="The numeric value represented by the string."
        example={<>PRINT VAL("123.45") + 1<br />124.45</>}
      >
        Converts a string of numeric characters into an actual number that 
        can be used in mathematical calculations. Returns 0 if the string 
        does not start with a valid number.
      </FunctionReference>
    </>
  );
};

export default Manual;
