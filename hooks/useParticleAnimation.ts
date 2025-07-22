import { useRef, useState, useEffect } from 'react';
import { ParticlesArray } from '@/types/particle';

export const useParticleAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [particles, setParticles] = useState<ParticlesArray>([]);

    useEffect(() => {
        const newParticles: ParticlesArray = Array.from({ length: 40 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: Math.random() * 4 + 2,
            color: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
            opacity: Math.random() * 0.6 + 0.2,
            trail: [],
        }));
        setParticles(newParticles);
    }, []);

    return { canvasRef, particles };
};