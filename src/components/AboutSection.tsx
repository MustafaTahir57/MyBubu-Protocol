import { motion } from 'framer-motion';
import { Shield, Zap, Users, Sparkles, Heart, Cat } from 'lucide-react';
import mybubuLogo from '@/assets/mybubu-logo.png';

const features = [
  {
    icon: Cat,
    title: 'Cute & Cuddly',
    description: 'The most adorable meme coin mascot in all of crypto. Who can resist MyBubu?',
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Audited smart contracts and locked liquidity to keep your investment purr-tected.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Ultra-fast transactions that zoom across the blockchain like a playful kitten.',
  },
  {
    icon: Users,
    title: 'Paw-some Community',
    description: 'Join thousands of Bubu lovers in the friendliest crypto community around.',
  },
  {
    icon: Heart,
    title: 'Charity Focused',
    description: 'A portion of every transaction goes to animal shelters worldwide. 🐾',
  },
  {
    icon: Sparkles,
    title: 'Meme Magic',
    description: 'Powered by the strongest meme energy in the crypto universe.',
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      {/* Floating paw prints */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10 text-6xl"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            🐾
          </motion.div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <img src={mybubuLogo} alt="MyBubu" className="w-24 h-24 mx-auto" />
          </motion.div>
          
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            About MyBubu
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Why Choose <span className="gradient-text">MyBubu</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            MyBubu isn't just a meme coin – it's a movement! Join the cuddliest 
            community in crypto and watch your investment grow with purr-fection. 🐱💖
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 20px 40px -20px hsl(340 80% 65% / 0.3)"
              }}
              className="glass-card p-8 rounded-2xl group cursor-pointer relative overflow-hidden"
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 relative z-10"
              >
                <feature.icon className="w-8 h-8 text-primary" />
              </motion.div>
              
              <h3 className="text-xl font-display font-bold mb-3 relative z-10">
                {feature.title}
              </h3>
              <p className="text-muted-foreground relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
