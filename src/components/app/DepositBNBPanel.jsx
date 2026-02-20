import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, ArrowDown, TrendingUp, Info, Zap } from 'lucide-react';
import { formatUnits } from 'viem';
import { useGetTokensForBNB } from '@/hooks/useGetTokensForBNB';
import { useBuyWithBNB } from '@/hooks/useBuyWithBNB';

const presets = [0.1, 0.2, 0.5, 1.0, 1.5, 2.0];

export const DepositBNBPanel = ({ walletConnected }) => {
  const [amount, setAmount] = useState('');
  const numAmount = parseFloat(amount) || 0;

  // Read: how many tokens for this BNB amount
  const { tokensOut, isLoading: isLoadingQuote } = useGetTokensForBNB(
    numAmount > 0 ? amount : undefined
  );

  // Buy hook
  const {
    buyWithBNB,
    isPending,
    isConfirming,
    isConfirmed,
    reset,
  } = useBuyWithBNB();

  useEffect(() => {
    if (isConfirmed) {
      setAmount('');
      reset();
    }
  }, [isConfirmed]);

  const tokensDisplay = tokensOut
    ? parseFloat(formatUnits(tokensOut, 18)).toLocaleString()
    : '0.00';

  const isProcessing = isPending || isConfirming;
  const isValid = numAmount > 0;
  const canBuy = walletConnected && isValid && !isProcessing;

  const handleDeposit = () => {
    buyWithBNB(amount);
  };

  const getButtonText = () => {
    if (!walletConnected) return 'Connect Wallet First';
    if (isPending) return (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Wallet Opening...
      </span>
    );
    if (isConfirming) return (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Purchasing...
      </span>
    );
    return (
      <span className="flex items-center justify-center gap-2">
        <Zap size={18} /> Buy with {amount || '0'} BNB
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: '0 0 60px hsl(30 80% 60% / 0.1)' }}
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Coins size={48} className="mx-auto text-secondary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">
          Buy with BNB
        </h2>
        <p className="text-muted-foreground text-sm">
          Purchase MYBUBU tokens with BNB
        </p>
      </motion.div>

      {/* Amount Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">You Pay</span>
        </div>

        <div className="relative">
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            className="w-full bg-background/50 border border-border rounded-xl px-4 py-4 text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-bold text-sm">
            BNB
          </span>
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presets.map((preset) => (
            <motion.button
              key={preset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAmount(preset.toString())}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                parseFloat(amount) === preset
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {preset} BNB
            </motion.button>
          ))}
        </div>

        {/* You Receive */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Receive</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">
              {isLoadingQuote ? '...' : tokensDisplay}
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐱</span>
              <span className="font-bold text-sm text-foreground">MYBUBU</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Buy Button */}
      <motion.button
        whileHover={canBuy ? { scale: 1.02 } : {}}
        whileTap={canBuy ? { scale: 0.98 } : {}}
        onClick={handleDeposit}
        disabled={!canBuy}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-secondary to-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
        style={canBuy ? { boxShadow: '0 0 30px hsl(30 80% 60% / 0.3)' } : {}}
      >
        {getButtonText()}
      </motion.button>
    </div>
  );
};

const Spinner = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
  />
);
