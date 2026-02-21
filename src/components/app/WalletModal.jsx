import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useConnect } from 'wagmi';
import { useAccount } from 'wagmi';

const walletOptions = [
  {
    id: 'metaMaskSDK',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect using MetaMask browser extension',
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Scan QR code with your mobile wallet',
  },
];

export const WalletModal = ({ isOpen, onClose }) => {
  const { connectors, connect, isPending } = useConnect();
  const { isConnected , chainId } = useAccount();
  const [connectingId, setConnectingId] = useState(null);

  console.log("connectingId", connectingId , connectors)

  const handleConnect = (walletId) => {
const connector = connectors.find(c => c.id === walletId);
    if (!connector) return;

    setConnectingId(walletId);
    console.log("Connector", connector)
    connect(
      { connector },
      // {
      //   onSuccess: () => {
      //     setConnectingId(null);
      //     onClose();
      //   },
      //   onError: () => {
      //     setConnectingId(null);
      //   },
      // }
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md glass-card p-6 rounded-2xl border border-border/50 z-10"
            style={{ boxShadow: '0 0 80px hsl(340 80% 65% / 0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold gradient-text">
                Connect Wallet
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={16} />
              </motion.button>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Choose your preferred wallet to connect to BSC Testnet
            </p>

            {/* Wallet Options */}
            <div className="space-y-3">
              {walletOptions.map((wallet) => {
                const isConnecting = connectingId === wallet.id;
                return (
                  <motion.button
                    key={wallet.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {handleConnect(wallet.id)}}
                    disabled={isPending}
                    className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:border-primary/40 transition-all text-left disabled:opacity-50"
                  >
                    <span className="text-3xl">{wallet.icon}</span>
                    <div className="flex-1">
                      <p className="font-display font-bold text-foreground">
                        {wallet.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wallet.description}
                      </p>
                    </div>
                    {isConnecting && (
                      <Loader2 size={18} className="text-primary animate-spin" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <p className="text-xs text-muted-foreground/60 text-center mt-6">
              By connecting, you agree to the Terms of Service
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
