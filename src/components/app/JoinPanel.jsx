import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle2, Copy, Check, ArrowRight, Shield, Sparkles } from 'lucide-react';

const DEFAULT_REFERRER = '0x0000000000000000000000000000000000000000';

export const JoinPanel = ({ isJoined, onJoinSuccess, walletConnected }) => {
  const [referrerAddress, setReferrerAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: enter referrer, 2: confirm & send token

  const handleCopy = () => {
    navigator.clipboard.writeText('0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = async () => {
    setIsProcessing(true);
    // Simulate blockchain transaction
    await new Promise((r) => setTimeout(r, 2500));
    setIsProcessing(false);
    onJoinSuccess();
  };

  if (isJoined) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
        style={{ boxShadow: '0 0 60px hsl(340 80% 65% / 0.15)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 size={64} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">
          Welcome to MYBUBU! 🎉
        </h2>
        <p className="text-muted-foreground mb-6">
          You've successfully joined the ecosystem. Share your referral link to earn rewards!
        </p>
        <div className="glass-card p-4 flex items-center gap-2 mb-4">
          <code className="text-xs text-primary flex-1 truncate">
            https://mybubu.io/ref/0x1a2b...9f8e
          </code>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} className="text-muted-foreground" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Earn up to 5% on Level 1 referrals!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: '0 0 60px hsl(340 80% 65% / 0.1)' }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <UserPlus size={48} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">
          Join MYBUBU Ecosystem
        </h2>
        <p className="text-muted-foreground text-sm">
          Send 1 MYBUBU token to activate your membership and start earning
        </p>
      </motion.div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2].map((s) => (
          <motion.div
            key={s}
            className={`flex items-center gap-2 ${s <= step ? 'text-primary' : 'text-muted-foreground/40'}`}
          >
            <motion.div
              animate={s === step ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                s < step
                  ? 'bg-primary border-primary text-primary-foreground'
                  : s === step
                  ? 'border-primary text-primary'
                  : 'border-muted text-muted-foreground/40'
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </motion.div>
            {s < 2 && (
              <div className={`w-12 h-0.5 ${s < step ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Step 1: Referrer Address */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground">Inviter Address</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your inviter's wallet address. If you don't have one, a default address will be used.
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="0x... (Inviter wallet address)"
              value={referrerAddress}
              onChange={(e) => setReferrerAddress(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles size={12} className="text-secondary" />
            Leave empty to use default referrer
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep(2)}
            disabled={!walletConnected}
            className="w-full py-3 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ boxShadow: walletConnected ? 'var(--shadow-glow-sm)' : 'none' }}
          >
            {!walletConnected ? 'Connect Wallet First' : 'Continue'}
            {walletConnected && <ArrowRight size={16} />}
          </motion.button>
        </motion.div>
      )}

      {/* Step 2: Confirm & Send Token */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-secondary" />
            <h3 className="font-display font-semibold text-foreground">Confirm Membership</h3>
          </div>

          <div className="glass-card p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Referrer</span>
              <span className="text-primary font-mono text-xs">
                {referrerAddress ? `${referrerAddress.slice(0, 8)}...${referrerAddress.slice(-6)}` : 'Default'}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Join Fee</span>
              <span className="text-foreground font-bold">1 MYBUBU</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network</span>
              <span className="text-secondary font-medium">BSC Mainnet</span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-medium text-sm glass-card text-muted-foreground hover:text-foreground transition-all"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={isProcessing}
              className="flex-[2] py-3 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-70 transition-all relative overflow-hidden"
              style={{ boxShadow: 'var(--shadow-glow-sm)' }}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Joining...
                </span>
              ) : (
                '🤝 Join & Send 1 MYBUBU'
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {[
          { emoji: '🔗', title: '10-Level Referrals', desc: 'Earn up to 5% on referrals' },
          { emoji: '💎', title: 'NFT Boost', desc: 'Up to 18x reward multiplier' },
        ].map((item) => (
          <div key={item.title} className="glass-card p-4 flex items-start gap-3 hover:border-primary/30 transition-all">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
