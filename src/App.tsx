import { useState } from 'react';
import FaceTracker from './components/FaceTracker';
import ParallaxScene from './components/ParallaxScene';
import HoloAvatar from './components/HoloAvatar';
import type { NormalizedLandmarkList } from '@mediapipe/face_mesh';
import './index.css';

function App() {
  const [landmarks, setLandmarks] = useState<NormalizedLandmarkList | null>(null);
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0 });

  const handleFaceDetected = (lm: NormalizedLandmarkList) => {
    setLandmarks(lm);

    // Calculate simple center for parallax (using nose tip: index 1)
    if (lm && lm[1]) {
      // x: 0 (left) - 1 (right)
      // Mirror logic: moving left (x < 0.5) should be represented as such
      // Standardize to -1 to 1
      const x = (lm[1].x - 0.5) * 2;
      const y = (lm[1].y - 0.5) * 2;
      setFacePosition({ x, y });
    }
  };

  const handleFaceLost = () => {
    // Optional: Fade out effect
    // setLandmarks(null); // Keep last frame or clear? Clearing feels more responsive "lost signal"
    setLandmarks(null);
    setFacePosition({ x: 0, y: 0 });
  };

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#000' }}>
      <ParallaxScene faceX={facePosition.x} faceY={facePosition.y} />
      <HoloAvatar landmarks={landmarks} />
      <FaceTracker onFaceDetected={handleFaceDetected} onFaceLost={handleFaceLost} />
    </main>
  );
}

export default App;
