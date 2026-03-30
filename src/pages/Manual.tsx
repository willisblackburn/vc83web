import React from 'react';

const Manual: React.FC = () => {
  return (
    <>
      <h3>1. Immediate Mode</h3>
      <p>
        You can enter any BASIC statement without a line number to execute it immediately. 
        This is useful for calculations or testing commands.
      </p>
      <ul>
        <li><strong>Example</strong>: <code>PRINT 12 * (3 + 4)</code> displays <code>84</code>.</li>
        <li><strong>Example</strong>: <code>INPUT A$: PRINT "HELLO ";A$</code></li>
      </ul>

      <h3>2. Entering and Editing the Program</h3>
      <p>
        Lines starting with a line number (1–65535) are stored in memory as part of your program.
      </p>
      <ul>
        <li><strong>Add/Replace</strong>: Type a line number followed by the statement. Re-entering an existing line number replaces it.</li>
        <li><strong>Delete</strong>: Type the line number by itself and press Enter.</li>
        <li><strong>LIST</strong>: Displays the program. Use <code>LIST 100</code> for a specific line, or <code>LIST 10,100</code> for a range.</li>
        <li><strong>NEW</strong>: Erases the entire program and all variables from memory.</li>
      </ul>

      <h3>3. Running the Program</h3>
      <p>
        After you have entered your program lines, you use the <code>RUN</code> command to begin execution. 
        Execution always starts at the lowest line number and proceeds sequentially.
      </p>
      <div className="code">
        RUN
      </div>
      <p>
        <code>RUN</code> automatically performs a <code>CLR</code> (Clear) operation. This wipes all variables 
        and arrays from memory, resetting everything to zero or empty strings before the program starts.
      </p>
      <p>
        If you want to start execution from a specific line number—perhaps for debugging or testing a specific routine—without 
        clearing your variables, you can use the <code>GOTO</code> command in immediate mode:
      </p>
      <div className="code">
        GOTO 500
      </div>
      <p>
        Unlike modern environments where variables often have limited "scope" or are cleared when a function ends, 
        BASIC variables are global and persistent. If your program finishes or is interrupted, 
        all variables remain in memory with their last-assigned values. You can even access and change them 
        in immediate mode. If you then restart the program using <code>GOTO</code> instead of <code>RUN</code>, 
        those variables will still have their previous values. This "living" memory can be a powerful tool 
        for debugging, but it can also lead to bugs if you expect a fresh start! To manually clear 
        memory at any time, simply type <code>CLR</code>.
      </p>
      <p>
        To temporarily halt a running program, include a <code>STOP</code> statement in your code. The computer will 
        report the line where it stopped and wait for your next command. To resume execution, 
        type <code>CONT</code> (Continue). However, keep in mind that modifying your program lines 
        while execution is paused will "break the link," making it impossible to <code>CONT</code>inue.
      </p>
      <p>
        When you want a program to terminate explicitly and return to the <code>READY.</code> prompt, 
        use the <code>END</code> statement. Finally, if a program enters an infinite loop and 
        refuses to stop through normal means, use the <strong>RESET</strong> button on the emulator 
        control panel to regain control of the system.
      </p>

      <h3>4. Expressions</h3>
      <p>VC83 supports standard mathematical and string operators:</p>
      <ul>
        <li><strong>Math</strong>: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>^</code> (exponentiation).</li>
        <li><strong>Strings</strong>: <code>&amp;</code> (concatenation).</li>
        <li><strong>Relational</strong>: <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</li>
      </ul>

      <h3>5. Controlling Program Flow</h3>
      <ul>
        <li><strong>IF</strong>: <code>IF [condition] THEN [statement]</code> (or line number). Executes the rest of the line only if the condition is true.</li>
        <li><strong>Logic</strong>: <code>AND</code>, <code>OR</code>, <code>NOT</code> for complex conditions.</li>
        <li><strong>FOR...TO...STEP / NEXT</strong>: Standard loop structure.</li>
        <li><strong>GOTO / GOSUB / RETURN</strong>: Branching and subroutines.</li>
        <li><strong>POP</strong>: Removes the top GOSUB or FOR entry from the stack. Use this if you need to exit a loop or subroutine prematurely.</li>
      </ul>

      <h3>6. Statements</h3>
      <p>VC83 BASIC includes a full suite of standard statements:</p>
      <ul>
        <li><strong>CLR</strong>: Resets all variables.</li>
        <li><strong>CONT</strong>: Continues after STOP.</li>
        <li><strong>DATA</strong>: Defines data for READ. (Example: <code>DATA 10, 20, "CAT"</code>)</li>
        <li><strong>DIM</strong>: Declares an array. (Example: <code>DIM A(10, 10)</code>)</li>
        <li><strong>END</strong>: Ends program execution.</li>
        <li><strong>FOR</strong>: Starts a loop. (Example: <code>FOR I = 1 TO 10 STEP .5</code>)</li>
        <li><strong>GOSUB</strong>: Calls a subroutine. (Example: <code>GOSUB 1000</code>)</li>
        <li><strong>GOTO</strong>: Jumps to a line. (Example: <code>GOTO 500</code>)</li>
        <li><strong>IF</strong>: Conditional execution. (Example: <code>IF X &gt; 0 THEN PRINT "OK"</code>)</li>
        <li><strong>INPUT</strong>: Gets user input. (Example: <code>INPUT "NAME? ";N$</code>)</li>
        <li><strong>LET</strong>: Assigns a value (Optional). (Example: <code>LET A = 5</code> or <code>A = 5</code>)</li>
        <li><strong>LIST</strong>: Shows the program.</li>
        <li><strong>NEW</strong>: Clears program and variables.</li>
        <li><strong>NEXT</strong>: End of a FOR loop.</li>
        <li><strong>ON ... GOTO / GOSUB</strong>: Computed jump. (Example: <code>ON X GOTO 10, 20, 30</code>)</li>
        <li><strong>POKE</strong>: Writes to memory. (Example: <code>POKE 49152, 0</code>)</li>
        <li><strong>POP</strong>: Clears stack entry.</li>
        <li><strong>PRINT</strong> (or <strong>?</strong>): Outputs text/data. (Example: <code>PRINT "HI"; X</code>)</li>
        <li><strong>READ</strong>: Reads next DATA item. (Example: <code>READ A, B, C$</code>)</li>
        <li><strong>REM</strong>: Indicates a comment.</li>
        <li><strong>RESTORE</strong>: Resets DATA pointer.</li>
        <li><strong>RETURN</strong>: Returns from GOSUB.</li>
        <li><strong>RUN</strong>: Executes the program.</li>
        <li><strong>STOP</strong>: Pauses the program.</li>
      </ul>

      <h3>7. Functions</h3>
      <ul>
        <li><strong>ABS(N)</strong>: Absolute value.</li>
        <li><strong>ADR(V$)</strong>: Returns the memory address of string data.</li>
        <li><strong>ASC(S$)</strong>: ASCII value of first character.</li>
        <li><strong>ATN(N)</strong>: Arctangent.</li>
        <li><strong>CHR$(N)</strong>: Character from ASCII value.</li>
        <li><strong>COS(N)</strong>: Cosine.</li>
        <li><strong>EXP(N)</strong>: e to the power of N.</li>
        <li><strong>FRE(0)</strong>: Remaining free memory in bytes.</li>
        <li><strong>INT(N)</strong>: Truncates towards zero.</li>
        <li><strong>LEFT$(S$, N)</strong>: N leftmost characters.</li>
        <li><strong>LEN(S$)</strong>: Length of string.</li>
        <li><strong>LOG(N)</strong>: Natural logarithm.</li>
        <li><strong>MID$(S$, P, N)</strong>: N characters starting from P.</li>
        <li><strong>PEEK(A)</strong>: Reads from memory address.</li>
        <li><strong>RIGHT$(S$, N)</strong>: N rightmost characters.</li>
        <li><strong>RND(N)</strong>: Random number (0–1).</li>
        <li><strong>ROUND(N)</strong>: Rounds to nearest integer.</li>
        <li><strong>SGN(N)</strong>: Sign of number (-1, 0, 1).</li>
        <li><strong>SIN(N)</strong>: Sine.</li>
        <li><strong>SQR(N)</strong>: Square root.</li>
        <li><strong>STR$(N)</strong>: Number to string.</li>
        <li><strong>TAN(N)</strong>: Tangent.</li>
        <li><strong>USR(A, N)</strong>: Calls machine code at A with argument N.</li>
        <li><strong>VAL(S$)</strong>: String to number.</li>
      </ul>
    </>
  );
};

export default Manual;
