import React, { useState, useRef } from 'react';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Emulator from './components/Emulator';
import type { EmulatorHandle } from './components/Emulator';
import Navigation from './components/Navigation';
import SamplePrograms from './components/SamplePrograms';
import ContentArea from './components/ContentArea';
import type { SampleProgram } from './data/samples';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('about');
  const emulatorRef = useRef<EmulatorHandle>(null);

  const handleSampleClick = (sample: SampleProgram) => {
    if (emulatorRef.current) {
      // Sequence: NEW -> [Program Text] -> RUN
      // We send them as a single string to be pasted. 
      // The emulator's paste logic will handle the CRLFs (now managed as CRs in submodule).
      const fullText = `NEW\n${sample.code.trim()}\nRUN\n`;
      emulatorRef.current.pasteText(fullText);
      
      // Scroll to emulator for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <div className="crt-overlay crt-flicker" />
      <Header />
      
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <main>

        <Emulator 
          ref={emulatorRef}
          diskUrl="vc83basic.woz" 
        />

        <SamplePrograms 
          onSampleClick={handleSampleClick} 
        />

        <ContentArea activeTab={activeTab} />

      </main>
      <Footer />
    </div>
  );
};

export default App;
