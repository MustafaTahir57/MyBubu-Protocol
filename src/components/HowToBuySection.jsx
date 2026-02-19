import { motion } from 'framer-motion';
import { Wallet, CreditCard, ShoppingCart, PartyPopper, Rocket, RefreshCw, ArrowRight } from 'lucide-react';
import { HowToBuyStep } from './HowToBuyStep';
import { PresaleProgress } from './PresaleProgress';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    step: 1,
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Connect your MetaMask, Trust Wallet, or any WalletConnect compatible wallet to get started.',
  },
  {
    step: 2,
    icon: CreditCard,
    title: 'Fund with USDT or BNB',
    description: 'Ensure you have BNB for gas fees and either USDT or BNB to purchase MyBoo tokens.',
  },
  {
    step: 3,
    icon: ShoppingCart,
    title: 'Purchase MyBoo Tokens',
    description: 'Buy MyBoo tokens at the pre-launch price of $0.05 per token. Minimum 100 USDT or 0.1 BNB.',
  },
  {
    step: 4,
    icon: PartyPopper,
    title: 'Swap for MYBUBU at Launch',
    description: 'Once the MYBUBU ecosystem goes live, swap your MyBoo tokens 1:1 for official MYBUBU tokens.',
  },
];

export const HowToBuySection = () => {
  const navigate = useNavigate();

  return (
    <section id="how-to-buy" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium uppercase tracking-widest text-sm mb-4 block">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            How to <span className="gradient-text">Buy</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get in early with MyBoo tokens — the pre-launch gateway to the MYBUBU ecosystem.
          </p>
        </motion.div>

        {/* MyBoo Token Explainer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="glass-card p-8 relative overflow-hidden" style={{ boxShadow: '0 0 60px hsl(280 80% 65% / 0.1)' }}>
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/40"
                  style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 40}%` }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Rocket size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">What is MyBoo Token?</h3>
                <p className="text-xs text-muted-foreground">Pre-Launch Access Token</p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              <span className="text-foreground font-semibold">MyBoo</span> is the early-access token designed for supporters who want to invest in the MYBUBU project before the official launch. 
              Purchase MyBoo now at a fixed rate and <span className="text-primary font-medium">swap them 1:1 for MYBUBU tokens</span> once the ecosystem goes live.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Token Price', value: '$0.05 / MyBoo', icon: '💰' },
                { label: 'Standard Rate', value: '10,000 for 500 USDT', icon: '📊' },
                { label: 'Swap Ratio', value: '1:1 to MYBUBU', icon: '🔄' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card p-3 text-center"
                >
                  <span className="text-lg mb-1 block">{item.icon}</span>
                  <p className="text-primary font-bold text-sm">{item.value}</p>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 glass-card p-3">
              <RefreshCw size={14} className="text-secondary shrink-0" />
              <span>Pay with <span className="text-foreground font-medium">USDT</span> or <span className="text-foreground font-medium">BNB</span> · Min 100 USDT / 0.1 BNB · Max 10,000 USDT / 2 BNB</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/app')}
              className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground flex items-center justify-center gap-2"
              style={{ boxShadow: 'var(--shadow-glow)' }}
            >
              <Rocket size={16} />
              Buy MyBoo Tokens Now
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-16">
          <PresaleProgress raised={2450000} goal={5000000} />
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <HowToBuyStep key={step.step} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
