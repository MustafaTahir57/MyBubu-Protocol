import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { Rocket, ArrowDownUp, Zap, RefreshCw, Info, Gift } from 'lucide-react';
import { useTokensForUSDT, useTokensForBNB } from '@/hooks/dataFetcher/useTokenQuote';
import { useUSDTApproval } from '@/hooks/dataSender/useUSDTApproval';
import { useBuyWithUSDT } from '@/hooks/dataSender/useBuyWithUSDT';
import { useBuyWithBNB } from '@/hooks/dataSender/useBuyWithBNB';
import { useUserInfo } from '@/hooks/dataFetcher/useUserInfo';
import { usePresaleInfo } from '@/hooks/dataFetcher/usePresaleInfo';
import { toast } from 'react-toastify';

export const MyBooPanel = ({ walletConnected }) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const [payMethod, setPayMethod] = useState('usdt');
  const [amount, setAmount] = useState('');
  const [buyStep, setBuyStep] = useState('idle');
  const { refetch: refetchUserInfo } = useUserInfo(address);
  const { tokenPriceUSD } = usePresaleInfo();

  const numAmount = parseFloat(amount) || 0;
  const minAmount = payMethod === 'usdt' ? 100 : 0.25;
  const isValid = numAmount >= minAmount;

  const quickAmounts = payMethod === 'usdt' ? [100, 250, 500, 1000] : [0.25, 0.5, 1, 2];

  const usdtQuote = useTokensForUSDT(payMethod === 'usdt' && numAmount > 0 ? amount : '0');
  const bnbQuote = useTokensForBNB(payMethod === 'bnb' && numAmount > 0 ? amount : '0');
  const tokensReceived = payMethod === 'usdt' ? usdtQuote.tokensOut : bnbQuote.tokensOut;
  const quoteLoading = payMethod === 'usdt' ? usdtQuote.isLoading : bnbQuote.isLoading;

  const approval = useUSDTApproval(address, payMethod === 'usdt' ? amount : '0');

  const usdtBuy = useBuyWithUSDT();
  const bnbBuy = useBuyWithBNB();

  const isProcessing = buyStep !== 'idle';

  const handleBuyUSDT = async () => {
    if (!isValid || !walletConnected) return;
    if (approval.needsApproval) {
      setBuyStep('approving');
      approval.handleApprove();
    } else {
      setBuyStep('purchasing');
      usdtBuy.buyWithUSDT(amount);
    }
  };

  const handleBuyBNB = () => {
    if (!isValid || !walletConnected) return;
    setBuyStep('purchasing');
    bnbBuy.buyWithBNB(amount);
  };

  useEffect(() => {
    if (approval.approveConfirmed && buyStep === 'approving') {
      approval.refetch();
      setBuyStep('purchasing');
      usdtBuy.buyWithUSDT(amount);
    }
  }, [approval.approveConfirmed, buyStep]);

  useEffect(() => {
    if (usdtBuy.isConfirmed && buyStep === 'purchasing') {
      setBuyStep('idle');
      setAmount('');
      approval.refetch();
      usdtBuy.reset();
      approval.resetApprove();
      refetchUserInfo();
      toast.success(t('app.myboo.successToast'));
    }
  }, [usdtBuy.isConfirmed, buyStep]);

  useEffect(() => {
    if (bnbBuy.isConfirmed && buyStep === 'purchasing') {
      setBuyStep('idle');
      setAmount('');
      bnbBuy.reset();
      refetchUserInfo();
      toast.success(t('app.myboo.successToast'));
    }
  }, [bnbBuy.isConfirmed, buyStep]);

  useEffect(() => {
    const err = approval.approveError || usdtBuy.error || bnbBuy.error;
    if (err && buyStep !== 'idle') {
      setBuyStep('idle');
      toast.error(err.shortMessage || err.message || t('app.myboo.txFailed'));
    }
  }, [approval.approveError, usdtBuy.error, bnbBuy.error]);

  const handleBuy = () => {
    if (payMethod === 'usdt') handleBuyUSDT();
    else handleBuyBNB();
  };

  const getButtonContent = () => {
    if (isProcessing) {
      const stepText = buyStep === 'approving'
        ? (approval.isApproving ? t('app.myboo.approving') : t('app.common.openingWallet'))
        : (payMethod === 'usdt'
          ? (usdtBuy.isPending ? t('app.common.openingWallet') : t('app.myboo.purchasing'))
          : (bnbBuy.isPending ? t('app.common.openingWallet') : t('app.myboo.purchasing')));

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

    if (!walletConnected) return t('app.common.connectFirst');

    if (payMethod === 'usdt' && isValid && !approval.hasEnoughBalance) {
      return t('app.myboo.insufficientUsdt');
    }

    if (payMethod === 'bnb' && isValid && !bnbBuy.hasEnoughBNB(amount)) {
      return t('app.myboo.insufficientBnb');
    }

    return (
      <span className="flex items-center justify-center gap-2">
        <Rocket size={18} />
        {t('app.myboo.buyBtn')}
      </span>
    );
  };

  const isButtonDisabled = !walletConnected || !isValid || isProcessing ||
    (payMethod === 'usdt' && isValid && !approval.hasEnoughBalance) ||
    (payMethod === 'bnb' && isValid && !bnbBuy.hasEnoughBNB(amount));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center relative overflow-hidden"
        style={{ boxShadow: '0 0 60px hsl(280 80% 65% / 0.15)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/60"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: [0, -10, 0] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="relative inline-block mb-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center mx-auto">
            <Rocket size={32} className="text-primary-foreground" />
          </div>
        </motion.div>

        <h2 className="font-display text-2xl font-bold gradient-text mb-1">{t('app.myboo.title')}</h2>
        <p className="text-muted-foreground text-sm mb-3">{t('app.myboo.subtitle')}</p>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold"
        >
          <Zap size={12} />
          {t('app.myboo.preLaunch')}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4 border-primary/20 flex gap-3 items-start"
      >
        <Info size={18} className="text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">{t('app.myboo.howWorks')}</span> {t('app.myboo.howWorksDesc')}{' '}
          <span className="text-primary font-medium">{t('app.myboo.swapInline')}</span>{t('app.myboo.earlyBonus')}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-2 flex gap-2"
      >
        {[
          { id: 'usdt', label: t('app.myboo.payUsdt'), icon: '$', color: 'bg-green-500' },
          { id: 'bnb', label: t('app.myboo.payBnb'), icon: '◆', color: 'bg-yellow-500' },
        ].map((m) => (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setPayMethod(m.id); setAmount(''); setBuyStep('idle'); }}
            disabled={isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
              payMethod === m.id
                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className={`w-5 h-5 rounded-full ${m.color} flex items-center justify-center text-xs font-bold text-white`}>
              {m.icon}
            </span>
            {m.label}
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6 space-y-4"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t('app.common.youPay')}</span>
            <span className="text-xs text-muted-foreground">
              {t('app.myboo.min')}: {payMethod === 'usdt' ? '100 USDT' : '0.1 BNB'} · {t('app.myboo.max')}: {payMethod === 'usdt' ? '10,000 USDT' : '2 BNB'}
            </span>
          </div>
          <div className="relative bg-background/50 border border-border rounded-xl p-4">
            <input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none disabled:opacity-50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {payMethod === 'usdt' ? (
                <>
                  <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">$</span>
                  <span className="font-bold text-sm text-foreground">USDT</span>
                </>
              ) : (
                <>
                  <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-white">◆</span>
                  <span className="font-bold text-sm text-foreground">BNB</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            {quickAmounts.map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAmount(v.toString())}
                disabled={isProcessing}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
              >
                {payMethod === 'usdt' ? `$${v}` : `${v} BNB`}
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
            <span className="text-sm text-muted-foreground">{t('app.common.youReceive')}</span>
            <span className="text-xs text-muted-foreground">{t('app.myboo.fetched')}</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">
              {quoteLoading ? (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  {t('app.common.loading')}
                </motion.span>
              ) : numAmount > 0 ? (
                parseFloat(tokensReceived).toLocaleString(undefined, { maximumFractionDigits: 2 })
              ) : (
                '0'
              )}
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <span className="font-bold text-sm text-foreground">MyBoo</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {numAmount > 0 && !isValid && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive text-center"
            >
              {t('app.myboo.minPurchase', { min: payMethod === 'usdt' ? `$${minAmount}` : `${minAmount} BNB` })}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.myboo.tokenPrice')}</span>
            <span className="text-primary">
              {tokenPriceUSD > 0
                ? `$${tokenPriceUSD.toLocaleString(undefined, { maximumFractionDigits: 6 })} / MyBoo`
                : t('app.common.loading')}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.myboo.swapTo')}</span>
            <span className="text-secondary flex items-center gap-1">
              <RefreshCw size={10} /> {t('app.myboo.atLaunch')}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.myboo.bonus')}</span>
            <span className="text-primary flex items-center gap-1">
              <Gift size={10} /> {t('app.myboo.earlyPriority')}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.button
        whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
        whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
        onClick={handleBuy}
        disabled={isButtonDisabled}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={isValid && !isButtonDisabled ? { boxShadow: 'var(--shadow-glow)' } : {}}
      >
        {getButtonContent()}
      </motion.button>
    </div>
  );
};
