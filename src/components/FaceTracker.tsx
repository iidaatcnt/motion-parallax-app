import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import type { Results } from '@mediapipe/face_mesh';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as CameraUtils from '@mediapipe/camera_utils';

interface FaceTrackerProps {
    onFaceMove: (x: number, y: number) => void;
}

const FaceTracker: React.FC<FaceTrackerProps> = ({ onFaceMove }) => {
    const webcamRef = useRef<Webcam>(null);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const cameraRef = useRef<CameraUtils.Camera | null>(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [errorMSG, setErrorMSG] = useState<string>('');

    useEffect(() => {
        return () => {
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, []);

    const onCamLoad = () => {
        console.log("Camera Loaded");
        setCameraActive(true);

        if (webcamRef.current && webcamRef.current.video) {
            const videoElement = webcamRef.current.video;

            // Prevent multiple initializations
            if (cameraRef.current) return;

            const faceMesh = new FaceMesh({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
                },
            });
            faceMeshRef.current = faceMesh;

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults(onResults);

            const camera = new CameraUtils.Camera(videoElement, {
                onFrame: async () => {
                    if (videoElement) {
                        await faceMesh.send({ image: videoElement });
                    }
                },
                width: 1280,
                height: 720,
            });
            cameraRef.current = camera;
            camera.start();
        }
    };

    const onResults = (results: Results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            const landmarks = results.multiFaceLandmarks[0];
            const nose = landmarks[1];

            // FaceMesh: x increases left to right (0 -> 1)
            // Mirroring: We want moving head left (viewer's left) to correspond to x < 0.5
            // If we mirror the video display, we should also think about the interaction.
            // Usually, if I move 'left', the parallax should reveal the 'right' side of the background content (window effect).

            const x = (nose.x - 0.5) * 2;
            const y = (nose.y - 0.5) * 2;

            onFaceMove(x, y);
        }
    };

    return (
        <div className="absolute bottom-4 right-4 w-32 h-24 border-2 border-[var(--color-accent-primary)] rounded overflow-hidden opacity-50 hover:opacity-100 transition-opacity z-[1000]">
            <Webcam
                ref={webcamRef}
                audio={false}
                width="100%"
                height="100%"
                videoConstraints={{
                    facingMode: "user"
                }}
                onUserMediaError={(err) => setErrorMSG(err.toString())}
                onUserMedia={onCamLoad}
                style={{ transform: 'scaleX(-1)', objectFit: 'cover' }}
            />
            {errorMSG && <div className="text-red-500 text-xs">{errorMSG}</div>}
            {!cameraActive && !errorMSG && <div className="text-[var(--color-accent-primary)] text-xs text-center mt-2">Initializing...</div>}
        </div>
    );
};

export default FaceTracker;
