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
      <div className="sample-browser" onClick={(e) => e.stopPropagation()}>
        <div className="sample-browser-header">
          <h2>Select Sample Program</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="sample-list">
          {samples.map((sample) => (
            <div 
              key={sample.id} 
              className="sample-item"
              onClick={() => {
                onSampleClick(sample);
                onClose();
              }}
            >
              <h4>{sample.title}</h4>
              <p>{sample.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SamplePrograms;
