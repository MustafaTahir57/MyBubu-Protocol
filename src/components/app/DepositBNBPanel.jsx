import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowDown, TrendingUp, Info, Zap, Gift, Sparkles, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAccount, useBytecode } from 'wagmi';
import { useDepositBNB } from '@/hooks/dataSender/useDepositBNB';
import { usePendingLPReward } from '@/hooks/dataFetcher/usePendingLPReward';
import { useClaimLPReward } from '@/hooks/dataSender/useClaimLPReward';
import { toast } from 'react-toastify';

const presets = [0.1, 0.2, 0.5, 1.0, 1.5, 2.0];

export const DepositBNBPanel = ({ walletConnected }) => {
  const [amount, setAmount] = useState('');
  const [showSmartAccountInfo, setShowSmartAccountInfo] = useState(false);
  const { address } = useAccount();
  const { data: bytecode } = useBytecode({ address, query: { enabled: !!address } });
  const isSmartAccount = !!bytecode && bytecode !== '0x' && bytecode.length > 2;
  const { deposit, isPending, isConfirming, isConfirmed, error, reset, bnbBalance, hasEnoughBNB , refetch: refetchBnbBalance } = useDepositBNB();

  // LP reward claim
  const {
    pendingReward,
    isLoading: isLoadingReward,
    refetch: refetchPendingReward,
  } = usePendingLPReward(address);

  const {
    claimReward,
    isPending: isClaimPending,
    isConfirming: isClaimConfirming,
    isConfirmed: isClaimConfirmed,
    error: claimError,
    reset: resetClaim,
  } = useClaimLPReward();

  const isClaimProcessing = isClaimPending || isClaimConfirming;
  const pendingRewardNum = parseFloat(pendingReward) || 0;
  const canClaim = walletConnected && pendingRewardNum > 0 && !isClaimProcessing;

  useEffect(() => {
    if (isClaimConfirmed) {
      toast.success('🎉 LP rewards claimed successfully!');
      refetchPendingReward();
      resetClaim();
    }
  }, [isClaimConfirmed]);

  useEffect(() => {
    if (claimError) {
      toast.error(claimError.shortMessage || claimError.message || 'Claim failed');
      resetClaim();
    }
  }, [claimError]);

  const handleClaim = () => {
    if (!canClaim) return;
    claimReward();
  };
  
  const numAmount = parseFloat(amount);
  const isValidNumber = amount !== '' && !isNaN(numAmount) && isFinite(numAmount) && numAmount > 0;
  const isInRange = isValidNumber && numAmount >= 0.1 && numAmount <= 2;
  const insufficientBalance = isValidNumber && !hasEnoughBNB(amount);
  const isProcessing = isPending || isConfirming;

  const lpBreakdown = {
    lp: ((isValidNumber ? numAmount : 0) * 0.7).toFixed(4),
    labubu: ((isValidNumber ? numAmount : 0) * 0.35).toFixed(4),
    bnb: ((isValidNumber ? numAmount : 0) * 0.35).toFixed(4),
    referral: ((isValidNumber ? numAmount : 0) * 0.2).toFixed(4),
    globalPool: ((isValidNumber ? numAmount : 0) * 0.1).toFixed(4),
  };

  useEffect(() => {
    if (isConfirmed) {
      toast.success('🎉 BNB deposited successfully!');
      refetchBnbBalance();
      setAmount('');
      reset();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toast.error(error.shortMessage || 'Deposit failed');
      reset();
    }
  }, [error]);

  const handleDeposit = () => {
    if (!isInRange || insufficientBalance) return;
    deposit(amount);
  };

  const canDeposit = isInRange && !insufficientBalance;

  const hasInput = amount.trim() !== '';
  const isInvalidInput = hasInput && !isValidNumber;
  const isOutOfRange = isValidNumber && !isInRange;

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
          Deposit BNB for LP
        </h2>
        <p className="text-muted-foreground text-sm">
          Deposit BNB to receive LP tokens • Min: 0.1 BNB • Max: 2 BNB
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
          <span className="text-sm text-muted-foreground">Deposit Amount</span>
          <span className="text-xs text-muted-foreground">Balance: {walletConnected ? `${bnbBalance.toFixed(4)} BNB` : '—'}</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full bg-background/50 border rounded-xl px-4 py-4 text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none transition-all ${
              isInvalidInput
                ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                : 'border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30'
            }`}
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

        {isInvalidInput && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <Info size={12} /> Please enter a valid number
          </p>
        )}
        {isOutOfRange && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <Info size={12} /> Amount must be between 0.1 and 2 BNB
          </p>
        )}
        {isInRange && insufficientBalance && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <Info size={12} /> Insufficient BNB balance
          </p>
        )}
      </motion.div>

      {/* LP Breakdown */}
      {isInRange && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          className="glass-card p-6 space-y-3"
        >
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-primary" />
            Distribution Breakdown
          </h3>

          {[
            { label: 'LP (70%)', sub: `${lpBreakdown.labubu} Labubu + ${lpBreakdown.bnb} BNB`, value: `${lpBreakdown.lp} BNB`, color: 'text-primary' },
            { label: 'Referral & Rewards (20%)', value: `${lpBreakdown.referral} BNB`, color: 'text-secondary' },
            { label: 'Global Pool (10%)', value: `${lpBreakdown.globalPool} BNB`, color: 'text-primary' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
            >
              <div>
                <p className="text-sm text-foreground">{item.label}</p>
                {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
              </div>
              <span className={`font-mono font-bold text-sm ${item.color}`}>{item.value}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Deposit Button */}
      <motion.button
        whileHover={canDeposit && !isProcessing ? { scale: 1.02 } : {}}
        whileTap={canDeposit && !isProcessing ? { scale: 0.98 } : {}}
        onClick={handleDeposit}
        disabled={!walletConnected || !canDeposit || isProcessing}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-secondary to-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
        style={isInRange ? { boxShadow: '0 0 30px hsl(30 80% 60% / 0.3)' } : {}}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
            {isPending ? 'Confirm in Wallet...' : 'Processing...'}
          </span>
        ) : !walletConnected ? (
          'Connect Wallet First'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Zap size={18} />
            Deposit {isValidNumber ? amount : '0'} BNB
          </span>
        )}
      </motion.button>

      {/* Claim LP Rewards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-4 relative overflow-hidden"
        style={{ boxShadow: '0 0 60px hsl(340 80% 65% / 0.1)' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30"
          >
            <Gift size={22} className="text-primary" />
          </motion.div>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Claim LP Rewards
            </h3>
            <p className="text-xs text-muted-foreground">
              Your pending MYBUBU rewards from LP
            </p>
          </div>
        </div>

        <div className="bg-background/50 border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pending Reward</p>
            <p className="text-2xl font-display font-bold gradient-text">
              {!walletConnected
                ? '—'
                : isLoadingReward
                  ? '...'
                  : pendingRewardNum.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              <span className="text-sm text-muted-foreground font-medium ml-2">MYBUBU</span>
            </p>
          </div>
          <Sparkles size={28} className="text-secondary" />
        </div>

        <motion.button
          whileHover={canClaim ? { scale: 1.02 } : {}}
          whileTap={canClaim ? { scale: 0.98 } : {}}
          onClick={handleClaim}
          disabled={!canClaim}
          className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={canClaim ? { boxShadow: '0 0 30px hsl(340 80% 65% / 0.3)' } : {}}
        >
          {isClaimProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              {isClaimPending ? 'Confirm in Wallet...' : 'Claiming...'}
            </span>
          ) : !walletConnected ? (
            'Connect Wallet First'
          ) : pendingRewardNum <= 0 ? (
            'No Rewards to Claim'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Gift size={18} />
              Claim {pendingRewardNum.toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU
            </span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};
