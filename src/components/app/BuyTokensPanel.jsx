import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Wallet, Repeat } from 'lucide-react';

export const BuyTokensPanel = ({ walletConnected }) => {
  const [mybooAmount, setMybooAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 1:1 swap ratio MyBoo → MYBUBU
  const mybubuReceived = mybooAmount ? parseFloat(mybooAmount) || 0 : 0;
  const numAmount = parseFloat(mybooAmount) || 0;

  const handleSwap = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    setMybooAmount('');
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
          <Repeat size={48} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">
          Swap MyBoo → MYBUBU
        </h2>
        <p className="text-muted-foreground text-sm">
          Swap your pre-launch MyBoo tokens 1:1 for MYBUBU tokens
        </p>
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
            <span className="text-xs text-muted-foreground">Balance: {walletConnected ? '10,000.00 MyBoo' : '—'}</span>
          </div>
          <div className="relative bg-background/50 border border-border rounded-xl p-4">
            <input
              type="text"
              placeholder="0.00"
              value={mybooAmount}
              onChange={(e) => setMybooAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">👻</span>
              <span className="font-bold text-sm text-foreground">MyBoo</span>
            </div>
          </div>
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2">
            {[1000, 2500, 5000, 10000].map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMybooAmount(v.toString())}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
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
        </div>
      </motion.div>

      {/* Swap Button */}
      <motion.button
        whileHover={numAmount > 0 ? { scale: 1.02 } : {}}
        whileTap={numAmount > 0 ? { scale: 0.98 } : {}}
        onClick={handleSwap}
        disabled={!walletConnected || numAmount <= 0 || isProcessing}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={numAmount > 0 ? { boxShadow: 'var(--shadow-glow)' } : {}}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
            Swapping...
          </span>
        ) : !walletConnected ? (
          'Connect Wallet First'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Repeat size={18} />
            Swap MyBoo → MYBUBU
          </span>
        )}
      </motion.button>
    </div>
  );
};
