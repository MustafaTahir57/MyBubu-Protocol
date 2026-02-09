import { motion } from 'framer-motion';
import { Wallet, CreditCard, ShoppingCart, PartyPopper } from 'lucide-react';
import { HowToBuyStep } from './HowToBuyStep';
import { PresaleProgress } from './PresaleProgress';

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
    title: 'Add ETH or USDT',
    description: 'Ensure you have ETH for gas fees and either ETH or USDT for the token purchase.',
  },
  {
    step: 3,
    icon: ShoppingCart,
    title: 'Purchase MyBubu',
    description: 'Enter the amount of tokens you want to buy and confirm the transaction in your wallet.',
  },
  {
    step: 4,
    icon: PartyPopper,
    title: 'Claim Your Tokens',
    description: 'After presale ends, return to claim your tokens directly to your connected wallet.',
  },
];

export const HowToBuySection = () => {
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
            Join the presale in just a few simple steps and secure your MyBubu tokens 
            at the lowest possible price.
          </p>
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
