import React from 'react';

interface EditorProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onChange: (code: string) => void;
  onUpload: () => void;
  onRun: () => void;
}

const Editor: React.FC<EditorProps> = ({ 
  isOpen, 
  onClose, 
  code, 
  onChange, 
  onUpload, 
  onRun 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h1>Editor</h1>
          <button className="close-button" onClick={onClose}>&times;</button>
        </header>
        <main>
          <textarea 
            className="code-editor"
            value={code}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your BASIC program here..."
            spellCheck={false}
          />
        </main>
        <footer>
          <button className="retro-button" onClick={onUpload}>Upload</button>
          <button className="retro-button" onClick={onRun}>Run</button>
        </footer>
      </div>
    </div>
  );
};

export default Editor;
