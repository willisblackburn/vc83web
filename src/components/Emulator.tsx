import React, { useRef } from 'react';

interface EmulatorProps {
  diskUrl: string;
}

const Emulator: React.FC<EmulatorProps> = ({ diskUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePowerCycle = () => {
    if (iframeRef.current) {
      // Reloading the iframe is the most reliable way to power cycle
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleReset = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send a reset command to the emulator
      // Based on messagelistener.ts, we can update parameters
      iframeRef.current.contentWindow.postMessage({
        type: 'updateParameters',
        params: {
          run: 'reset'
        }
      }, '*');
      
      // Note: If 'run: reset' isn't handled by apple2ts natively, 
      // we might need to send a specific key sequence like Ctrl-Reset.
      // For now, let's try this or just reload.
    }
  };

  return (
    <div className="emulator-section">
      <div className="emulator-screen">
        <iframe
          ref={iframeRef}
          src={`/emulator/index.html?theme=minimal&machine=apple2p#${diskUrl}`}
          title="VC83 BASIC Emulator"
          allow="autoplay"
        />
      </div>
      <div className="controls">
        <button className="retro-button power" onClick={handlePowerCycle}>
          Power
        </button>
        <button className="retro-button reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Emulator;
