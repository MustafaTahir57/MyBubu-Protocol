import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Clock, Lock, Gift, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useMybubuApproval } from '@/hooks/dataSender/useMybubuApproval';
import { useMymomoDeposit } from '@/hooks/dataSender/useMymomoDeposit';
import { useMymomoClaim } from '@/hooks/dataSender/useMymomoClaim';
import { useGetTotalClaimable } from '@/hooks/dataFetcher/useGetTotalClaimable';
import { toast } from 'sonner';

export const MyMomoPanel = ({ walletConnected }) => {
  const [mybubuAmount, setMybubuAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const { address } = useAccount();

  // Hooks
  const {
    formattedBalance,
    hasEnoughBalance,
    hasEnoughAllowance,
    needsApproval,
    handleApprove,
    isApproving,
    approveConfirmed,
    approveError,
    resetApprove,
    refetch: refetchApproval,
  } = useMybubuApproval(address, mybubuAmount);

  const {
    deposit,
    isPending: isDepositing,
    isConfirming: isDepositConfirming,
    isConfirmed: depositConfirmed,
    error: depositError,
    reset: resetDeposit,
  } = useMymomoDeposit();

  const {
    claimable,
    hasClaimable,
    refetch: refetchClaimable,
  } = useGetTotalClaimable(address);

  const {
    claim,
    isPending: isClaiming,
    isConfirming: isClaimConfirming,
    isConfirmed: claimConfirmed,
    error: claimError,
    reset: resetClaim,
  } = useMymomoClaim();

  const numAmount = parseFloat(mybubuAmount) || 0;
  const monthlyRelease = numAmount > 0 ? (numAmount * 0.1).toFixed(2) : '0.00';
  const isValidAmount = numAmount > 0 && !inputError;
  const insufficientBalance = isValidAmount && !hasEnoughBalance;

  // Input validation
  const handleInputChange = (e) => {
    const val = e.target.value;
    setMybubuAmount(val);
    setInputError('');
    resetApprove();
    resetDeposit();

    if (val && (isNaN(val) || parseFloat(val) < 0)) {
      setInputError('Please enter a valid number');
    } else if (val && parseFloat(val) === 0) {
      setInputError('Amount must be greater than 0');
    }
  };

  // After approval confirmed → auto deposit
  useEffect(() => {
    if (approveConfirmed && mybubuAmount) {
      toast.success('MYBUBU approved! Staking now...');
      refetchApproval();
      deposit(mybubuAmount);
    }
  }, [approveConfirmed]);

  // Deposit confirmed
  useEffect(() => {
    if (depositConfirmed) {
      toast.success('Staked successfully! Your MyMomo will vest over 10 months.');
      setMybubuAmount('');
      refetchApproval();
      refetchClaimable();
    }
  }, [depositConfirmed]);

  // Claim confirmed
  useEffect(() => {
    if (claimConfirmed) {
      toast.success('MyMomo tokens claimed successfully!');
      refetchClaimable();
      resetClaim();
    }
  }, [claimConfirmed]);

  // Error toasts
  useEffect(() => {
    if (approveError) toast.error('Approval failed: ' + (approveError.shortMessage || approveError.message));
  }, [approveError]);
  useEffect(() => {
    if (depositError) toast.error('Stake failed: ' + (depositError.shortMessage || depositError.message));
  }, [depositError]);
  useEffect(() => {
    if (claimError) toast.error('Claim failed: ' + (claimError.shortMessage || claimError.message));
  }, [claimError]);

  const handleStake = () => {
    if (needsApproval) {
      handleApprove();
    } else if (hasEnoughAllowance && hasEnoughBalance) {
      deposit(mybubuAmount);
    }
  };

  const isProcessing = isApproving || isDepositing || isDepositConfirming;

  const getButtonText = () => {
    if (!walletConnected) return 'Connect Wallet First';
    if (isApproving) return 'Approving MYBUBU...';
    if (isDepositing || isDepositConfirming) return 'Staking...';
    if (insufficientBalance) return 'Insufficient MYBUBU Balance';
    if (inputError) return 'Invalid Input';
    if (needsApproval) return 'Approve & Stake MYBUBU';
    return 'Stake MYBUBU → MyMomo';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: '0 0 60px hsl(200 80% 65% / 0.1)' }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-5xl inline-block">🐵</span>
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2 mt-3">
          Stake MYBUBU → MyMomo
        </h2>
        <p className="text-muted-foreground text-sm">
          Stake your MYBUBU tokens 1:1 for MyMomo — claimable 10% monthly over 10 months
        </p>
      </motion.div>

      {/* Vesting Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4 border-primary/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-secondary" />
          <span className="text-sm font-bold text-foreground">Vesting Schedule</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="text-center">
              <div className="text-[10px] text-muted-foreground mb-1">M{i + 1}</div>
              <div className="h-2 rounded-full bg-primary/20 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                />
              </div>
              <div className="text-[10px] text-primary mt-1">10%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Claim Card */}
      {walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="glass-card p-5 border-secondary/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Gift size={16} className="text-secondary" />
            <span className="text-sm font-bold text-foreground">Claimable MyMomo</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-display font-bold text-primary">
                {parseFloat(claimable).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">MyMomo tokens available to claim</p>
            </div>
            <motion.button
              whileHover={hasClaimable ? { scale: 1.05 } : {}}
              whileTap={hasClaimable ? { scale: 0.95 } : {}}
              onClick={claim}
              disabled={!hasClaimable || isClaiming || isClaimConfirming}
              className="px-6 py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-secondary to-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={hasClaimable ? { boxShadow: 'var(--shadow-glow-sm)' } : {}}
            >
              {isClaiming || isClaimConfirming ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Claiming...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Gift size={16} />
                  Claim
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Stake Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        {/* MYBUBU Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Stake</span>
            <span className="text-xs text-muted-foreground">
              Balance: {walletConnected ? `${parseFloat(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU` : '—'}
            </span>
          </div>
          <div className={`relative bg-background/50 border rounded-xl p-4 ${inputError || insufficientBalance ? 'border-destructive/50' : 'border-border'}`}>
            <input
              type="text"
              placeholder="0.00"
              value={mybubuAmount}
              onChange={handleInputChange}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐱</span>
              <span className="font-bold text-sm text-foreground">MYBUBU</span>
            </div>
          </div>

          {/* Validation errors */}
          {inputError && (
            <div className="flex items-center gap-1.5 mt-2 text-destructive text-xs">
              <AlertCircle size={12} />
              {inputError}
            </div>
          )}
          {insufficientBalance && !inputError && (
            <div className="flex items-center gap-1.5 mt-2 text-destructive text-xs">
              <AlertCircle size={12} />
              Insufficient MYBUBU balance
            </div>
          )}

          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setMybubuAmount(v.toString()); setInputError(''); }}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
              >
                {v.toLocaleString()}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center border-primary/30"
          >
            <ArrowDownUp size={18} className="text-primary" />
          </motion.div>
        </div>

        {/* MyMomo Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Receive (Vested)</span>
            <span className="text-xs text-muted-foreground">Rate: 1 MYBUBU = 1 MyMomo</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">
              {numAmount.toLocaleString()}
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐵</span>
              <span className="font-bold text-sm text-foreground">MyMomo</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stake Ratio</span>
            <span className="text-primary">1:1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Type</span>
            <span className="text-secondary">Vested Token Stake</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Vesting</span>
            <span className="text-primary">10% monthly × 10 months</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Monthly Release</span>
            <span className="text-primary">{monthlyRelease} MyMomo</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Fee</span>
            <span className="text-primary">0%</span>
          </div>
          {needsApproval && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Step</span>
              <span className="text-secondary flex items-center gap-1">
                <Lock size={10} /> Approve → Stake
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stake Button */}
      <motion.button
        whileHover={isValidAmount && !insufficientBalance ? { scale: 1.02 } : {}}
        whileTap={isValidAmount && !insufficientBalance ? { scale: 0.98 } : {}}
        onClick={handleStake}
        disabled={!walletConnected || !isValidAmount || insufficientBalance || isProcessing}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={isValidAmount && !insufficientBalance ? { boxShadow: 'var(--shadow-glow)' } : {}}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
            {getButtonText()}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {!walletConnected ? null : isValidAmount && !insufficientBalance ? <Lock size={18} /> : null}
            {getButtonText()}
          </span>
        )}
      </motion.button>
    </div>
  );
};
