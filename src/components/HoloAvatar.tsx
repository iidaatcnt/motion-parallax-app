import React, { useRef, useEffect } from 'react';
import type { NormalizedLandmarkList } from '@mediapipe/face_mesh';

interface HoloAvatarProps {
    landmarks: NormalizedLandmarkList | null;
}

const HoloAvatar: React.FC<HoloAvatarProps> = ({ landmarks }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const smileIntensity = useRef(0); // 0 to 1

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !landmarks) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- SMILE DETECTION ---
        let smileRatio = 0;
        try {
            const leftMouth = landmarks[61];
            const rightMouth = landmarks[291];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];

            if (leftMouth && rightMouth && leftEye && rightEye) {
                const mouthWidth = Math.hypot(rightMouth.x - leftMouth.x, rightMouth.y - leftMouth.y);
                const faceWidth = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
                const ratio = mouthWidth / faceWidth;
                smileRatio = Math.max(0, Math.min(1, (ratio - 0.40) * 5));
            }
        } catch (e) {
            // Fallback
        }

        // Smooth the value
        smileIntensity.current = smileIntensity.current + (smileRatio - smileIntensity.current) * 0.1;

        // --- COLOR INTERPOLATION ---
        const r = Math.round(0 + (255 - 0) * smileIntensity.current);
        const g = Math.round(243 + (170 - 243) * smileIntensity.current);
        const b = Math.round(255 + (0 - 255) * smileIntensity.current);

        const currentColor = `rgb(${r}, ${g}, ${b})`;

        const w = canvas.width;
        const h = canvas.height;

        for (let i = 0; i < landmarks.length; i++) {
            if (i % 2 !== 0) continue;

            const pt = landmarks[i];
            const x = (1 - pt.x) * w;
            const y = pt.y * h;

            ctx.fillStyle = currentColor;
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
