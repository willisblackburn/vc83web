import React from 'react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Why do we need another BASIC for the Apple II? Isn't Applesoft BASIC good enough?",
    answer: (
      <>
        <p>
          VC83 BASIC is intended as a native BASIC for new 6502 retrocomputer projects, not as a
          replacement for Applesoft. It's advantages over Microsoft 6502 BASIC are its clear
          documentation, ease of modification, test coverage, and an author who isn't yet a
          billionaire and is around to answer questions and provide technical assistance.
        </p>
        <p>
          The project uses the Apple II as its primary hardware platform because the author
          owns an Apple II+ and because of the availability of Chris Torrence's excellent
          browser-based <a href="https://apple2ts.com">Apple II emulator</a>, which enables visitors
          to use VC83 BASIC right here on the web site.
        </p>
      </>
    )
  },
  {
    question: "Is VC83 BASIC compatible with Applesoft?",
    answer: (
      <p>
        Nope, not at all. Most of the normal BASIC statements supported by Applesoft will work
        just fine, but we haven't made an effort to be compatible with Applesoft or Microsoft 6502 BASIC
        in general.
      </p>
    )
  },
  {
    question: "How does VC83 BASIC differ from Microsoft BASIC?",
    answer: (
      <>
        <p>
          <strong>Parser:</strong> Traditional Microsoft BASIC dialects perform a 
          simple keyword substitution during line entry, replacing recognized statement names 
          with 1-byte tokens without performing a full syntax validation. This means that syntax 
          errors are not detected until the program is executed. VC83 BASIC instead 
          uses a dedicated <strong>Parser Virtual Machine (PVM)</strong> and DFA-based lexer with a grammar defined in a compact domain-specific 
          language (DSL) to perform a complete syntax check at the time of entry. This enables early
          detection of errors and eliminates the need to handle invalid syntax at runtime.
        </p>
        <p>
          <strong>Variable Names:</strong> A limitation of Microsoft BASIC 
          is that only the first two characters of a variable name are significant. 
          In Microsoft BASIC, <code>VARIABLE1</code> and <code>VARIABLE2</code> are treated as the 
          same variable. VC83 BASIC allows variable names of any length, improving 
          code readability and preventing accidental naming collisions.
        </p>
        <p>
          <strong>Garbage Collection Strategy:</strong> The Microsoft BASIC garbage collector 
          famously causes long "pauses" during execution. This occurs because the collector 
          uses an <i>O</i>(<i>n</i><sup>2</sup>) algorithm that repeatedly scans the variable table to find the 
          next string to relocate. VC83's mark-sweep-compact collector has linear 
          (<i>O</i>(<i>n</i>)) complexity, providing more consistent performance even as the string 
          heap fills.
        </p>
      </>
    )
  },
  {
    question: "Does VC83 BASIC support the 65C02?",
    answer: (
      <p>
        VC83 BASIC does not use any 65C02-specfic instructions, not due to a deliberate rejection of the 65C02, but
        just because the primary hardware platform, the Apple II, only has a 6502.
        There are places in the code where it would be useful to have access to 65C02 instructions
        such as <code>PHX</code>/<code>PHY</code>, <code>STZ</code>, immediate-mode <code>BIT</code>, etc.
        If you'd like to improve the code to use 65C02 instructions when the platform supports them, go for it.
      </p>
    )
  },
  {
    question: "Is it really an 8K BASIC?",
    answer: (
      <>
        <p>
          The <code>apple2</code> target fits in 8K (under 8,192 bytes), but it is intended as a proof of concept. 
          To fit the entire interpreter, including its DFA lexer, PVM parser, linear-time string garbage collector, 
          and 32-bit floating-point math engine—into an exact 8K footprint, the <code>apple2</code> target omits 
          the trigonometric functions: <code>SIN</code>, <code>COS</code>, <code>TAN</code>, and <code>ATN</code>.
        </p>
        <p>
          Historically, classic 6502 BASICs that claimed an "8K" label also made significant compromises or relied on external ROM:
        </p>
        <ul>
          <li>
            <strong>Atari BASIC:</strong> Squeezed into an 8K cartridge ROM, but relied on the Atari OS ROM for its 
            floating-point math pack, lacked dynamic string garbage collection (using fixed-dimension string slicing instead), 
            and omitted string arrays.
          </li>
          <li>
            <strong>Microsoft / Commodore BASIC:</strong> Often described as an "8K BASIC" (occupying the 8K ROM at <code>$A000–$BFFF</code> on Commodore machines), it actually spilled 1,280 bytes of floating-point math and transcendental routines into the Kernal ROM (<code>$E000–$E4FF</code>), making its true footprint over 9.25K. Even with that extra space, it relied on a minimal keyword-replacement scanner rather than an upfront syntax-validating parser, limited variable names to two significant characters, and used an <i>O</i>(<i>n</i><sup>2</sup>) string garbage collector that caused noticeable pauses. Dialects that added graphics and extended statements (such as Applesoft II) grew to 10K, 12K, or 16K+.
          </li>
          <li>
            <strong>BBC BASIC:</strong> Offered an exceptionally powerful language and inline assembler, but required a 16K ROM.
          </li>
        </ul>
        <p>
          While a true 8K BASIC requires some compromises, VC83 BASIC is intended for new 6502 builds. Keeping the 
          portable language core down to 8K leaves plenty of headroom for platforms to extend the language—adding full trig, 
          channel-based I/O, graphics, and sound—while staying comfortably within a 10K, 12K, or 16K ROM envelope (as seen in 
          the <code>apple2_lc</code> and <code>ac6502</code> targets).
        </p>
      </>
    )
  },
  {
    question: "Why don't you have ________?",
    answer: (
      <>
        <p>
          The usual reason is that it just didn't fit. The core interpreter is designed to run in only
          8K on the Apple II. It turns out to be quite difficult to fit a full-featured BASIC that supports floating point math
          into 8K; choosing to include some features necessarily means sacrificing others. We chose to include
          a couple of features, a more sophisticated parser and a fast string garbage collector, that take up more
          space than their simpler Microsoft BASIC counterparts, so we had to cut a few things from the core
          interpreter that Microsoft supports, such as <code>DEF&nbsp;FN</code>.
        </p>
        <p>
          While the core interpreter is designed to fit in 8K, platform extensions can be any size,
          so you can build a richer 12K or 16K BASIC for your own project. This is what motivated the decisions about
          including the better parser and garbage collector in the core interpreter: these would have been harder
          to add later as platform-specific features, whereas implementing <code>DEF&nbsp;FN</code> as
          a platform-specific statement is more straightforward. If you want to add a feature
          that isn't just an extra statement or function, e.g., support for integer variables,
          let us know so we can work out how to enable that as an optional core feature.
        </p>
      </>
    )
  },
  {
    question: "I love BASIC but don't like line numbers. Why didn't you implement a full-screen editor?",
    answer: (
      <>
        <p>
          The main reason is that VC83 BASIC is attempting to recreate
          the experience of using a computer in the early 1980s (specifically, 1983). All of the home computers of that
          era had line-number based BASICs: think Apple II+ and IIe, Commodore 64, Atari 400/800, TRS-80, Sinclair Spectrum,
          etc. Even the BBC Micro, which had a famously powerful BASIC, still used line numbers, as did the
          BASIC that came with the original IBM PC. Full screen BASIC editors were more a late-1980s thing,
          starting with the 16-bit generation of home computers such as the Amiga, which included a
          BASIC with a full-screen editor. The author's initial experience with a BASIC with a full-screen
          editor was <a href="https://en.wikipedia.org/wiki/GFA_BASIC">GFA BASIC</a> on the 
          Atari ST. <a href="https://en.wikipedia.org/wiki/Turbo-Basic_XL">Turbo Basic XL</a> for
          the Atari XL/XE computers, written by the same author as GFA BASIC, included a full-screen editor, but
          was released in 1985 and notably required 64K of RAM, making it incompabile with the original Atari 400
          and 800.
        </p>
        <p>
          Also, see the previous question about how it's hard to fit lots of features into 8K. Implementing a
          full-screen editor in a platform-independent manner would have required a lot of space that we just
          didn't have.
        </p>
        <p>
          All that said, it is certainly possible to implement a full-screen editor as a platform-specific
          feature. Let us know if you'd like to work on that. It would probably require adding support for
          labels and making GOTO/GOSUB/etc. work with labels instead of line numbers. The structure of the
          program in memory doesn't have to change; the program line numbers can just reflect the number of
          that line in the editor.
        </p>
      </>
    )
  },
  {
    question: "Can I make VC83 BASIC accept keywords in lowercase?",
    answer: (
      <p>
        VC83 BASIC already accepts keywords and variable names in lowercase! The dedicated 
        lexer uses DFA state tables generated with a <code>CASE_INSENSITIVE</code> flag that automatically 
        folds lowercase <code>a-z</code> to uppercase <code>A-Z</code> during identifier and keyword tokenization. 
        Strings and raw text in <code>DATA</code>/<code>REM</code> statements remain untouched.
      </p>
    )
  },
  {
    question: "Why are there separate name tables for variables and arrays?",
    answer: (
      <p>
        If we combined variables and arrays into a single namespace, we'd have to include some way to distinguish
        between them. This would probably have to be part of the name, because it's legal in BASIC to have a regular
        variable and an array with the same name, so maybe all arrays could include a <code>(</code> at the end, i.e., the
        stored name for an array <code>A</code> would be <code>A(</code>. But now the parsing and <code>LIST</code>ing
        of array names and function names is totally different, because we don't want to include <code>(</code> in
        the function names; it would just be a waste of space. We'd rather treat array names and function names
        the same, and also avoid using an extra byte for every array name, so we have a separate name table for arrays.
      </p>
    )
  }
];

const FAQ: React.FC = () => {
  return (
    <>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => (
          <div className="faq-item" key={index}>
            <h2>{item.question}</h2>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;
