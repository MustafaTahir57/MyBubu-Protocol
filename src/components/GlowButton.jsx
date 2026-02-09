import { motion } from 'framer-motion';
import { ReactNode } from 'react';


export const GlowButton = ({ 
  children, 
  variant = 'primary',
  size = 'default',
  onClick 
}) => {
  const sizeClasses = size === 'large' 
    ? 'px-8 py-4 text-lg' 
    : 'px-6 py-3 text-base';

  const variantClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
    : 'bg-transparent border-2 border-primary text-primary';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative font-display font-semibold rounded-xl 
        ${sizeClasses} ${variantClasses}
        overflow-hidden group
      `}
    >
      {/* Animated glow background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
