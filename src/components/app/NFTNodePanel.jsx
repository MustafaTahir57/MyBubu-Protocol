import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Gem, Sparkles, Plus, Minus, TrendingUp, Star, Zap } from 'lucide-react';

const tiers = [
  { nfts: 1, tokens: '10K', tier: 'Starter', emoji: '🥉', color: 'from-amber-600 to-amber-800' },
  { nfts: 2, tokens: '20K', tier: 'Bronze', emoji: '🥈', color: 'from-slate-400 to-slate-600' },
  { nfts: 3, tokens: '30K', tier: 'Silver', emoji: '🥇', color: 'from-yellow-400 to-amber-500' },
  { nfts: 5, tokens: '50K', tier: 'Gold', emoji: '💎', color: 'from-cyan-400 to-blue-500' },
  { nfts: 10, tokens: '100K', tier: 'Platinum', emoji: '👑', color: 'from-purple-400 to-pink-500' },
  { nfts: 20, tokens: '200K', tier: 'VIP', emoji: '🌟', color: 'from-primary to-secondary' },
];

const PRICE_PER_NFT = 500; // USDT

export const NFTNodePanel = ({ walletConnected }) => {
  const [mintCount, setMintCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTiers, setShowTiers] = useState(false);

  const totalCost = mintCount * PRICE_PER_NFT;
  const currentTier = tiers.reduce((acc, t) => (mintCount >= t.nfts ? t : acc), tiers[0]);

  const handleMint = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 3000));
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center relative overflow-hidden"
        style={{ boxShadow: '0 0 60px hsl(340 80% 65% / 0.15)' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative"
        >
          <Crown size={56} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2 relative">
          NFT Node Minting
        </h2>
        <p className="text-muted-foreground text-sm relative">
          500 USDT per Node • 10,000 MYBUBU per Node • 10% monthly release
        </p>
      </motion.div>

      {/* Mint Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-6"
      >
        {/* Current Tier Display */}
        <div className="text-center">
          <motion.div
            key={currentTier.tier}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${currentTier.color} text-white font-display font-bold text-sm mb-2`}
          >
            {currentTier.emoji} {currentTier.tier} — {currentTier.tokens} MYBUBU
          </motion.div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMintCount(Math.max(1, mintCount - 1))}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:border-primary/30 transition-all"
          >
            <Minus size={20} />
          </motion.button>

          <motion.div
            key={mintCount}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <p className="text-5xl font-display font-bold gradient-text">{mintCount}</p>
            <p className="text-xs text-muted-foreground mt-1">NFT Nodes</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMintCount(Math.min(20, mintCount + 1))}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-foreground hover:border-primary/30 transition-all"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Quick select */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[1, 2, 3, 5, 8, 13].map((n) => (
            <motion.button
              key={n}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMintCount(n)}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                mintCount === n
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              {n} NFT{n > 1 ? 's' : ''}
            </motion.button>
          ))}
        </div>

        {/* Cost summary */}
        <div className="glass-card p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price per NFT</span>
            <span className="text-foreground font-medium">500 USDT</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quantity</span>
            <span className="text-foreground font-medium">{mintCount}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="text-foreground font-semibold">Total Cost</span>
            <motion.span
              key={totalCost}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-display font-bold text-lg text-primary"
            >
              {totalCost.toLocaleString()} USDT
            </motion.span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total MYBUBU</span>
            <span className="text-secondary font-bold">{(mintCount * 10000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Claim</span>
            <span className="text-secondary font-bold">{(mintCount * 1000).toLocaleString()} / month</span>
          </div>
        </div>
      </motion.div>

      {/* Mint Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleMint}
        disabled={!walletConnected || isProcessing}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
        style={{ boxShadow: 'var(--shadow-glow)' }}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
            Minting...
          </span>
        ) : !walletConnected ? (
          'Connect Wallet First'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Gem size={18} />
            Mint {mintCount} NFT{mintCount > 1 ? 's' : ''} for {totalCost.toLocaleString()} USDT
          </span>
        )}
      </motion.button>

      {/* Tier Reference */}
      <motion.button
        onClick={() => setShowTiers(!showTiers)}
        className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        {showTiers ? 'Hide' : 'View'} All Reward Tiers ✨
      </motion.button>

      <AnimatePresence>
        {showTiers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.tier}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-card p-3 text-center hover:border-primary/30 transition-all ${
                    mintCount >= tier.nfts ? 'border-primary/40' : ''
                  }`}
                >
                  <span className="text-2xl">{tier.emoji}</span>
                  <p className="font-display font-bold text-xs text-foreground mt-1">{tier.tier}</p>
                  <p className="text-xs text-muted-foreground">{tier.nfts} Node{tier.nfts > 1 ? 's' : ''}</p>
                  <p className="text-sm font-bold text-primary">{tier.tokens} MYBUBU</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
