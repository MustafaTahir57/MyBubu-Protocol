import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Coins, ShoppingCart, Crown, Wallet } from 'lucide-react';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import mybubuLogo from '@/assets/mybubu-logo.png';
import { JoinPanel } from '@/components/app/JoinPanel';
import { DepositBNBPanel } from '@/components/app/DepositBNBPanel';
import { BuyTokensPanel } from '@/components/app/BuyTokensPanel';
import { NFTNodePanel } from '@/components/app/NFTNodePanel';
import { MyBooPanel } from '@/components/app/MyBooPanel';
import { UserStatsBar } from '@/components/app/UserStatsBar';
import { WalletModal } from '@/components/app/WalletModal';
import { bscTestnet } from '@/config/wagmi';

const tabs = [
  { id: 'myboo', label: 'MyBoo Token', icon: ShoppingCart, emoji: '🚀' },
  { id: 'join', label: 'Join', icon: Users, emoji: '🤝' },
  { id: 'deposit', label: 'Deposit BNB', icon: Coins, emoji: '💰' },
  { id: 'buy', label: 'Buy Tokens', icon: ShoppingCart, emoji: '🛒' },
  { id: 'nft', label: 'NFT Nodes', icon: Crown, emoji: '👑' },
];

const AppDashboard = () => {
  const [activeTab, setActiveTab] = useState('myboo');
  const [isJoined, setIsJoined] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Auto-switch to BSC Testnet if wrong chain
  useEffect(() => {
    if (isConnected && chain && chain.id !== bscTestnet.id) {
      switchChain?.({ chainId: bscTestnet.id });
    }
  }, [isConnected, chain, switchChain]);

  const walletConnected = isConnected;
  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  const handleJoinSuccess = () => {
    setIsJoined(true);
    setActiveTab('deposit');
  };

  const handleWalletClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      setWalletModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="sticky top-0 z-50 glass-card border-0 border-b border-border/50"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <img src={mybubuLogo} alt="MyBubu" className="w-8 h-8" />
            <span className="font-display text-lg font-bold gradient-text">MYBUBU</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWalletClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isConnected
                ? 'glass-card border-primary/50 text-primary'
                : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground'
            }`}
          >
            <Wallet size={16} />
            {isConnected ? shortAddress : 'Connect Wallet'}
            {isConnected && chain && chain.id !== bscTestnet.id && (
              <span className="text-xs text-destructive ml-1">⚠️ Wrong Network</span>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Stats Bar */}
      <UserStatsBar isJoined={isJoined} walletConnected={walletConnected} address={address} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8 justify-center"
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isLocked = tab.id !== 'myboo';
            
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => !isLocked && setActiveTab(tab.id)}
                disabled={isLocked}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                    : isLocked
                    ? 'glass-card text-muted-foreground/50 cursor-not-allowed'
                    : 'glass-card text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
                style={isActive ? { boxShadow: 'var(--shadow-glow-sm)' } : {}}
              >
                <span className="text-lg">{tab.emoji}</span>
                {tab.label}
                {isLocked && (
                  <span className="text-xs ml-1">🔒 Soon</span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary -z-10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {activeTab === 'myboo' && (
              <MyBooPanel walletConnected={walletConnected} />
            )}
            {activeTab === 'join' && (
              <JoinPanel
                isJoined={isJoined}
                onJoinSuccess={handleJoinSuccess}
                walletConnected={walletConnected}
              />
            )}
            {activeTab === 'deposit' && (
              <DepositBNBPanel walletConnected={walletConnected} />
            )}
            {activeTab === 'buy' && (
              <BuyTokensPanel walletConnected={walletConnected} />
            )}
            {activeTab === 'nft' && (
              <NFTNodePanel walletConnected={walletConnected} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </div>
  );
};

export default AppDashboard;
