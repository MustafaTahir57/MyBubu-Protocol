import { motion } from 'framer-motion';

export const PresaleProgress = ({ raised, goal }) => {
  const percentage = (raised / goal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 md:p-8 max-w-2xl mx-auto"
    >
      <div className="flex justify-between mb-4">
        <span className="text-muted-foreground">Raised</span>
        <span className="text-muted-foreground">Goal</span>
      </div>
      
      <div className="flex justify-between mb-4">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-display font-bold text-primary"
        >
          ${raised.toLocaleString()}
        </motion.span>
        <span className="text-2xl md:text-3xl font-display font-bold text-foreground">
          ${goal.toLocaleString()}
        </span>
      </div>

      <div className="relative h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Animated glow on progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            width: '30%',
          }}
          animate={{ x: ['0%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-4 text-lg"
      >
        <span className="text-primary font-bold">{percentage.toFixed(1)}%</span>
        <span className="text-muted-foreground"> of presale complete</span>
      </motion.p>
    </motion.div>
  );
};
