import { motion } from 'framer-motion';

export const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary Orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/20 blur-[100px]"
        style={{ top: '10%', left: '10%' }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary Orb */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-secondary/20 blur-[80px]"
        style={{ top: '60%', right: '10%' }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      {/* Accent Orb */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-primary/15 blur-[60px]"
        style={{ bottom: '20%', left: '40%' }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
};
