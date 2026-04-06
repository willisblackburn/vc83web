import React from 'react';
import { samples } from '../data/samples';
import type { SampleProgram } from '../data/samples';

interface SampleProgramsProps {
  isOpen: boolean;
  onClose: () => void;
  onSampleClick: (sample: SampleProgram) => void;
}

const SamplePrograms: React.FC<SampleProgramsProps> = ({ isOpen, onClose, onSampleClick }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h1>Select Sample Program</h1>
          <button className="close-button" onClick={onClose}>&times;</button>
        </header>
        <main>
          {samples.map((sample) => (
            <section 
              key={sample.id} 
              onClick={() => {
                onSampleClick(sample);
                onClose();
              }}
            >
              <h2>{sample.title}</h2>
              <div className="description">{sample.description}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default SamplePrograms;
