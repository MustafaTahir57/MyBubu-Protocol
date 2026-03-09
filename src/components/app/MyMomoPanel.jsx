import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Clock, Repeat } from 'lucide-react';

export const MyMomoPanel = ({ walletConnected }) => {
  const [mybubuAmount, setMybubuAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const numAmount = parseFloat(mybubuAmount) || 0;
  const mymomoReceived = numAmount;
  const monthlyRelease = numAmount > 0 ? (numAmount * 0.1).toFixed(2) : '0.00';

  const handleSwap = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    setMybubuAmount('');
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
          Swap MYBUBU → MyMomo
        </h2>
        <p className="text-muted-foreground text-sm">
          Swap your MYBUBU tokens 1:1 for MyMomo — released 10% monthly over 10 months
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

      {/* Swap Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        {/* MYBUBU Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Send</span>
            <span className="text-xs text-muted-foreground">Balance: {walletConnected ? '0.00 MYBUBU' : '—'}</span>
          </div>
          <div className="relative bg-background/50 border border-border rounded-xl p-4">
            <input
              type="number"
              placeholder="0.00"
              value={mybubuAmount}
              onChange={(e) => setMybubuAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐱</span>
              <span className="font-bold text-sm text-foreground">MYBUBU</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[100, 500, 1000, 5000].map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMybubuAmount(v.toString())}
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

        {/* MyMomo Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">You Receive (Vested)</span>
            <span className="text-xs text-muted-foreground">Rate: 1 MYBUBU = 1 MyMomo</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">
              {mymomoReceived.toLocaleString()}
            </p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐵</span>
              <span className="font-bold text-sm text-foreground">MyMomo</span>
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
            <span className="text-secondary">Vested Token Swap</span>
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
            Swap MYBUBU → MyMomo
          </span>
        )}
      </motion.button>
    </div>
  );
};
