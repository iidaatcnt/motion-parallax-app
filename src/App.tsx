import { useState } from 'react';
import FaceTracker from './components/FaceTracker';
import ParallaxScene from './components/ParallaxScene';
import './index.css';

function App() {
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0 });

  const handleFaceMove = (x: number, y: number) => {
    // MediaPipe coords might need clamping or scaling
    // x, y came in as approximately -1 to 1 from FaceTracker
    setFacePosition({ x, y });
  };

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ParallaxScene faceX={facePosition.x} faceY={facePosition.y} />
      <FaceTracker onFaceMove={handleFaceMove} />
    </main>
  );
}

export default App;
