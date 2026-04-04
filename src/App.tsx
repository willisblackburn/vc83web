import React, { useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  const [isSampleBrowserOpen, setIsSampleBrowserOpen] = useState(false);
  const emulatorRef = useRef<EmulatorHandle>(null);

  const handleSampleClick = (sample: SampleProgram) => {
    if (emulatorRef.current) {
      const fullText = `NEW\n${sample.code.trim()}\nRUN\n`;
      emulatorRef.current.pasteText(fullText);
    }
  };

  return (
    <div className="app-container">
      <div className="crt-overlay crt-flicker" />
      <div className="background" />
      
      <aside className="sidebar">
        <Header />
        <Navigation />
      </aside>

      <main className="emulator-section">
          <Emulator 
            ref={emulatorRef}
            diskUrl="vc83basic.woz" 
          />
          
          <div className="emulator-controls">
            <div className="hardware-buttons">
              <button 
                className="retro-button power" 
                onClick={() => emulatorRef.current?.powerCycle()}
              >
                POWER
              </button>
              <button 
                className="retro-button reset" 
                onClick={() => emulatorRef.current?.reset()}
              >
                RESET
              </button>
            </div>
            <button 
              className="retro-button samples-trigger" 
              onClick={() => setIsSampleBrowserOpen(true)}
            >
              Load sample...
            </button>
          </div>
          
        <div className="attribution">
          Apple II emulator by Chris Torrence <a href="https://apple2ts.com" target="_blank" rel="noopener noreferrer">apple2ts.com</a>
        </div>
      </main>

      <section className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/manual" replace />} />
          <Route path="/:pageId" element={<ContentArea />} />
        </Routes>
      </section>

      <div className="app-footer">
        <Footer />
      </div>

      <SamplePrograms 
        isOpen={isSampleBrowserOpen}
        onClose={() => setIsSampleBrowserOpen(false)}
        onSampleClick={handleSampleClick} 
      />
    </div>
  );
};

export default App;
