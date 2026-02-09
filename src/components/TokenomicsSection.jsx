import { motion } from 'framer-motion';
import { Coins, Users, Flame, Lock, Wallet, Zap } from 'lucide-react';
import { TokenomicsCard } from './TokenomicsCard';
import { FloatingOrbs } from './FloatingOrbs';

const tokenomicsData = [
  {
    icon: Coins,
    title: 'LP Deposits',
    percentage: 70,
    description: 'Split into 35% Labubu + 35% BNB for PancakeSwap liquidity pairing.',
  },
  {
    icon: Users,
    title: 'Referral & Network',
    percentage: 20,
    description: 'Smart contract managed rewards for multi-level referral system.',
  },
  {
    icon: Wallet,
    title: 'Global Pool',
    percentage: 10,
    description: 'Distributed to users who activate the "Node Dividend" feature.',
  },
  {
    icon: Zap,
    title: 'Passive Income',
    percentage: 1,
    description: 'Daily distribution of 1% from total accumulated LP to holders.',
  },
  {
    icon: Lock,
    title: 'LP Lock',
    percentage: 1,
    description: '1% of each transaction goes into LP for price stability.',
  },
  {
    icon: Flame,
    title: 'Burn Mechanism',
    percentage: 1,
    description: '1% of each transaction burned to Dead Wallet for deflation.',
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
            A carefully designed dual-token ecosystem with MYBUBU and MYMOMO 
            working together for sustainable growth and rewards.
          </p>
        </motion.div>

        {/* Token Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Max Supply', value: '21M' },
              { label: 'Transfer Tax', value: '2%' },
              { label: 'Team Reserve', value: '5%' },
              { label: 'Network', value: 'BSC' },
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

        {/* Wallet Limit Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-4 mb-8 max-w-xl mx-auto text-center border-primary/30"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Max Wallet Limit:</span> 20,000 MYBUBU per wallet
          </p>
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
