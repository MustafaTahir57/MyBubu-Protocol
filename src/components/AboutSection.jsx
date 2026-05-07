import { motion } from 'framer-motion';
import { Shield, Zap, Users, Sparkles, Heart, Cat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import mybubuLogo from '@/assets/mybubu-logo.png';

const featureKeys = [
  { icon: Cat, key: 'cute' },
  { icon: Shield, key: 'secure' },
  { icon: Zap, key: 'fast' },
  { icon: Users, key: 'community' },
  { icon: Heart, key: 'charity' },
  { icon: Sparkles, key: 'magic' },
];

export const AboutSection = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/10 text-6xl"
            style={{ left: `${10 + (i * 12)}%`, top: `${20 + Math.random() * 60}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
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
          <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mb-6">
            <img src={mybubuLogo} alt="MyBubu" className="w-24 h-24 mx-auto" />
          </motion.div>
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">{t('about.kicker')}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('about.title')} <span className="gradient-text">{t('about.titleHighlight')}</span>{t('about.titleSuffix')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t('about.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px -20px hsl(340 80% 65% / 0.3)" }}
              className="glass-card p-8 rounded-2xl group cursor-pointer relative overflow-hidden"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 relative z-10"
              >
                <feature.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="text-xl font-display font-bold mb-3 relative z-10">{t(`about.features.${feature.key}.title`)}</h3>
              <p className="text-muted-foreground relative z-10">{t(`about.features.${feature.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
