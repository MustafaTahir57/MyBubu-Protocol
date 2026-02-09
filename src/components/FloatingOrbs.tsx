import { motion } from 'framer-motion';

const orbs = [
  { size: 400, x: '10%', y: '20%', color: 'primary', delay: 0 },
  { size: 300, x: '80%', y: '60%', color: 'secondary', delay: 2 },
  { size: 350, x: '50%', y: '80%', color: 'primary', delay: 4 },
  { size: 250, x: '20%', y: '70%', color: 'secondary', delay: 1 },
  { size: 200, x: '70%', y: '10%', color: 'primary', delay: 3 },
];

export const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="floating-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color === 'primary' 
              ? 'hsl(340 80% 65% / 0.15)' 
              : 'hsl(30 80% 60% / 0.15)',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            delay: orb.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
