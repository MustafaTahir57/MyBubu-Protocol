import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Coins, Flame, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const stepKeys = [
  { icon: Droplets, key: 'lp', color: 'from-primary to-secondary' },
  { icon: Coins, key: 'ref', color: 'from-secondary to-primary' },
  { icon: Shield, key: 'pool', color: 'from-primary to-secondary' },
];

const defenseKeys = [
  { icon: Droplets, key: 'lp' },
  { icon: Flame, key: 'burn' },
];

export const MechanismSection = () => {
  const { t } = useTranslation();
  return (
    <section id="mechanism" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">{t('mechanism.kicker')}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('mechanism.title')} <span className="gradient-text">{t('mechanism.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t('mechanism.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stepKeys.map((step, index) => (
            <motion.div key={step.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} className="relative">
              <motion.div whileHover={{ scale: 1.03, y: -5 }} className="glass-card p-8 h-full relative overflow-hidden group">
                <motion.div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.5 }} className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="text-xl font-display font-bold mb-3 relative z-10">{t(`mechanism.steps.${step.key}.title`)}</h3>
                <p className="text-muted-foreground relative z-10">{t(`mechanism.steps.${step.key}.desc`)}</p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{index + 1}</span>
                </div>
              </motion.div>
              {index < stepKeys.length - 1 && (
                <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 + 0.3 }} className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-bold mb-2">
              {t('mechanism.defenseTitle')} <span className="gradient-text">{t('mechanism.defenseHighlight')}</span>
            </h3>
            <p className="text-muted-foreground">{t('mechanism.defenseSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {defenseKeys.map((feature, index) => (
              <motion.div key={feature.key} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="text-center p-6 rounded-xl bg-muted/30 border border-border">
                <motion.div animate={{ boxShadow: ['0 0 20px hsl(340 80% 65% / 0.2)', '0 0 40px hsl(340 80% 65% / 0.4)', '0 0 20px hsl(340 80% 65% / 0.2)'] }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h4 className="font-display font-bold text-lg">{t(`mechanism.defense.${feature.key}.title`)}</h4>
                <p className="text-sm text-muted-foreground mt-1">{t(`mechanism.defense.${feature.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>💰</motion.span>
            <span className="text-sm">
              <span className="text-primary font-semibold">{t('mechanism.passive')}</span> {t('mechanism.passiveDesc')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
