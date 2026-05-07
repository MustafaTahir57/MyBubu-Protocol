import { motion } from 'framer-motion';
import { Wallet, CreditCard, ShoppingCart, PartyPopper, Rocket, RefreshCw, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HowToBuyStep } from './HowToBuyStep';
import { PresaleProgress } from './PresaleProgress';
import { useNavigate } from 'react-router-dom';
import { usePresaleInfo } from '@/hooks/dataFetcher/usePresaleInfo';

const stepIcons = [
  { step: 1, icon: Wallet, key: 'connect' },
  { step: 2, icon: CreditCard, key: 'fund' },
  { step: 3, icon: ShoppingCart, key: 'purchase' },
  { step: 4, icon: PartyPopper, key: 'swap' },
];

export const HowToBuySection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { totalRaisedUSD, isLoading } = usePresaleInfo();

  const stats = [
    { label: t('howToBuy.tokenPrice'), value: '$0.05 / MyBoo', icon: '💰' },
    { label: t('howToBuy.standardRate'), value: '10,000 / 500 USDT', icon: '📊' },
    { label: t('howToBuy.swapRatio'), value: '1:1 → MYBUBU', icon: '🔄' },
  ];

  return (
    <section id="how-to-buy" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">{t('howToBuy.kicker')}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('howToBuy.title')} <span className="gradient-text">{t('howToBuy.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{t('howToBuy.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-16">
          <div className="glass-card p-8 relative overflow-hidden" style={{ boxShadow: '0 0 60px hsl(280 80% 65% / 0.1)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Rocket size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">{t('howToBuy.what')}</h3>
                <p className="text-xs text-muted-foreground">{t('howToBuy.preLaunch')}</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              <span className="text-foreground font-semibold">{t('howToBuy.intro1')}</span> {t('howToBuy.intro2')} <span className="text-primary font-medium">{t('howToBuy.intro3')}</span>{t('howToBuy.intro4')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {stats.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="glass-card p-3 text-center">
                  <span className="text-lg mb-1 block">{item.icon}</span>
                  <p className="text-primary font-bold text-sm">{item.value}</p>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 glass-card p-3">
              <RefreshCw size={14} className="text-secondary shrink-0" />
              <span>{t('howToBuy.payInfo')} <span className="text-foreground font-medium">USDT</span> {t('howToBuy.or')} <span className="text-foreground font-medium">BNB</span> {t('howToBuy.limits')}</span>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/app')}
              className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground flex items-center justify-center gap-2"
              style={{ boxShadow: 'var(--shadow-glow)' }}>
              <Rocket size={16} />
              {t('howToBuy.buyBtn')}
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        <div className="mb-16">
          <PresaleProgress raised={totalRaisedUSD} goal={1000000} isLoading={isLoading} />
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {stepIcons.map((step, index) => (
            <HowToBuyStep
              key={step.step}
              step={step.step}
              icon={step.icon}
              title={t(`howToBuy.steps.${step.key}.title`)}
              description={t(`howToBuy.steps.${step.key}.desc`)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
