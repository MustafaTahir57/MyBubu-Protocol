import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Rocket, ArrowDownUp, Zap, RefreshCw, Info, Gift } from 'lucide-react';
import { useTokensForUSDT, useTokensForBNB } from '@/hooks/useTokenQuote';
import { useUSDTApproval } from '@/hooks/useUSDTApproval';
import { useBuyWithUSDT } from '@/hooks/useBuyWithUSDT';
import { useBuyWithBNB } from '@/hooks/useBuyWithBNB';
import { toast } from '@/hooks/use-toast';

export const MyBooPanel = ({ walletConnected }) => {
  const { address } = useAccount();
  const [payMethod, setPayMethod] = useState('usdt');
  const [amount, setAmount] = useState('');
  const [buyStep, setBuyStep] = useState('idle'); // idle | approving | purchasing

  const numAmount = parseFloat(amount) || 0;
  const minAmount = payMethod === 'usdt' ? 100 : 0.1;
  // const maxAmount = payMethod === 'usdt' ? 10000 : 2;
  const isValid = numAmount >= minAmount; // && numAmount <= maxAmount;

  const quickAmounts = payMethod === 'usdt' ? [100, 250, 500, 1000] : [0.1, 0.25, 0.5, 1];

  // Read hooks
  const usdtQuote = useTokensForUSDT(payMethod === 'usdt' && numAmount > 0 ? amount : '0');
  const bnbQuote = useTokensForBNB(payMethod === 'bnb' && numAmount > 0 ? amount : '0');
  const tokensReceived = payMethod === 'usdt' ? usdtQuote.tokensOut : bnbQuote.tokensOut;
  const quoteLoading = payMethod === 'usdt' ? usdtQuote.isLoading : bnbQuote.isLoading;

  // Approval hook (USDT only)
  const approval = useUSDTApproval(address, payMethod === 'usdt' ? amount : '0');

  // Write hooks
  const usdtBuy = useBuyWithUSDT();
  const bnbBuy = useBuyWithBNB();

  const isProcessing = buyStep !== 'idle';

  // Handle USDT purchase flow: approve → buy
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

  // Handle BNB purchase
  const handleBuyBNB = () => {
    if (!isValid || !walletConnected) return;
    setBuyStep('purchasing');
    bnbBuy.buyWithBNB(amount);
  };

  // After USDT approval confirms → trigger buy
  useEffect(() => {
    if (approval.approveConfirmed && buyStep === 'approving') {
      approval.refetch();
      setBuyStep('purchasing');
      usdtBuy.buyWithUSDT(amount);
    }
  }, [approval.approveConfirmed, buyStep]);

  // After USDT buy confirms → success
  useEffect(() => {
    if (usdtBuy.isConfirmed && buyStep === 'purchasing') {
      setBuyStep('idle');
      setAmount('');
      approval.refetch();
      usdtBuy.reset();
      approval.resetApprove();
      toast({ title: '🎉 Purchase Successful!', description: 'Your MyBoo tokens have been purchased.' });
    }
  }, [usdtBuy.isConfirmed, buyStep]);

  // After BNB buy confirms → success
  useEffect(() => {
    if (bnbBuy.isConfirmed && buyStep === 'purchasing') {
      setBuyStep('idle');
      setAmount('');
      bnbBuy.reset();
      toast({ title: '🎉 Purchase Successful!', description: 'Your MyBoo tokens have been purchased.' });
    }
  }, [bnbBuy.isConfirmed, buyStep]);

  // Handle errors
  useEffect(() => {
    const err = approval.approveError || usdtBuy.error || bnbBuy.error;
    if (err && buyStep !== 'idle') {
      setBuyStep('idle');
      toast({ title: 'Transaction Failed', description: err.shortMessage || err.message, variant: 'destructive' });
    }
  }, [approval.approveError, usdtBuy.error, bnbBuy.error]);

  const handleBuy = () => {
    if (payMethod === 'usdt') handleBuyUSDT();
    else handleBuyBNB();
  };

  // Button text based on state
  const getButtonContent = () => {
    if (isProcessing) {
      const stepText = buyStep === 'approving'
        ? (approval.isApproving ? 'Approving USDT...' : 'Wallet Opening...')
        : (payMethod === 'usdt'
          ? (usdtBuy.isPending ? 'Wallet Opening...' : 'Purchasing...')
          : (bnbBuy.isPending ? 'Wallet Opening...' : 'Purchasing...'));

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

    if (payMethod === 'usdt' && isValid && !approval.hasEnoughBalance) {
      return 'Insufficient USDT Balance';
    }

    if (payMethod === 'bnb' && isValid && !bnbBuy.hasEnoughBNB(amount)) {
      return 'Insufficient BNB Balance';
    }

    return (
      <span className="flex items-center justify-center gap-2">
        <Rocket size={18} />
        Buy MyBoo Tokens
      </span>
    );
  };

  const isButtonDisabled = !walletConnected || !isValid || isProcessing ||
    (payMethod === 'usdt' && isValid && !approval.hasEnoughBalance) ||
    (payMethod === 'bnb' && isValid && !bnbBuy.hasEnoughBNB(amount));

  return (
    <div className="space-y-6">
      {/* Header */}
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

        <h2 className="font-display text-2xl font-bold gradient-text mb-1">Buy MyBoo Tokens</h2>
        <p className="text-muted-foreground text-sm mb-3">Early-access pre-launch token — swap for MYBUBU later!</p>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold"
        >
          <Zap size={12} />
          PRE-LAUNCH — Limited Time
        </motion.div>
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
          <span className="text-foreground font-semibold">How it works:</span> Purchase MyBoo tokens now at the pre-launch price.
          Once the MYBUBU ecosystem launches, you'll be able to <span className="text-primary font-medium">swap MyBoo 1:1 for MYBUBU tokens</span>.
          Early supporters get the best price!
        </div>
      </motion.div>

      {/* Payment method toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-2 flex gap-2"
      >
        {[
          { id: 'usdt', label: 'Pay with USDT', icon: '$', color: 'bg-green-500' },
          { id: 'bnb', label: 'Pay with BNB', icon: '◆', color: 'bg-yellow-500' },
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

      {/* Swap Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-6 space-y-4"
      >
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Pay</span>
            <span className="text-xs text-muted-foreground">
              Min: {payMethod === 'usdt' ? '100 USDT' : '0.1 BNB'} · Max: {payMethod === 'usdt' ? '10,000 USDT' : '2 BNB'}
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

          {/* Quick amounts */}
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

        {/* Output (read-only) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Receive</span>
            <span className="text-xs text-muted-foreground">
              Fetched from contract
            </span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">
              {quoteLoading ? (
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  Loading...
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

        {/* Validation message */}
        <AnimatePresence>
          {numAmount > 0 && !isValid && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive text-center"
            >
              {numAmount < minAmount
                ? `Minimum purchase is ${payMethod === 'usdt' ? `$${minAmount}` : `${minAmount} BNB`}`
                : `Maximum purchase is ${payMethod === 'usdt' ? `$${maxAmount.toLocaleString()}` : `${maxAmount} BNB`}`}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Token Price</span>
            <span className="text-primary">$0.05 / MyBoo</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Swap to MYBUBU</span>
            <span className="text-secondary flex items-center gap-1">
              <RefreshCw size={10} /> 1:1 at Launch
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Bonus</span>
            <span className="text-primary flex items-center gap-1">
              <Gift size={10} /> Early supporters get priority
            </span>
          </div>
        </div>
      </motion.div>

      {/* Buy button */}
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
