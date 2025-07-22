export interface ParticleTrailPoint {
    x: number;
    y: number;
    opacity: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    opacity: number;
    trail: ParticleTrailPoint[];
}

export type ParticlesArray = Particle[];