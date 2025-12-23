import React, { useRef, useEffect } from 'react';
import type { NormalizedLandmarkList, NormalizedLandmark } from '@mediapipe/face_mesh';

interface HoloAvatarProps {
    landmarks: NormalizedLandmarkList | null;
}

const HoloAvatar: React.FC<HoloAvatarProps> = ({ landmarks }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !landmarks) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Drawing Config
        const pointColor = '#00f3ff'; // Cyan
        const pointSize = 2;

        const w = canvas.width;
        const h = canvas.height;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const drawPoint = (landmark: NormalizedLandmark) => {
            // Mirror x: 1 - x
            const x = (1 - landmark.x) * w;
            const y = landmark.y * h;

            ctx.beginPath();
            ctx.arc(x, y, pointSize, 0, 2 * Math.PI);
            ctx.fillStyle = pointColor;
            ctx.fill();
        };

        // Draw all points
        // Optimization: Draw smaller dots or skip some if too heavy, but 468 is fine for 2D canvas.
        for (let i = 0; i < landmarks.length; i++) {
            // Draw every 2nd point for style/perf
            if (i % 2 !== 0) continue;

            const pt = landmarks[i];

            // Mirror x
            const x = (1 - pt.x) * w;
            const y = pt.y * h;

            // Draw Rect instead of Circle for "pixel/digital" feel
            ctx.fillStyle = pointColor;
            ctx.fillRect(x, y, 2, 2);
        }
    }, [landmarks]);

    return (
        <div className="absolute inset-0 flex items-center justify-center z-[50] pointer-events-none mix-blend-screen">
            <canvas
                ref={canvasRef}
                width={640} // Internal resolution
                height={480}
                className="w-full h-full object-contain opacity-80"
            />
        </div>
    );
};

export default HoloAvatar;
