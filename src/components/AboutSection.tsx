import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Ultra Secure',
    description: 'Military-grade encryption with multi-layer security protocols protecting every transaction.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process thousands of transactions per second with our optimized blockchain architecture.',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Borderless transactions accessible to anyone, anywhere in the world, 24/7.',
  },
  {
    icon: Lock,
    title: 'Decentralized',
    description: 'Fully decentralized governance with community-driven decision making.',
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            About MyBubu
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Why Choose <span className="gradient-text">MyBubu</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Built on cutting-edge technology, MyBubu Protocol offers unparalleled 
            security, speed, and accessibility for the future of decentralized finance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-6 text-center group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30"
              >
                <feature.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="font-display font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
