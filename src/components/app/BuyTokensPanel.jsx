import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownUp, Repeat, Info } from 'lucide-react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useUserInfo } from '@/hooks/dataFetcher/useUserInfo';
import { useMyBooApproval } from '@/hooks/dataSender/useMyBooApproval';
import { useSwapMyBoo } from '@/hooks/dataSender/useSwapMyBoo';
import { toast } from 'react-toastify';

export const BuyTokensPanel = ({ walletConnected }) => {
  const { address } = useAccount();
  const [mybooAmount, setMybooAmount] = useState('');
  const [swapStep, setSwapStep] = useState('idle'); // idle | approving | swapping

  const numAmount = parseFloat(mybooAmount) || 0;
  const mybubuReceived = numAmount;

  // Fetch user's MyBoo balance from presale
  const { tokensBought, refetch: refetchUserInfo } = useUserInfo(address);
  const mybooBalance = parseFloat(tokensBought) || 0;

  // Approval hook
  const approval = useMyBooApproval(address, numAmount > 0 ? mybooAmount : '0');

  // Swap hook
  const swap = useSwapMyBoo();

  const isProcessing = swapStep !== 'idle';
  const isValid = numAmount > 0;

  // Handle swap: approve → swap
  const handleSwap = () => {
    if (!isValid || !walletConnected) return;

    if (approval.needsApproval) {
      setSwapStep('approving');
      approval.handleApprove();
    } else {
      setSwapStep('swapping');
      swap.swapMyBoo(mybooAmount);
    }
  };

  // After approval confirms → trigger swap
  useEffect(() => {
    if (approval.approveConfirmed && swapStep === 'approving') {
      approval.refetch();
      setSwapStep('swapping');
      swap.swapMyBoo(mybooAmount);
    }
  }, [approval.approveConfirmed, swapStep]);

  // After swap confirms → success
  useEffect(() => {
    if (swap.isConfirmed && swapStep === 'swapping') {
      setSwapStep('idle');
      setMybooAmount('');
      approval.refetch();
      swap.reset();
      approval.resetApprove();
      refetchUserInfo();
      toast.success('🎉 Swap Successful! Your MyBoo tokens have been swapped for MYBUBU.');
    }
  }, [swap.isConfirmed, swapStep]);

  // Handle errors
  useEffect(() => {
    const err = approval.approveError || swap.error;
    if (err && swapStep !== 'idle') {
      setSwapStep('idle');
      toast.error(err.shortMessage || err.message || 'Transaction Failed');
    }
  }, [approval.approveError, swap.error]);

  // Button text
  const getButtonContent = () => {
    if (isProcessing) {
      const stepText = swapStep === 'approving'
        ? (approval.isApproving ? 'Approving MyBoo...' : 'Wallet Opening...')
        : (swap.isPending ? 'Wallet Opening...' : 'Swapping...');

      return (
        <span className="flex items-center justify-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
          />
          {stepText}
        </span>
      );
    }

    if (!walletConnected) return 'Connect Wallet First';

    if (isValid && !approval.hasEnoughBalance) {
      return 'Insufficient MyBoo Balance';
    }

    return (
      <span className="flex items-center justify-center gap-2">
        <Repeat size={18} />
        {approval.needsApproval ? 'Approve & Swap' : 'Swap MyBoo → MYBUBU'}
      </span>
    );
  };

  const isButtonDisabled = !walletConnected || !isValid || isProcessing ||
    (isValid && !approval.hasEnoughBalance);

  // Quick amounts based on user balance
  const quickAmounts = mybooBalance > 0
    ? [
        Math.floor(mybooBalance * 0.25),
        Math.floor(mybooBalance * 0.5),
        Math.floor(mybooBalance * 0.75),
        Math.floor(mybooBalance),
      ].filter((v) => v > 0)
    : [1000, 2500, 5000, 10000];

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
          <Repeat size={48} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">
          Swap MyBoo → MYBUBU
        </h2>
        <p className="text-muted-foreground text-sm">
          Swap your pre-launch MyBoo tokens 1:1 for MYBUBU tokens
        </p>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4 border-primary/20 flex gap-3 items-start"
      >
        <Info size={18} className="text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">How it works:</span> Approve your MyBoo tokens, then swap them 1:1 for MYBUBU.
          This is a <span className="text-primary font-medium">token migration</span> — your MyBoo will be burned and MYBUBU minted to your wallet.
        </div>
      </motion.div>

      {/* Swap Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        {/* MyBoo Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Send</span>
            <span className="text-xs text-muted-foreground">
              Balance: {walletConnected
                ? `${mybooBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} MyBoo`
                : '—'}
            </span>
          </div>
          <div className="relative bg-background/50 border border-border rounded-xl p-4">
            <input
              type="text"
              placeholder="0.00"
              value={mybooAmount}
              onChange={(e) => setMybooAmount(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none disabled:opacity-50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">👻</span>
              <span className="font-bold text-sm text-foreground">MyBoo</span>
            </div>
          </div>
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2">
            {quickAmounts.map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMybooAmount(v.toString())}
                disabled={isProcessing}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
              >
                {v.toLocaleString()}
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
            <span className="text-xs text-muted-foreground">Rate: 1 MyBoo = 1 MYBUBU</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">
              {mybubuReceived.toLocaleString()}
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐱</span>
              <span className="font-bold text-sm text-foreground">MYBUBU</span>
            </div>
          </div>
        </div>

        {/* Validation */}
        <AnimatePresence>
          {numAmount > 0 && !approval.hasEnoughBalance && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive text-center"
            >
              Insufficient MyBoo balance. You have {mybooBalance.toLocaleString()} MyBoo.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Swap info */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Swap Ratio</span>
            <span className="text-primary">1:1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Type</span>
            <span className="text-secondary">Token Migration</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Fee</span>
            <span className="text-primary">0%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Approval</span>
            <span className={approval.needsApproval ? 'text-yellow-500' : 'text-green-500'}>
              {numAmount > 0
                ? (approval.needsApproval ? 'Needs Approval' : 'Approved ✓')
                : '—'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Swap Button */}
      <motion.button
        whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
        whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
        onClick={handleSwap}
        disabled={isButtonDisabled}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={isValid && !isButtonDisabled ? { boxShadow: 'var(--shadow-glow)' } : {}}
      >
        {getButtonContent()}
      </motion.button>
    </div>
  );
};
