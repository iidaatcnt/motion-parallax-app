import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import type { Results, NormalizedLandmarkList } from '@mediapipe/face_mesh';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as CameraUtils from '@mediapipe/camera_utils';

interface FaceTrackerProps {
    onFaceDetected: (landmarks: NormalizedLandmarkList) => void;
    onFaceLost: () => void;
}

const FaceTracker: React.FC<FaceTrackerProps> = ({ onFaceDetected, onFaceLost }) => {
    const webcamRef = useRef<Webcam>(null);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const cameraRef = useRef<CameraUtils.Camera | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        return () => {
            if (faceMeshRef.current) {
                faceMeshRef.current.close();
            }
        };
    }, []);

    const onResults = (results: Results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            onFaceDetected(results.multiFaceLandmarks[0]);
        } else {
            onFaceLost();
        }
    };

    const onCamLoad = () => {
        if (webcamRef.current && webcamRef.current.video && !cameraRef.current) {
            const videoElement = webcamRef.current.video;
            setIsInitialized(true);

            // Prevent re-initialization
            if (faceMeshRef.current) return;

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

    return (
        // Hide the actual camera feed, we only need the data
        <div className="fixed top-4 left-4 w-32 opacity-0 pointer-events-none">
            <Webcam
                ref={webcamRef}
                audio={false}
                width={320}
                height={240}
                videoConstraints={{ facingMode: "user" }}
                onUserMedia={onCamLoad}
            />
        </div>
    );
};

export default FaceTracker;
