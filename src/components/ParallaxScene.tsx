import React, { useRef, useEffect } from 'react';
import { lerp } from '../utils/math';
import './ParallaxScene.css';

interface ParallaxSceneProps {
    faceX: number; // -1 to 1
    faceY: number; // -1 to 1
}

const ParallaxScene: React.FC<ParallaxSceneProps> = ({ faceX, faceY }) => {
    // Current interpolated values
    const currentX = useRef(0);
    const currentY = useRef(0);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const midRef = useRef<HTMLDivElement>(null);
    const foreRef = useRef<HTMLDivElement>(null);
    const uiRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            // 1. IMPROVED SENSITIVITY
            // Multiply input by 2.5 so small head movements create large effects
            // Clamp between -1.5 and 1.5 to prevent too much distortion
            const targetX = Math.max(-1.5, Math.min(1.5, faceX * 2.5));
            const targetY = Math.max(-1.5, Math.min(1.5, faceY * 2.5));

            // Interpolation (Smoothing)
            currentX.current = lerp(currentX.current, targetX, 0.1);
            currentY.current = lerp(currentY.current, targetY, 0.1);

            const x = currentX.current;
            const y = currentY.current;

            // 2. 3D TILT EFFECT (Hologram feel)
            // Rotate the entire container based on head position
            if (containerRef.current) {
                // Look Left (x < 0) -> Rotate Y positive (Right edge goes back)
                containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;
            }

            // 3. AMPLIFIED LAYER MOVEMENT
            // Background (moves slightly same direction as head = distance)
            if (bgRef.current) {
                bgRef.current.style.transform = `translate3d(${x * 50}px, ${y * 50}px, 0) scale(1.2)`;
            }
            // Midground (moves opposite to head = closer)
            if (midRef.current) {
                midRef.current.style.transform = `translate3d(${-x * 80}px, ${-y * 80}px, 50px)`;
            }
            // Foreground (moves opposite strongly = very close)
            if (foreRef.current) {
                foreRef.current.style.transform = `translate3d(${-x * 160}px, ${-y * 160}px, 100px)`;
            }
            // UI (moves slightly to stabilize)
            if (uiRef.current) {
                uiRef.current.style.transform = `translate3d(${-x * 20}px, ${-y * 20}px, 0)`;
            }

            // 4. VISUAL CURSOR
            if (cursorRef.current) {
                // Map -1..1 to screen coordinates roughly
                const screenX = 50 + (x * 40); // %
                const screenY = 50 + (y * 40); // %
                cursorRef.current.style.left = `${screenX}%`;
                cursorRef.current.style.top = `${screenY}%`;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [faceX, faceY]);

    return (
        <div className="parallax-container bg-black overflow-hidden perspective-viewport">
            {/* Wrapper for 3D Tilt */}
            <div ref={containerRef} className="w-full h-full relative transition-[transform] duration-75 preserve-3d">

                {/* Background: Deep Space Grid */}
                <div ref={bgRef} className="bg-gradient absolute inset-[-20%] w-[140%] h-[140%]">
                    <div className="bg-grid" />
                    <div className="orb-purple" />
                    <div className="orb-blue" />
                </div>

                {/* Midground: Floating Geometric Shapes */}
                <div ref={midRef} className="parallax-layer mid-layer">
                    <div className="center-ring">
                        <div className="center-ring-inner" />
                    </div>
                    <div className="floating-triangle" />
                    <div className="floating-square" />
                </div>

                {/* Foreground: Text */}
                <div ref={foreRef} className="parallax-layer fore-layer">
                    <h1 className="title-text">PARALLAX</h1>
                    <p className="subtitle-text">SENSITIVITY: 300%</p>
                </div>

                {/* UI Layer */}
                <div ref={uiRef} className="parallax-layer ui-layer">
                    <div className="ui-center-row">
                        <div className="ui-corner ui-tl"></div>
                        <div className="ui-corner ui-tr"></div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="status-badge">SYSTEM ACTIVE</div>
                    </div>
                    <div className="ui-bottom-row">
                        <div className="ui-corner ui-bl"></div>
                        <div className="ui-corner ui-br"></div>
                    </div>
                </div>

                {/* Visual Cursor/Target */}
                <div ref={cursorRef} className="absolute w-8 h-8 border-2 border-[var(--color-accent-primary)] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[200] mix-blend-difference flex items-center justify-center">
                    <div className="w-1 h-1 bg-[var(--color-accent-primary)] rounded-full"></div>
                </div>

            </div>
        </div>
    );
};

export default ParallaxScene;
