import React from 'react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is VC83 BASIC?",
    answer: (
      <p>
        VC83 is a high-performance BASIC interpreter for 6502-based systems, specifically 
        optimized for the Apple II. It's written entirely in assembly language to provide 
        maximum speed while staying under a 16KB footprint.
      </p>
    )
  },
  {
    question: "Is it 100% compatible with Applesoft?",
    answer: (
      <p>
        No. While VC83 uses a similar syntax, it is built from the ground up with 
        different internal logic and a more modern floating-point unit. Some 
        specialized Applesoft-only commands may not be present, but the core 
        instruction set will be very familiar.
      </p>
    )
  },
  {
    question: "How do I save my programs?",
    answer: (
      <p>
        VC83 BASIC can be integrated into Disk II or other storage systems. 
        Currently, the web-based emulator allows 
        you to export your code using standard clipboard functions.
      </p>
    )
  },
  {
    question: "Why would I use this instead of a modern language?",
    answer: (
      <p>
        Because programming on an 8-bit machine is about simplicity, constraints, 
        and immediate results. VC83 gives you the pleasure of classic BASIC 
        development with the speed of a professional-grade assembly interpreter.
      </p>
    )
  },
  {
    question: "Can I contribute to the source code?",
    answer: (
      <p>
        Absolutely! The project is open source. Check the 
        <strong> Project</strong> section for more information on how to 
        get involved.
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
