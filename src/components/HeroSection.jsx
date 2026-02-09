import { motion, useScroll, useTransform } from 'framer-motion';
import heroVideo from '@/assets/hero-video.mp4';
import mybubuLogo from '@/assets/mybubu-logo.png';
import { GlowButton } from './GlowButton';
import { CountdownTimer } from './CountdownTimer';
import { ParticleField } from './ParticleField';

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 500], [0, -100]);
  const logoScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const logoRotate = useTransform(scrollY, [0, 500], [0, -5]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="video-overlay" />
      </div>

      {/* Particle Effects */}
      <ParticleField />

      {/* Floating Hearts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20 text-4xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: -100,
              rotate: Math.random() * 360 + 360,
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear"
            }}
          >
            💖
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Animated Logo */}
        <motion.div
          style={{ y: logoY, scale: logoScale, rotate: logoRotate }}
          className="mb-8 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 1 
            }}
            className="relative inline-block"
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 blur-3xl bg-primary/30 rounded-full scale-150"
              animate={{ 
                scale: [1.3, 1.5, 1.3],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main logo with bounce */}
            <motion.img
              src={mybubuLogo}
              alt="MyBubu"
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain relative z-10 drop-shadow-2xl"
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            />

            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-secondary rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4"
        >
          <span className="inline-block px-6 py-3 glass-card text-primary text-sm font-medium tracking-wider uppercase border-primary/30">
            🚀 BSC Network • Dual Token Ecosystem • NFT Nodes 🎯
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6"
        >
          <motion.span 
            className="gradient-text inline-block"
            animate={{ 
              backgroundPosition: ["0% center", "200% center"],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            MYBUBU
          </motion.span>
          <br />
          <motion.span 
            className="text-foreground"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Ecosystem
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          A comprehensive DeFi ecosystem with MYBUBU Token, NFT Nodes, and MYMOMO Token
          working together for sustainable rewards and passive income. 🐾
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <p className="text-muted-foreground mb-4 uppercase tracking-widest text-sm">
            Presale ends in
          </p>
          <CountdownTimer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <GlowButton size="large">🐱 Launch App</GlowButton>
          <GlowButton variant="secondary" size="large">📄 Whitepaper</GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
