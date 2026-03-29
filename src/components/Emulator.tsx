import { useRef, useImperativeHandle, forwardRef } from 'react';

interface EmulatorProps {
  diskUrl: string;
}

export interface EmulatorHandle {
  powerCycle: () => void;
  reset: () => void;
  pasteText: (text: string) => void;
}

const Emulator = forwardRef<EmulatorHandle, EmulatorProps>(({ diskUrl }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePowerCycle = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'control',
        action: 'reboot'
      }, '*');
    } else if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleReset = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'control',
        action: 'reset'
      }, '*');
    }
  };

  const handlePasteText = (text: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'paste',
        text: text
      }, '*');
    }
  };

  useImperativeHandle(ref, () => ({
    powerCycle: handlePowerCycle,
    reset: handleReset,
    pasteText: handlePasteText
  }));

  // Remove redundant 'disks/' prefix if diskUrl already contains it
  const cleanedDiskUrl = diskUrl.startsWith('disks/') ? diskUrl.substring(6) : diskUrl;

  return (
    <div className="emulator-screen">
      <iframe
        ref={iframeRef}
        src={`/emulator/index.html?theme=vc83&machine=apple2p&ghosting=on#${cleanedDiskUrl}`}
        title="VC83 BASIC Emulator"
        allow="autoplay"
      />
    </div>
  );
});

export default Emulator;
