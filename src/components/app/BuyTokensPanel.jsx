import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowDownUp, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useGetTokensForUSDT } from '@/hooks/useGetTokensForUSDT';
import { useUSDTApproval } from '@/hooks/useUSDTApproval';
import { useBuyWithUSDT } from '@/hooks/useBuyWithUSDT';

export const BuyTokensPanel = ({ walletConnected }) => {
  const [usdtAmount, setUsdtAmount] = useState('');
  const { address } = useAccount();
  const numAmount = parseFloat(usdtAmount) || 0;

  // Read: how many tokens for this USDT amount
  const { tokensOut, isLoading: isLoadingQuote } = useGetTokensForUSDT(
    numAmount >= 100 ? usdtAmount : undefined
  );

  // Approval hook
  const {
    hasEnoughBalance,
    needsApproval,
    approveUSDT,
    isApproving,
    approvalConfirmed,
    refetch: refetchApproval,
  } = useUSDTApproval(address, numAmount >= 100 ? usdtAmount : undefined);

  // Buy hook
  const {
    buyWithUSDT,
    isPending: isBuyPending,
    isConfirming: isBuyConfirming,
    isConfirmed: isBuyConfirmed,
    reset: resetBuy,
  } = useBuyWithUSDT();

  // After approval confirmed, refetch allowance
  useEffect(() => {
    if (approvalConfirmed) {
      refetchApproval();
    }
  }, [approvalConfirmed]);

  // After buy confirmed, reset
  useEffect(() => {
    if (isBuyConfirmed) {
      setUsdtAmount('');
      resetBuy();
      refetchApproval();
    }
  }, [isBuyConfirmed]);

  const tokensDisplay = tokensOut
    ? parseFloat(formatUnits(tokensOut, 18)).toLocaleString()
    : '0.00';

  const isProcessing = isApproving || isBuyPending || isBuyConfirming;
  const canBuy = walletConnected && numAmount >= 100 && hasEnoughBalance && !isProcessing;

  const handleBuy = () => {
    if (needsApproval) {
      approveUSDT();
    } else {
      buyWithUSDT(usdtAmount);
    }
  };

  const getButtonText = () => {
    if (!walletConnected) return 'Connect Wallet First';
    if (numAmount > 0 && numAmount < 100) return 'Minimum 100 USDT';
    if (numAmount >= 100 && !hasEnoughBalance) return 'Insufficient USDT Balance';
    if (isApproving) return (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Approving USDT...
      </span>
    );
    if (isBuyPending) return (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Wallet Opening...
      </span>
    );
    if (isBuyConfirming) return (
      <span className="flex items-center justify-center gap-2">
        <Spinner /> Purchasing...
      </span>
    );
    if (needsApproval) return (
      <span className="flex items-center justify-center gap-2">
        <Wallet size={18} /> Approve USDT
      </span>
    );
    return (
      <span className="flex items-center justify-center gap-2">
        <Wallet size={18} /> Buy MYBUBU
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
        style={{ boxShadow: '0 0 60px hsl(340 80% 65% / 0.1)' }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShoppingCart size={48} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">
          Buy MYBUBU Tokens
        </h2>
        <p className="text-muted-foreground text-sm">
          Purchase MYBUBU tokens with USDT on BSC (Min: 100 USDT)
        </p>
      </motion.div>

      {/* Swap Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        {/* USDT Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Pay</span>
          </div>
          <div className="relative bg-background/50 border border-border rounded-xl p-4">
            <input
              type="number"
              placeholder="0.00"
              value={usdtAmount}
              onChange={(e) => setUsdtAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">$</span>
              <span className="font-bold text-sm text-foreground">USDT</span>
            </div>
          </div>
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2">
            {[100, 250, 500, 1000].map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUsdtAmount(v.toString())}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                ${v}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Swap arrow */}
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center border-primary/30"
          >
            <ArrowDownUp size={18} className="text-primary" />
          </motion.div>
        </div>

        {/* MYBUBU Output */}
        <div>
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

        {/* Rate info */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Min Purchase</span>
            <span className="text-foreground">100 USDT</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tax (Buy)</span>
            <span className="text-secondary">2% (1% LP + 1% Burn)</span>
          </div>
        </div>
      </motion.div>

      {/* Buy Button */}
      <motion.button
        whileHover={canBuy ? { scale: 1.02 } : {}}
        whileTap={canBuy ? { scale: 0.98 } : {}}
        onClick={handleBuy}
        disabled={!canBuy}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={canBuy ? { boxShadow: 'var(--shadow-glow)' } : {}}
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
