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
          uses a dedicated <strong>Parser Virtual Machine (PVM)</strong> with a grammar is defined in a compact domain-specific 
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
    question: "Why don't you have (some feature)?",
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
          the experience of using a computer in the early 1980s (thus "83"). All of the home computers of that
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
        This is probably a simple change that we'd be happy to include in the core interpreter. Probably the
        best way would to add a TOUPPER opcode to the PVM and just invoke it in the <code>pvm_name</code> rule.
        This would convert keywords and variable names to uppercase while leaving strings 
        and <code>DATA</code>/<code>REM</code> lines alone.
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
