import React from 'react';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Emulator from './components/Emulator';
import Section from './components/Section';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="crt-overlay crt-flicker" />
      <Header />
      <main>
        <section className="hero">
          <p className="lead">
            Experience VC83 BASIC running live in your browser on a simulated Apple II+.
          </p>
        </section>

        <Emulator diskUrl="vc83basic.woz" />

        <Section id="about" title="About VC83 BASIC">
          <p>
            VC83 BASIC is a high-performance BASIC interpreter for the Apple II family of computers, 
            written entirely in 6502 assembly language. It aims to provide a modern programming 
            experience while staying true to the constraints and charm of the early 8bit era.
          </p>
          <p>
            Whether you are a retro enthusiast or a curious developer, VC83 offers a unique 
            blend of speed, compatibility, and ease of use.
          </p>
        </Section>

        <Section id="manual" title="User Manual">
          <p>VC83 BASIC follows the classic Applesoft syntax with several enhancements:</p>
          <ul>
            <li><strong>FAST</strong>: Optimized math and string routines.</li>
            <li><strong>EXTENDED</strong>: New commands for graphics and sound.</li>
            <li><strong>COMPACT</strong>: Fits in just a few kilobytes of memory.</li>
          </ul>
          <p>Refer to the <a href="#">documentation</a> for a full command reference.</p>
        </Section>

        <Section id="technical" title="Technical Details">
          <p>
            Built using the <strong>cc65</strong> toolchain and tested on original hardware. 
            The interpreter leverages zero-page locations for maximum efficiency and implements 
            a customized floating-point library.
          </p>
        </Section>

        <Section id="contributing" title="Contributing">
          <p>
            VC83 is an open-source project. You can find the source code and contribute to its 
            development on <a href="https://github.com/willisblackburn/vc83basic">GitHub</a>.
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
