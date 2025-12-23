import React, { useRef, useEffect } from 'react';
import type { NormalizedLandmarkList, NormalizedLandmark } from '@mediapipe/face_mesh';

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
        // Mouth Corners: 61 (Left), 291 (Right)
        // Eye Corners: 33 (Left), 263 (Right) - Use for normalization (head size)
        // Jaw Bottom: 152, Top: 10

        let smileRatio = 0;
        try {
            const leftMouth = landmarks[61];
            const rightMouth = landmarks[291];
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];

            if (leftMouth && rightMouth && leftEye && rightEye) {
                // Distance between mouth corners
                const mouthWidth = Math.hypot(rightMouth.x - leftMouth.x, rightMouth.y - leftMouth.y);
                // Distance between outer eye corners (face width reference)
                const faceWidth = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);

                // Ratio: Usually 0.35-0.4 is neutral, 0.45-0.5+ is smiling
                const ratio = mouthWidth / faceWidth;

                // Map 0.4 (neutral) -> 0.0, 0.55 (smile) -> 1.0
                // Clamped
                smileRatio = Math.max(0, Math.min(1, (ratio - 0.40) * 5)); // * 5 to scale 0.15 diff to ~0.75 range
            }
        } catch (e) {
            // Fallback
        }

        // Smooth the value
        smileIntensity.current = smileIntensity.current + (smileRatio - smileIntensity.current) * 0.1;

        // --- COLOR INTERPOLATION ---
        // Cool Cyan: #00f3ff (0, 243, 255)
        // Warm Gold: #ffaa00 (255, 170, 0)

        const r = Math.round(0 + (255 - 0) * smileIntensity.current);
        const g = Math.round(243 + (170 - 243) * smileIntensity.current);
        const b = Math.round(255 + (0 - 255) * smileIntensity.current);

        const currentColor = `rgb(${r}, ${g}, ${b})`;
        // Glow also changes
        const glowr = Math.round(0 + (255 - 0) * smileIntensity.current);
        const glow = `rgba(${glowr}, ${g}, ${b}, 0.5)`;

        const pointSize = 2; // slightly larger for visibility

        const w = canvas.width;
        const h = canvas.height;

        // Draw all points
        for (let i = 0; i < landmarks.length; i++) {
            // Draw more points for better definition
            if (i % 2 !== 0) continue;

            const pt = landmarks[i];

            // Mirror x
            const x = (1 - pt.x) * w;
            const y = pt.y * h;

            ctx.fillStyle = currentColor;

            // Add subtle glow to eyes (indices roughly around 33, 133, 362, 263) and mouth
            // Simple logic: just draw
            ctx.fillRect(x, y, 2, 2);
        }

        // Add "Smile Feedback" - A ring or aura around the face?
        // Or just make the points bloom when smiling
        if (smileIntensity.current > 0.5) {
            // Draw a text or indicator?
            // Let's keep it subtle but beautiful. The color shift is powerful.
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
