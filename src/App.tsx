import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';
import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Emulator from './components/Emulator';
import type { EmulatorHandle } from './components/Emulator';
import Navigation from './components/Navigation';
import SamplePrograms from './components/SamplePrograms';
import Editor from './components/Editor';
import ContentArea from './components/ContentArea';
import type { SampleProgram } from './data/samples';

const App: React.FC = () => {
  const [isSampleBrowserOpen, setIsSampleBrowserOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorCode, setEditorCode] = useState(() => localStorage.getItem('vc83_editor_code') || '');
  const emulatorRef = useRef<EmulatorHandle>(null);
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_path: location.pathname + location.search,
      window_location: window.location.href,
    });
  }, [location]);

  const handleSampleClick = (sample: SampleProgram) => {
    if (emulatorRef.current) {
      const fullText = `NEW\n${sample.code.trim()}\nRUN\n`;
      emulatorRef.current.pasteText(fullText);
    }
  };

  const handleEditorChange = (code: string) => {
    setEditorCode(code);
    localStorage.setItem('vc83_editor_code', code);
  };

  const handleEditorUpload = () => {
    if (emulatorRef.current && editorCode.trim()) {
      const fullText = `NEW\n${editorCode.trim()}\n`;
      emulatorRef.current.pasteText(fullText);
    }
  };

  const handleEditorRun = () => {
    if (emulatorRef.current && editorCode.trim()) {
      const fullText = `NEW\n${editorCode.trim()}\nRUN\n`;
      emulatorRef.current.pasteText(fullText);
      setIsEditorOpen(false);
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
            <div className="software-buttons">
              <button 
                className="retro-button editor-trigger" 
                onClick={() => setIsEditorOpen(true)}
              >
                <i className="fa-solid fa-edit"></i>
              </button>
              <button 
                className="retro-button samples-trigger" 
                onClick={() => setIsSampleBrowserOpen(true)}
              >
                Load sample...
              </button>
            </div>
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

      <Editor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        code={editorCode}
        onChange={handleEditorChange}
        onUpload={handleEditorUpload}
        onRun={handleEditorRun}
      />
    </div>
  );
};

export default App;
