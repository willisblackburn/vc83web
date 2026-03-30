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

  const [activeTab, setActiveTab] = useState('manual');
  const [isSampleBrowserOpen, setIsSampleBrowserOpen] = useState(false);
  const emulatorRef = useRef<EmulatorHandle>(null);

  const handleSampleClick = (sample: SampleProgram) => {
    if (emulatorRef.current) {
      const fullText = `NEW\n${sample.code.trim()}\nRUN\n`;
      emulatorRef.current.pasteText(fullText);
      // Removed scrolling as layout is more static now
    }
  };

  return (
    <div className="app-container">
      <div className="crt-overlay crt-flicker" />
      <div className="background" />
      
      <aside className="sidebar">
        <Header />
        
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <a 
          href="https://github.com/willisblackburn/vc83basic" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="github-link"
          title="VC83BASIC on GitHub"
        >
          <svg viewBox="0 0 16 16" className="github-icon" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
        </a>
      </aside>

      <main className="emulator-section">
          <Emulator 
            ref={emulatorRef}
            diskUrl="vc83basic.woz" 
          />
          
          <div className="emulator-controls">
            <button 
              className="retro-button samples-trigger" 
              onClick={() => setIsSampleBrowserOpen(true)}
            >
              Load sample...
            </button>
            <div className="hardware-buttons">
              <button 
                className="retro-button reset" 
                onClick={() => emulatorRef.current?.reset()}
              >
                RESET
              </button>
              <button 
                className="retro-button power" 
                onClick={() => emulatorRef.current?.powerCycle()}
              >
                POWER
              </button>
            </div>
          </div>
          
        <div className="attribution">
          Apple II+ emulator by Chris Torrence <a href="https://apple2ts.com" target="_blank" rel="noopener noreferrer">apple2ts.com</a>
        </div>
      </main>

      <section className="main-content">
        <ContentArea activeTab={activeTab} />
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
