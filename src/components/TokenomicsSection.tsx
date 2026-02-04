import { motion } from 'framer-motion';
import { Coins, Users, Flame, Lock, Rocket, Gift } from 'lucide-react';
import { TokenomicsCard } from './TokenomicsCard';
import { FloatingOrbs } from './FloatingOrbs';

const tokenomicsData = [
  {
    icon: Coins,
    title: 'Presale',
    percentage: 40,
    description: 'Available during presale phases at discounted rates for early supporters.',
  },
  {
    icon: Users,
    title: 'Liquidity Pool',
    percentage: 25,
    description: 'Locked liquidity to ensure stable trading and prevent rug pulls.',
  },
  {
    icon: Rocket,
    title: 'Development',
    percentage: 15,
    description: 'Funding ongoing development, upgrades, and ecosystem growth.',
  },
  {
    icon: Gift,
    title: 'Marketing',
    percentage: 10,
    description: 'Strategic partnerships, campaigns, and community building.',
  },
  {
    icon: Lock,
    title: 'Team',
    percentage: 5,
    description: 'Vested over 24 months with cliff periods for alignment.',
  },
  {
    icon: Flame,
    title: 'Burn Reserve',
    percentage: 5,
    description: 'Periodic burns to increase scarcity and value over time.',
  },
];

export const TokenomicsSection = () => {
  return (
    <section id="tokenomics" className="relative py-24 overflow-hidden">
      <FloatingOrbs />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            Token Distribution
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Tokenomics</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Carefully designed token distribution ensuring long-term sustainability 
            and growth for all stakeholders.
          </p>
        </motion.div>

        {/* Token Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Total Supply', value: '1B' },
              { label: 'Presale Price', value: '$0.025' },
              { label: 'Launch Price', value: '$0.05' },
              { label: 'Network', value: 'ETH' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-2xl md:text-3xl font-display font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokenomicsData.map((item, index) => (
            <TokenomicsCard key={item.title} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
