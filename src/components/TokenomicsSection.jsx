import { motion } from 'framer-motion';
import { Coins, Users, Flame, Lock, Wallet, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TokenomicsCard } from './TokenomicsCard';
import { FloatingOrbs } from './FloatingOrbs';

const items = [
  { icon: Coins, key: 'lp', percentage: 70 },
  { icon: Users, key: 'ref', percentage: 20 },
  { icon: Wallet, key: 'pool', percentage: 10 },
  { icon: Zap, key: 'passive', percentage: 1 },
  { icon: Lock, key: 'lock', percentage: 1 },
  { icon: Flame, key: 'burn', percentage: 1 },
];

export const TokenomicsSection = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t('tokenomics.stats.maxSupply'), value: '210M' },
    { label: t('tokenomics.stats.transferTax'), value: '2%' },
    { label: t('tokenomics.stats.teamReserve'), value: '5%' },
    { label: t('tokenomics.stats.network'), value: 'BSC' },
  ];
  return (
    <section id="tokenomics" className="relative py-24 overflow-hidden">
      <FloatingOrbs />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">{t('tokenomics.kicker')}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">{t('tokenomics.title')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t('tokenomics.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 mb-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <TokenomicsCard
              key={item.key}
              icon={item.icon}
              title={t(`tokenomics.items.${item.key}.title`)}
              description={t(`tokenomics.items.${item.key}.desc`)}
              percentage={item.percentage}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
