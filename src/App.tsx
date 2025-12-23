import { useState, useRef, useEffect } from 'react';
import FaceTracker from './components/FaceTracker';
import ParallaxScene from './components/ParallaxScene';
import HoloAvatar from './components/HoloAvatar';
import type { NormalizedLandmarkList } from '@mediapipe/face_mesh';
import './index.css';

function App() {
  const [landmarks, setLandmarks] = useState<NormalizedLandmarkList | null>(null);
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Calibration offset
  const rawFacePos = useRef({ x: 0, y: 0 });

  const handleFaceDetected = (lm: NormalizedLandmarkList) => {
    setLandmarks(lm);

    if (lm && lm[1]) {
      const rawX = (lm[1].x - 0.5) * 2;
      const rawY = (lm[1].y - 0.5) * 2;

      rawFacePos.current = { x: rawX, y: rawY };

      // Apply calibration offset
      // If Offset is (0.2, 0.2), and Raw is (0.2, 0.2), Result should be (0, 0)
      const calibratedX = rawX - offset.x;
      const calibratedY = rawY - offset.y;

      setFacePosition({ x: calibratedX, y: calibratedY });
    }
  };

  const handleReset = () => {
    // Set current raw position as the new "zero"
    setOffset({
      x: rawFacePos.current.x,
      y: rawFacePos.current.y
    });
  };

  // Keyboard shortcut for reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFaceLost = () => {
    setLandmarks(null);
    setFacePosition({ x: 0, y: 0 });
  };

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000' }}>

      {/* Version & Status Indicator */}
      <div className="absolute top-4 left-4 z-[9999] text-xs font-mono">
        <div className="text-cyan-500 font-bold mb-1">Ver 3.0: CALIBRATION</div>
        <div className={`px-2 py-1 rounded ${landmarks ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-red-500/20 text-red-300 border border-red-500'}`}>
          STATUS: {landmarks ? 'FACE DETECTED' : 'SEARCHING FACE...'}
        </div>
      </div>

      {/* Calibration Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[9999]">
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500 text-cyan-400 font-mono text-sm rounded transition-colors uppercase tracking-widest backdrop-blur-sm"
        >
          Reset Center [SPACE]
        </button>
      </div>

      <ParallaxScene faceX={facePosition.x} faceY={facePosition.y} />
      <HoloAvatar landmarks={landmarks} />
      <FaceTracker onFaceDetected={handleFaceDetected} onFaceLost={handleFaceLost} />
    </main>
  );
}

export default App;
