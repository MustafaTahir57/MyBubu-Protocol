import { motion } from 'framer-motion';
import { Users, Gift, TrendingUp, Layers } from 'lucide-react';

const referralLevels = [
  { level: 1, invite: 1, reward: '5%', highlight: true },
  { level: 2, invite: 3, reward: '4%', highlight: true },
  { level: 3, invite: 5, reward: '3%', highlight: true },
  { level: 4, invite: 7, reward: '2%', highlight: false },
  { level: '5-10', invite: 10, reward: '1%', highlight: false },
];

export const ReferralSection = () => {
  return (
    <section id="referral" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      {/* Animated network lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1={10 + i * 20}
              y1="0"
              x2={50}
              y2="100"
              stroke="hsl(340 80% 65%)"
              strokeWidth="0.1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          ))}
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            Promotion Incentive
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">Referral</span> Network
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Earn rewards across 10 levels by building your network. 
            The more you invite, the higher your tier rewards!
          </p>
        </motion.div>

        {/* Referral Pyramid */}
        <div className="max-w-4xl mx-auto">
          {/* Level Cards */}
          <div className="space-y-4">
            {referralLevels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className={`glass-card p-6 relative overflow-hidden ${
                  level.highlight ? 'border-primary/50' : ''
                }`}
              >
                {/* Highlight glow */}
                {level.highlight && (
                  <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"
                  />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    {/* Level Badge */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        level.highlight 
                          ? 'bg-primary/20 border border-primary/40' 
                          : 'bg-muted/50 border border-border'
                      }`}
                    >
                      <span className="font-display font-bold text-lg">L{level.level}</span>
                    </motion.div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Invite <span className="text-foreground font-semibold">{level.invite} {level.invite === 1 ? 'person' : 'people'}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {typeof level.level === 'number' ? `Level ${level.level}` : `Levels ${level.level}`}
                      </p>
                    </div>
                  </div>

                  {/* Reward */}
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="text-right"
                  >
                    <p className="text-3xl font-display font-bold gradient-text">
                      {level.reward}
                    </p>
                    <p className="text-xs text-muted-foreground">reward</p>
                  </motion.div>
                </div>

                {/* Progress bar representing tier unlock */}
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${100 - index * 15}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Users, title: '10 Levels Deep', desc: 'Earn from your entire network' },
            { icon: Gift, title: 'Instant Rewards', desc: 'Smart contract auto-distribution' },
            { icon: TrendingUp, title: 'Passive Income', desc: 'Grow while you sleep' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4"
              >
                <feature.icon className="w-6 h-6 text-primary" />
              </motion.div>
              <h3 className="font-display font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
