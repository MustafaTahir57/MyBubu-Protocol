import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'circle' | 'heart' | 'star' | 'paw';
}

export const ParticleField = () => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      type: ['circle', 'heart', 'star', 'paw'][Math.floor(Math.random() * 4)] as Particle['type'],
    }));
  }, []);

  const renderParticle = (particle: Particle) => {
    if (particle.type === 'heart') {
      return <span className="text-primary/30">💖</span>;
    }
    if (particle.type === 'star') {
      return <span className="text-secondary/30">✨</span>;
    }
    if (particle.type === 'paw') {
      return <span className="text-primary/20">🐾</span>;
    }
    return (
      <div
        className="rounded-full bg-primary/30"
        style={{
          width: particle.size,
          height: particle.size,
        }}
      />
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: particle.size * 3,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        >
          {renderParticle(particle)}
        </motion.div>
      ))}
    </div>
  );
};
