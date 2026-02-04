import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TokenomicsCardProps {
  icon: LucideIcon;
  title: string;
  percentage: number;
  description: string;
  index: number;
}

export const TokenomicsCard = ({ 
  icon: Icon, 
  title, 
  percentage, 
  description, 
  index 
}: TokenomicsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass-card p-6 group cursor-pointer relative overflow-hidden"
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-3 rounded-xl bg-primary/10 border border-primary/20"
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h3 className="font-display font-semibold text-lg">{title}</h3>
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 'auto' }}
              className="text-2xl font-display font-bold gradient-text"
            >
              {percentage}%
            </motion.span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm">{description}</p>
        
        {/* Progress indicator */}
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
