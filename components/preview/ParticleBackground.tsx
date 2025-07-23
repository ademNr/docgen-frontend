import React, { useEffect } from 'react';
import { ParticlesArray } from '@/types/particle';

interface ParticleBackgroundProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    particles: ParticlesArray;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
    canvasRef,
    particles
}) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Initial resize
        handleResize();

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle: { x: number; vx: number; y: number; vy: number; trail: { x: number; y: number; opacity: number; }[]; opacity: number; size: number; color: string; }) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // Add current position to trail
                particle.trail.push({
                    x: particle.x,
                    y: particle.y,
                    opacity: particle.opacity
                });

                // Limit trail length
                if (particle.trail.length > 15) {
                    particle.trail.shift();
                }

                // Draw trail
                particle.trail.forEach((point: { opacity: number; x: number; y: number; }, index: number) => {
                    const trailOpacity = (index / particle.trail.length) * point.opacity * 0.3;
                    const trailSize = particle.size * (index / particle.trail.length) * 0.5;

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = `${particle.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`;
                    ctx.fill();
                });

                // Draw main particle with glow
                const gradient = ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw particle core
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, particles]);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

export default ParticleBackground;