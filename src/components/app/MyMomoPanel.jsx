import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownUp, Clock, Lock, Gift, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useMybubuApproval } from '@/hooks/dataSender/useMybubuApproval';
import { useMymomoDeposit } from '@/hooks/dataSender/useMymomoDeposit';
import { useMymomoClaim } from '@/hooks/dataSender/useMymomoClaim';
import { useGetTotalClaimable } from '@/hooks/dataFetcher/useGetTotalClaimable';
import { toast } from 'react-toastify';

export const MyMomoPanel = ({ walletConnected }) => {
  const { t } = useTranslation();
  const [mybubuAmount, setMybubuAmount] = useState('');
  const [inputError, setInputError] = useState('');
  const { address } = useAccount();

  const {
    formattedBalance, hasEnoughBalance, hasEnoughAllowance, needsApproval,
    handleApprove, isApproving, approveConfirmed, approveError, resetApprove,
    refetch: refetchApproval,
  } = useMybubuApproval(address, mybubuAmount);

  const {
    deposit, isPending: isDepositing, isConfirming: isDepositConfirming,
    isConfirmed: depositConfirmed, error: depositError, reset: resetDeposit,
  } = useMymomoDeposit();

  const { claimable, hasClaimable, refetch: refetchClaimable } = useGetTotalClaimable(address);

  const {
    claim, isPending: isClaiming, isConfirming: isClaimConfirming,
    isConfirmed: claimConfirmed, error: claimError, reset: resetClaim,
  } = useMymomoClaim();

  const numAmount = parseFloat(mybubuAmount) || 0;
  const dailyReward = numAmount > 0 ? (numAmount * 0.001).toFixed(4) : '0.0000';
  const isValidAmount = numAmount > 0 && !inputError;
  const insufficientBalance = isValidAmount && !hasEnoughBalance;

  const handleInputChange = (e) => {
    const val = e.target.value;
    setMybubuAmount(val);
    setInputError('');
    resetApprove();
    resetDeposit();

    if (val && (isNaN(val) || parseFloat(val) < 0)) {
      setInputError(t('app.mymomo.validNumber'));
    } else if (val && parseFloat(val) === 0) {
      setInputError(t('app.mymomo.greaterZero'));
    }
  };

  useEffect(() => {
    if (approveConfirmed && mybubuAmount) {
      toast.success(t('app.mymomo.approvedToast'));
      refetchApproval();
      deposit(mybubuAmount);
    }
  }, [approveConfirmed]);

  useEffect(() => {
    if (depositConfirmed) {
      toast.success(t('app.mymomo.stakedToast'));
      setMybubuAmount('');
      refetchApproval();
      refetchClaimable();
    }
  }, [depositConfirmed]);

  useEffect(() => {
    if (claimConfirmed) {
      toast.success(t('app.mymomo.claimedToast'));
      refetchClaimable();
      resetClaim();
    }
  }, [claimConfirmed]);

  useEffect(() => {
    if (approveError) toast.error(t('app.mymomo.approvalFail') + (approveError.shortMessage || approveError.message));
  }, [approveError]);
  useEffect(() => {
    if (depositError) toast.error(t('app.mymomo.stakeFail') + (depositError.shortMessage || depositError.message));
  }, [depositError]);
  useEffect(() => {
    if (claimError) toast.error(t('app.mymomo.claimFail') + (claimError.shortMessage || claimError.message));
  }, [claimError]);

  const handleStake = () => {
    if (needsApproval) handleApprove();
    else if (hasEnoughAllowance && hasEnoughBalance) deposit(mybubuAmount);
  };

  const isProcessing = isApproving || isDepositing || isDepositConfirming;

  const getButtonText = () => {
    if (!walletConnected) return t('app.common.connectFirst');
    if (isApproving) return t('app.mymomo.approving');
    if (isDepositing || isDepositConfirming) return t('app.mymomo.staking');
    if (insufficientBalance) return t('app.mymomo.insufficient');
    if (inputError) return t('app.mymomo.invalidInput');
    if (needsApproval) return t('app.mymomo.approveStakeBtn');
    return t('app.mymomo.stakeBtn');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: '0 0 60px hsl(200 80% 65% / 0.1)' }}
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <span className="text-5xl inline-block">🐵</span>
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2 mt-3">{t('app.mymomo.title')}</h2>
        <p className="text-muted-foreground text-sm">{t('app.mymomo.subtitle')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-5 border-primary/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} className="text-secondary" />
          <span className="text-sm font-bold text-foreground">Lifetime Daily Rewards</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-2xl font-display font-bold gradient-text">0.1%</div>
            <div className="text-[11px] text-muted-foreground mt-1">Daily Rate</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-secondary/5 border border-secondary/20">
            <div className="text-2xl font-display font-bold gradient-text">∞</div>
            <div className="text-[11px] text-muted-foreground mt-1">Lifetime</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="text-2xl font-display font-bold gradient-text">24h</div>
            <div className="text-[11px] text-muted-foreground mt-1">Claim Cycle</div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground text-center mt-3">
          Stake MYBUBU and earn <span className="text-primary font-semibold">0.1% Zimomo daily</span> for life. Claimable every 24 hours.
        </p>
      </motion.div>

      {walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="glass-card p-5 border-secondary/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Gift size={16} className="text-secondary" />
            <span className="text-sm font-bold text-foreground">{t('app.mymomo.claimable')}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-display font-bold text-primary">
                {parseFloat(claimable).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{t('app.mymomo.claimableDesc')}</p>
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
                  {t('app.common.claiming')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Gift size={16} />
                  {t('app.mymomo.claim')}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t('app.common.youStake')}</span>
            <span className="text-xs text-muted-foreground">
              {t('app.common.balance')}: {walletConnected ? `${parseFloat(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU` : '—'}
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

          {inputError && (
            <div className="flex items-center gap-1.5 mt-2 text-destructive text-xs">
              <AlertCircle size={12} />
              {inputError}
            </div>
          )}
          {insufficientBalance && !inputError && (
            <div className="flex items-center gap-1.5 mt-2 text-destructive text-xs">
              <AlertCircle size={12} />
              {t('app.mymomo.insufficient')}
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

        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center border-primary/30"
          >
            <ArrowDownUp size={18} className="text-primary" />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t('app.mymomo.vestedReceive')}</span>
            <span className="text-xs text-muted-foreground">{t('app.mymomo.rateLine')}</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">{numAmount.toLocaleString()}</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐵</span>
              <span className="font-bold text-sm text-foreground">MyMomo</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.mymomo.stakeRatio')}</span>
            <span className="text-primary">1:1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.common.type')}</span>
            <span className="text-secondary">{t('app.mymomo.vestingType')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.mymomo.vesting')}</span>
            <span className="text-primary">{t('app.mymomo.vestingValue')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.mymomo.monthlyRelease')}</span>
            <span className="text-primary">{monthlyRelease} MyMomo</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.common.fee')}</span>
            <span className="text-primary">0%</span>
          </div>
          {needsApproval && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('app.common.step')}</span>
              <span className="text-secondary flex items-center gap-1">
                <Lock size={10} /> {t('app.mymomo.approveStakeStep')}
              </span>
            </div>
          )}
        </div>
      </motion.div>

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
