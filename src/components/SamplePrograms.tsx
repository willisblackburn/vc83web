import type React from 'react';
import { samples } from '../data/samples';
import type { SampleProgram } from '../data/samples';

interface SampleProgramsProps {
  onSampleClick: (sample: SampleProgram) => void;
}

const SamplePrograms: React.FC<SampleProgramsProps> = ({ onSampleClick }) => {
  return (
    <div className="samples-container">
      <h2 className="retro-title">Sample Programs</h2>
      <div className="samples-grid">
        {samples.map((sample) => (
          <div 
            key={sample.id} 
            className="sample-panel"
            onClick={() => onSampleClick(sample)}
          >
            <h3>{sample.title}</h3>
            <p>{sample.description}</p>
            <div className="sample-footer">
              <span className="try-it">Load & Run</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SamplePrograms;
