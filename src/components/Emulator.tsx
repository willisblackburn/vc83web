import React, { useRef } from 'react';

interface EmulatorProps {
  diskUrl: string;
}

const Emulator: React.FC<EmulatorProps> = ({ diskUrl }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePowerCycle = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send a reboot command to the emulator using the new extended message listener
      iframeRef.current.contentWindow.postMessage({
        type: 'control',
        action: 'reboot'
      }, '*');
    } else if (iframeRef.current) {
      // Fallback: reload the iframe
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleReset = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send a reset command to the emulator using the new extended message listener
      iframeRef.current.contentWindow.postMessage({
        type: 'control',
        action: 'reset'
      }, '*');
    }
  };

  return (
    <div className="emulator-section">
      <div className="emulator-screen">
        <iframe
          ref={iframeRef}
          src={`/emulator/index.html?theme=vc83&machine=apple2p&ghosting=on#${diskUrl}`}
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
      <div className="attribution">
        Apple II+ emulator by Chris Torrence <a href="https://apple2ts.com" target="_blank" rel="noopener noreferrer">apple2ts.com</a>
      </div>
    </div>
  );
};

export default Emulator;
