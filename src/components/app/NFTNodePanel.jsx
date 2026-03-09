import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Gem, Plus, Minus, Gift } from 'lucide-react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { toast } from 'react-toastify';
import { useUSDTApproval } from '@/hooks/dataSender/useUSDTApproval';
import { useNFTNodeMint } from '@/hooks/dataSender/useNFTNodeMint';
import { useClaimTokenRewards } from '@/hooks/dataSender/useClaimTokenRewards';
import { usePendingTokenRewards } from '@/hooks/dataFetcher/usePendingTokenRewards';
import { useTokenRewardInfo } from '@/hooks/dataFetcher/useTokenRewardInfo';
import { CONTRACT_ADDRESSES, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

const tiers = [
  { nfts: 1, tokens: '10K', tier: 'Starter', emoji: '🥉', color: 'from-amber-600 to-amber-800' },
  { nfts: 2, tokens: '20K', tier: 'Bronze', emoji: '🥈', color: 'from-slate-400 to-slate-600' },
  { nfts: 3, tokens: '30K', tier: 'Silver', emoji: '🥇', color: 'from-yellow-400 to-amber-500' },
  { nfts: 5, tokens: '50K', tier: 'Gold', emoji: '💎', color: 'from-cyan-400 to-blue-500' },
  { nfts: 10, tokens: '100K', tier: 'Platinum', emoji: '👑', color: 'from-purple-400 to-pink-500' },
  { nfts: 20, tokens: '200K', tier: 'VIP', emoji: '🌟', color: 'from-primary to-secondary' },
];

const PRICE_PER_NFT = 500;

export const NFTNodePanel = ({ walletConnected }) => {
  const [mintCount, setMintCount] = useState(1);
  const [showTiers, setShowTiers] = useState(false);
  const { address } = useAccount();

  const totalCost = mintCount * PRICE_PER_NFT;
  const currentTier = tiers.reduce((acc, t) => (mintCount >= t.nfts ? t : acc), tiers[0]);

  // USDT approval for NFT_NODE contract
  const {
    balance: usdtBalance,
    hasEnoughBalance,
    hasEnoughAllowance,
    needsApproval,
    handleApprove,
    isApproving,
    approveConfirmed,
    approveError,
    resetApprove,
    refetch: refetchApproval,
  } = useUSDTApproval(address, String(totalCost), nftNodeAddress);

  // Mint hook
  const {
    mint,
    isPending: isMinting,
    isConfirming: isMintConfirming,
    isConfirmed: mintConfirmed,
    error: mintError,
    reset: resetMint,
  } = useNFTNodeMint();

  // Claim hooks
  const { pending, hasPending, refetch: refetchPending } = usePendingTokenRewards(address);
  const { nftBalance, lifetimeClaimed, refetch: refetchRewardInfo } = useTokenRewardInfo(address);
  const {
    claim,
    isPending: isClaiming,
    isConfirming: isClaimConfirming,
    isConfirmed: claimConfirmed,
    error: claimError,
    reset: resetClaim,
  } = useClaimTokenRewards();

  // After approval confirmed → auto-mint
  useEffect(() => {
    if (approveConfirmed) {
      toast.success('✅ USDT approved! Minting now...');
      refetchApproval();
      mint(mintCount);
      resetApprove();
    }
  }, [approveConfirmed]);

  // After mint confirmed
  useEffect(() => {
    if (mintConfirmed) {
      toast.success(`🎉 Successfully minted ${mintCount} NFT Node(s)!`);
      refetchApproval();
      refetchPending();
      refetchRewardInfo();
      resetMint();
    }
  }, [mintConfirmed]);

  // After claim confirmed
  useEffect(() => {
    if (claimConfirmed) {
      toast.success('🎉 MYBUBU rewards claimed!');
      refetchPending();
      refetchRewardInfo();
      resetClaim();
    }
  }, [claimConfirmed]);

  // Error toasts
  useEffect(() => {
    if (approveError) toast.error('Approval failed: ' + (approveError.shortMessage || approveError.message));
  }, [approveError]);
  useEffect(() => {
    if (mintError) toast.error('Mint failed: ' + (mintError.shortMessage || mintError.message));
  }, [mintError]);
  useEffect(() => {
    if (claimError) toast.error('Claim failed: ' + (claimError.shortMessage || claimError.message));
  }, [claimError]);

  const handleMintClick = () => {
    if (needsApproval) {
      handleApprove();
    } else if (hasEnoughAllowance && hasEnoughBalance) {
      mint(mintCount);
    }
  };

  const isProcessing = isApproving || isMinting || isMintConfirming;
  const formattedBalance = usdtBalance !== undefined ? parseFloat(formatUnits(usdtBalance, 18)).toFixed(2) : '0.00';

  const getMintButtonText = () => {
    if (!walletConnected) return 'Connect Wallet First';
    if (isApproving) return 'Approving USDT...';
    if (isMinting || isMintConfirming) return 'Minting...';
    if (!hasEnoughBalance) return `Insufficient USDT (${formattedBalance})`;
    if (needsApproval) return `Approve ${totalCost.toLocaleString()} USDT`;
    return `Mint ${mintCount} NFT${mintCount > 1 ? 's' : ''} for ${totalCost.toLocaleString()} USDT`;
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

      {/* User Stats */}
      {walletConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-4 grid grid-cols-2 gap-4"
        >
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Your NFT Nodes</p>
            <p className="font-display font-bold text-2xl gradient-text">{nftBalance}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Lifetime Claimed</p>
            <p className="font-display font-bold text-2xl gradient-text">
              {parseFloat(lifetimeClaimed).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </motion.div>
      )}

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
          <motion.div key={mintCount} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
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
            <span className="text-muted-foreground">USDT Balance</span>
            <span className="text-foreground font-medium">{formattedBalance} USDT</span>
          </div>
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
            <motion.span key={totalCost} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-display font-bold text-lg text-primary">
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
        onClick={handleMintClick}
        disabled={!walletConnected || isProcessing || !hasEnoughBalance}
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
            {getMintButtonText()}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Gem size={18} />
            {getMintButtonText()}
          </span>
        )}
      </motion.button>

      {/* Claimable MYBUBU Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 space-y-4"
      >
        <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Gift size={20} className="text-primary" />
          Claimable MYBUBU Rewards
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Pending Rewards</span>
          <span className="font-display font-bold text-xl gradient-text">
            {parseFloat(pending).toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={claim}
          disabled={!walletConnected || !hasPending || isClaiming || isClaimConfirming}
          className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-secondary to-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isClaiming || isClaimConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              Claiming...
            </span>
          ) : (
            `Claim ${parseFloat(pending).toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU`
          )}
        </motion.button>
      </motion.div>

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
