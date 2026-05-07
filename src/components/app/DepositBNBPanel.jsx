import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Coins, ArrowDown, TrendingUp, Info, Zap, Gift, Sparkles, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAccount, useBytecode } from 'wagmi';
import { useDepositBNB } from '@/hooks/dataSender/useDepositBNB';
import { usePendingLPReward } from '@/hooks/dataFetcher/usePendingLPReward';
import { useClaimLPReward } from '@/hooks/dataSender/useClaimLPReward';
import { toast } from 'react-toastify';

const presets = [0.1, 0.2, 0.5, 1.0, 1.5, 2.0];

export const DepositBNBPanel = ({ walletConnected }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [showSmartAccountInfo, setShowSmartAccountInfo] = useState(false);
  const { address } = useAccount();
  const { data: bytecode } = useBytecode({ address, query: { enabled: !!address } });
  const isSmartAccount = !!bytecode && bytecode !== '0x' && bytecode.length > 2;
  const { deposit, isPending, isConfirming, isConfirmed, error, reset, bnbBalance, hasEnoughBNB, refetch: refetchBnbBalance } = useDepositBNB();

  const { pendingReward, isLoading: isLoadingReward, refetch: refetchPendingReward } = usePendingLPReward(address);

  const {
    claimReward, isPending: isClaimPending, isConfirming: isClaimConfirming,
    isConfirmed: isClaimConfirmed, error: claimError, reset: resetClaim,
  } = useClaimLPReward();

  const isClaimProcessing = isClaimPending || isClaimConfirming;
  const pendingRewardNum = parseFloat(pendingReward) || 0;
  const canClaim = walletConnected && pendingRewardNum > 0 && !isClaimProcessing;

  useEffect(() => {
    if (isClaimConfirmed) {
      toast.success(t('app.deposit.claimSuccess'));
      refetchPendingReward();
      resetClaim();
    }
  }, [isClaimConfirmed]);

  useEffect(() => {
    if (claimError) {
      toast.error(claimError.shortMessage || claimError.message || t('app.deposit.claimFailed'));
      resetClaim();
    }
  }, [claimError]);

  const handleClaim = () => { if (canClaim) claimReward(); };

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
      toast.success(t('app.deposit.successToast'));
      refetchBnbBalance();
      setAmount('');
      reset();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (error) {
      toast.error(error.shortMessage || t('app.deposit.depositFailed'));
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: '0 0 60px hsl(30 80% 60% / 0.1)' }}
      >
        <motion.div animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <Coins size={48} className="mx-auto text-secondary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">{t('app.deposit.title')}</h2>
        <p className="text-muted-foreground text-sm">{t('app.deposit.subtitle')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t('app.deposit.amount')}</span>
          <span className="text-xs text-muted-foreground">{t('app.common.balance')}: {walletConnected ? `${bnbBalance.toFixed(4)} BNB` : '—'}</span>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full bg-background/50 border rounded-xl px-4 py-4 text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none transition-all ${
              isInvalidInput ? 'border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30'
                : 'border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary font-bold text-sm">BNB</span>
        </div>

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
            <Info size={12} /> {t('app.deposit.validNumber')}
          </p>
        )}
        {isOutOfRange && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <Info size={12} /> {t('app.deposit.outOfRange')}
          </p>
        )}
        {isInRange && insufficientBalance && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <Info size={12} /> {t('app.deposit.insufficient')}
          </p>
        )}
      </motion.div>

      {isInRange && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          className="glass-card p-6 space-y-3"
        >
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-primary" />
            {t('app.deposit.breakdown')}
          </h3>

          {[
            { label: t('app.deposit.lpRow'), sub: `${lpBreakdown.labubu} Labubu + ${lpBreakdown.bnb} BNB`, value: `${lpBreakdown.lp} BNB`, color: 'text-primary' },
            { label: t('app.deposit.refRow'), value: `${lpBreakdown.referral} BNB`, color: 'text-secondary' },
            { label: t('app.deposit.poolRow'), value: `${lpBreakdown.globalPool} BNB`, color: 'text-primary' },
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

      <div className="space-y-3">
        <motion.button
          whileHover={canDeposit && !isProcessing && !isSmartAccount ? { scale: 1.02 } : {}}
          whileTap={canDeposit && !isProcessing && !isSmartAccount ? { scale: 0.98 } : {}}
          onClick={isSmartAccount ? () => setShowSmartAccountInfo(true) : handleDeposit}
          disabled={!walletConnected || (!isSmartAccount && (!canDeposit || isProcessing))}
          className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-secondary to-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
          style={isInRange && !isSmartAccount ? { boxShadow: '0 0 30px hsl(30 80% 60% / 0.3)' } : {}}
        >
          {isSmartAccount && walletConnected ? (
            <span className="flex items-center justify-center gap-2">
              <ShieldAlert size={18} />
              {t('app.deposit.smartDetected')}
            </span>
          ) : isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              {isPending ? t('app.common.confirmWallet') : t('app.common.processing')}
            </span>
          ) : !walletConnected ? (
            t('app.common.connectFirst')
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap size={18} />
              {t('app.deposit.depositBtn', { amount: isValidNumber ? amount : '0' })}
            </span>
          )}
        </motion.button>

        {isSmartAccount && walletConnected && (
          <motion.button
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowSmartAccountInfo(true)}
            className="w-full flex items-center justify-center gap-2 text-xs text-destructive hover:text-destructive/80 transition-colors"
          >
            <Info size={12} />
            {t('app.deposit.whyDisabled')}
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showSmartAccountInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSmartAccountInfo(false)}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-md w-full p-6 space-y-4 border border-destructive/30 max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: '0 0 60px hsl(0 80% 60% / 0.2)' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={22} className="text-destructive" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">{t('app.deposit.smartTitle')}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t('app.deposit.smartIntro')}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="text-foreground font-semibold mb-1">{t('app.deposit.whyRevert')}</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>{t('app.deposit.whyRevert1')}</li>
                    <li>{t('app.deposit.whyRevert2')}</li>
                    <li>{t('app.deposit.whyRevert3')}</li>
                  </ul>
                </div>

                <div>
                  <p className="text-foreground font-semibold mb-1">{t('app.deposit.useEoa')}</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>{t('app.deposit.useEoa1')}</li>
                    <li>{t('app.deposit.useEoa2')}</li>
                    <li>{t('app.deposit.useEoa3')}</li>
                    <li>{t('app.deposit.useEoa4')}</li>
                  </ul>
                </div>

                <div>
                  <p className="text-foreground font-semibold mb-1">{t('app.deposit.tpTitle')}</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>{t('app.deposit.tp1')}</li>
                    <li>{t('app.deposit.tp2')}</li>
                    <li>{t('app.deposit.tp3')}</li>
                    <li>{t('app.deposit.tp4')}</li>
                    <li>{t('app.deposit.tp5')}</li>
                    <li>{t('app.deposit.tp6')}</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowSmartAccountInfo(false)}
                className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-secondary to-primary text-primary-foreground"
              >
                {t('app.common.gotIt')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <h3 className="font-display text-lg font-bold text-foreground">{t('app.deposit.claimTitle')}</h3>
            <p className="text-xs text-muted-foreground">{t('app.deposit.claimSubtitle')}</p>
          </div>
        </div>

        <div className="bg-background/50 border border-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{t('app.deposit.pendingReward')}</p>
            <p className="text-2xl font-display font-bold gradient-text">
              {!walletConnected ? '—' : isLoadingReward ? '...' : pendingRewardNum.toLocaleString(undefined, { maximumFractionDigits: 6 })}
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
              {isClaimPending ? t('app.common.confirmWallet') : t('app.common.claiming')}
            </span>
          ) : !walletConnected ? (
            t('app.common.connectFirst')
          ) : pendingRewardNum <= 0 ? (
            t('app.deposit.noRewards')
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Gift size={18} />
              {t('app.deposit.claimBtn', { amount: pendingRewardNum.toLocaleString(undefined, { maximumFractionDigits: 4 }) })}
            </span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};
