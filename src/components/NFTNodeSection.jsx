import { motion } from 'framer-motion';
import { Crown, Star, Award, Gem, Trophy, Sparkles } from 'lucide-react';
import { FloatingOrbs } from './FloatingOrbs';

const nftTiers = [
  { tier: 1, minNFTs: 1, multiplier: '1x', name: 'Basic', icon: Star, color: 'text-gray-400' },
  { tier: 2, minNFTs: 2, multiplier: '2x', name: 'Bronze', icon: Award, color: 'text-amber-600' },
  { tier: 3, minNFTs: 3, multiplier: '3x', name: 'Silver', icon: Gem, color: 'text-gray-300' },
  { tier: 4, minNFTs: 5, multiplier: '5x', name: 'Gold', icon: Trophy, color: 'text-yellow-400' },
  { tier: 5, minNFTs: 10, multiplier: '10x', name: 'Platinum', icon: Sparkles, color: 'text-cyan-400' },
  { tier: 6, minNFTs: 18, multiplier: '18x', name: 'VIP', icon: Crown, color: 'text-primary' },
];

export const NFTNodeSection = () => {
  return (
    <section id="nft-nodes" className="relative py-24 overflow-hidden">
      <FloatingOrbs />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            NFT Rewards
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">NFT Node</span> Revenue
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every day, 10% of new BNB is distributed equally among NFT Node holders.
            Higher tiers unlock greater reward multipliers!
          </p>
        </motion.div>

        {/* NFT Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 mb-12 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { label: 'Mint Price', value: '0.55 BNB' },
              { label: 'Max Supply', value: '1,000' },
              { label: 'Daily Revenue', value: '10%' },
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

        {/* Tier Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {nftTiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                boxShadow: '0 20px 40px -20px hsl(340 80% 65% / 0.4)'
              }}
              className="glass-card p-6 text-center relative overflow-hidden group cursor-pointer"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              
              {/* Tier badge */}
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-bl-xl flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">{tier.tier}</span>
              </div>

              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-muted/50 flex items-center justify-center ${tier.color}`}
              >
                <tier.icon className="w-6 h-6" />
              </motion.div>

              <h3 className="font-display font-bold text-sm mb-1">{tier.name}</h3>
              
              <motion.p
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-display font-bold gradient-text"
              >
                {tier.multiplier}
              </motion.p>
              
              <p className="text-xs text-muted-foreground mt-2">
                Min: {tier.minNFTs} NFT{tier.minNFTs > 1 ? 's' : ''}
              </p>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>

        {/* Activation Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-xl font-display font-bold text-center mb-6">
            🎯 Activation Requirements
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-muted/30 border border-border"
            >
              <h4 className="font-semibold text-primary mb-2">Partner Activation</h4>
              <p className="text-sm text-muted-foreground">
                Send 2 Labubu to new member, member sends 1 back to upline to activate.
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-muted/30 border border-border"
            >
              <h4 className="font-semibold text-primary mb-2">Dual Token Reward</h4>
              <p className="text-sm text-muted-foreground">
                Deposit 100 Labubu + BNB to activate Zimo mining for dual rewards.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
