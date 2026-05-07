import { motion } from 'framer-motion';
import { Crown, Star, Award, Gem, Trophy, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FloatingOrbs } from './FloatingOrbs';

const nftTiers = [
  { tier: 1, nodes: 1, tokens: '10K', nameKey: 'Starter', icon: Star, color: 'text-gray-400' },
  { tier: 2, nodes: 2, tokens: '20K', nameKey: 'Bronze', icon: Award, color: 'text-amber-600' },
  { tier: 3, nodes: 3, tokens: '30K', nameKey: 'Silver', icon: Gem, color: 'text-gray-300' },
  { tier: 4, nodes: 5, tokens: '50K', nameKey: 'Gold', icon: Trophy, color: 'text-yellow-400' },
  { tier: 5, nodes: 10, tokens: '100K', nameKey: 'Platinum', icon: Sparkles, color: 'text-cyan-400' },
  { tier: 6, nodes: 20, tokens: '200K', nameKey: 'VIP', icon: Crown, color: 'text-primary' },
];

export const NFTNodeSection = () => {
  const { t } = useTranslation();
  const stats = [
    { label: t('nft.stats.price'), value: '500 USDT' },
    { label: t('nft.stats.total'), value: t('nft.stats.totalValue') },
    { label: t('nft.stats.monthly'), value: '10%' },
  ];
  return (
    <section id="nft-nodes" className="relative py-24 overflow-hidden">
      <FloatingOrbs />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">{t('nft.kicker')}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="gradient-text">{t('nft.title')}</span> {t('nft.titleSuffix')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t('nft.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 mb-12 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {nftTiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10, boxShadow: '0 20px 40px -20px hsl(340 80% 65% / 0.4)' }}
              className="glass-card p-6 text-center relative overflow-hidden group cursor-pointer"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-bl-xl flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">{tier.tier}</span>
              </div>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }} className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-muted/50 flex items-center justify-center ${tier.color}`}>
                <tier.icon className="w-6 h-6" />
              </motion.div>
              <h3 className="font-display font-bold text-sm mb-1">{t(`nft.tiers.${tier.nameKey}`)}</h3>
              <motion.p initial={{ scale: 1 }} whileHover={{ scale: 1.1 }} className="text-2xl font-display font-bold gradient-text">{tier.tokens}</motion.p>
              <p className="text-xs text-muted-foreground">MYBUBU</p>
              <p className="text-xs text-muted-foreground mt-2">
                {tier.nodes} {tier.nodes > 1 ? t('nft.nodes') : t('nft.node')} • {tier.nodes * 500} USDT
              </p>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 glass-card p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-display font-bold text-center mb-6">{t('nft.howTitle')}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {['buy', 'release', 'example'].map((k) => (
              <motion.div key={k} whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                <h4 className="font-semibold text-primary mb-2">{t(`nft.${k}.title`)}</h4>
                <p className="text-sm text-muted-foreground">{t(`nft.${k}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
