import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export const HowToBuyStep = ({ 
  step, 
  icon: Icon, 
  title, 
  description, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative flex gap-6 items-start"
    >
      {/* Step number with glow */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative"
      >
        <span className="text-2xl font-display font-bold text-primary-foreground">
          {step}
        </span>
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary blur-xl opacity-50"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Content */}
      <div className="flex-1 glass-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Connector line */}
      {index < 3 && (
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: '100%' }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent"
        />
      )}
    </motion.div>
  );
};
