import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Coins, Flame, Shield } from 'lucide-react';

const mechanismSteps = [
  {
    icon: Droplets,
    title: '70% LP Deposits',
    description: 'Automatically split into 35% Labubu + 35% BNB for PancakeSwap liquidity.',
    color: 'from-primary to-secondary',
  },
  {
    icon: Coins,
    title: '20% Referral Rewards',
    description: 'Smart contract manages network rewards across 10 referral levels.',
    color: 'from-secondary to-primary',
  },
  {
    icon: Shield,
    title: '10% Global Pool',
    description: 'Distributed equally to users who activate Node Dividend.',
    color: 'from-primary to-secondary',
  },
];

const defenseFeatures = [
  {
    icon: Droplets,
    title: '1% to LP',
    description: 'Every transaction adds liquidity',
  },
  {
    icon: Flame,
    title: '1% Burn',
    description: 'Dead Wallet burn mechanism',
  },
];

export const MechanismSection = () => {
  return (
    <section id="mechanism" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            The <span className="gradient-text">Mechanism</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our automatic LP mechanism on PancakeSwap ensures sustainable liquidity 
            and rewards for all participants.
          </p>
        </motion.div>

        {/* Main Flow */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {mechanismSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass-card p-8 h-full relative overflow-hidden group"
              >
                {/* Animated gradient background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 relative z-10"
                >
                  <step.icon className="w-8 h-8 text-primary" />
                </motion.div>
                
                <h3 className="text-xl font-display font-bold mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-muted-foreground relative z-10">
                  {step.description}
                </p>

                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{index + 1}</span>
                </div>
              </motion.div>

              {/* Arrow connector */}
              {index < mechanismSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20"
                >
                  <ArrowRight className="w-6 h-6 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Defense Mechanism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold mb-2">
              🛡️ Defense Against <span className="gradient-text">Deflation/Inflation</span>
            </h3>
            <p className="text-muted-foreground">
              Built-in mechanisms to maintain token value stability
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {defenseFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-xl bg-muted/30 border border-border"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 20px hsl(340 80% 65% / 0.2)',
                      '0 0 40px hsl(340 80% 65% / 0.4)',
                      '0 0 20px hsl(340 80% 65% / 0.2)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h4 className="font-display font-bold text-lg">{feature.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Passive Income Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💰
            </motion.span>
            <span className="text-sm">
              <span className="text-primary font-semibold">Passive Income:</span> 1% of total accumulated LP distributed daily
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
