import React, { useRef, useEffect } from 'react';
import { lerp } from '../utils/math';
import './ParallaxScene.css';

interface ParallaxSceneProps {
    faceX: number; // -1 to 1
    faceY: number; // -1 to 1
}

const ParallaxScene: React.FC<ParallaxSceneProps> = ({ faceX, faceY }) => {
    // Use refs for smooth animation without re-rendering the whole component approach
    // However, props update triggers re-render, which is fine for this scale.
    // We can use requestAnimationFrame for smoothing if prop updates are choppy.

    // Current interpolated values
    const currentX = useRef(0);
    const currentY = useRef(0);

    // Refs to DOM elements
    const bgRef = useRef<HTMLDivElement>(null);
    const midRef = useRef<HTMLDivElement>(null);
    const foreRef = useRef<HTMLDivElement>(null);
    const uiRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;

        const animate = () => {
            // Smooth interpolation (sensitivity factor 0.1)
            currentX.current = lerp(currentX.current, faceX, 0.1);
            currentY.current = lerp(currentY.current, faceY, 0.1);

            const x = currentX.current;
            const y = currentY.current;

            // Apply transforms
            // Background moves slightly in opposite direction of face (or same, depending on desired effect)
            // Standard window parallax:
            // Face moves Right (x > 0) -> We can see more of the Left side of the background -> Background moves Right

            if (bgRef.current) {
                bgRef.current.style.transform = `translate3d(${x * 30}px, ${y * 30}px, 0) scale(1.1)`;
            }
            if (midRef.current) {
                midRef.current.style.transform = `translate3d(${x * 60}px, ${y * 60}px, 0)`;
            }
            if (foreRef.current) {
                foreRef.current.style.transform = `translate3d(${x * 120}px, ${y * 120}px, 0)`;
            }
            if (uiRef.current) {
                // UI moves slightly to follow head to give 3D cockpit feel
                uiRef.current.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) perspective(1000px) rotateY(${x * -5}deg) rotateX(${y * 5}deg)`;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, [faceX, faceY]); // Dependencies aren't strictly needed for the loop, but good for restart if needed

    return (
        <div className="parallax-container">
            {/* Background: Deep Space Grid */}
            <div ref={bgRef} className="bg-gradient">
                <div className="bg-grid" />
                {/* Random glowing orbs */}
                <div className="orb-purple" />
                <div className="orb-blue" />
            </div>

            {/* Midground: Floating Geometric Shapes */}
            <div ref={midRef} className="parallax-layer mid-layer">

                {/* Center Ring */}
                <div className="center-ring">
                    <div className="center-ring-inner" />
                </div>

                {/* Floating Triangles */}
                <div className="floating-triangle" />
                <div className="floating-square" />

            </div>

            {/* Foreground: Text and UI Elements that feel closer */}
            <div ref={foreRef} className="parallax-layer fore-layer">
                <h1 className="title-text">
                    PARALLAX
                </h1>
                <p className="subtitle-text">
                    DEEP DEPTH SYSTEM
                </p>
            </div>

            {/* UI Layer: Cockpit HUD elements that react slightly */}
            <div ref={uiRef} className="parallax-layer ui-layer">
                <div className="ui-center-row">
                    <div className="ui-corner ui-tl"></div>
                    <div className="ui-corner ui-tr"></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div className="status-badge">
                        TRACKING ACTIVE
                    </div>
                </div>
                <div className="ui-bottom-row">
                    <div className="ui-corner ui-bl"></div>
                    <div className="ui-corner ui-br"></div>
                </div>
            </div>

        </div>
    );
};

export default ParallaxScene;
