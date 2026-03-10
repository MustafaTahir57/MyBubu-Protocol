import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import {
  UserPlus,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Shield,
  Sparkles,
  Send,
  Users,
} from "lucide-react";
import { useMybubuTransfer } from "@/hooks/dataSender/useMybubuTransfer";
import { useUserInfo } from "@/hooks/dataFetcher/useUserInfo";
import { useMyBubuBalance } from "@/hooks/dataFetcher/useMyBubuBalance";
import { toast } from "react-toastify";

export const JoinPanel = ({ isJoined, onJoinSuccess, walletConnected }) => {
  const [mode, setMode] = useState("join"); // 'join' or 'invite'
  const [referrerAddress, setReferrerAddress] = useState("");
  const [inviteAddress, setInviteAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const { address } = useAccount();
  const { mybubuBalance } = useMyBubuBalance(address);

  // Join transfer (1 MYBUBU)
  const {
    transferMybubu: joinTransfer,
    isPending: joinPending,
    isConfirming: joinConfirming,
    isConfirmed: joinConfirmed,
    error: joinError,
    reset: joinReset,
  } = useMybubuTransfer();

  // Invite transfer (2 MYBUBU)
  const {
    transferMybubu: inviteTransfer,
    isPending: invitePending,
    isConfirming: inviteConfirming,
    isConfirmed: inviteConfirmed,
    error: inviteError,
    reset: inviteReset,
  } = useMybubuTransfer();

  // Join success
  useEffect(() => {
    if (joinConfirmed) {
      toast.success("🎉 Successfully joined MYBUBU!");
      onJoinSuccess();
      joinReset();
    }
  }, [joinConfirmed]);

  // Invite success
  useEffect(() => {
    if (inviteConfirmed) {
      toast.success("🎉 Invite sent! 2 MYBUBU transferred.");
      setInviteAddress("");
      inviteReset();
    }
  }, [inviteConfirmed]);

  // Error handling
  useEffect(() => {
    if (joinError) {
      toast.error(joinError.shortMessage || "Join transaction failed");
      joinReset();
    }
  }, [joinError]);

  useEffect(() => {
    if (inviteError) {
      toast.error(inviteError.shortMessage || "Invite transaction failed");
      inviteReset();
    }
  }, [inviteError]);

  const handleCopyReferral = () => {
    if (address) {
      navigator.clipboard.writeText(`https://mybubu.io/ref/${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = () => {
    if (
      !referrerAddress ||
      !referrerAddress.startsWith("0x") ||
      referrerAddress.length !== 42
    ) {
      toast.error("Please enter a valid upline wallet address");
      return;
    }
    if (parseFloat(mybubuBalance) < 1) {
      toast.error("Insufficient MYBUBU balance. You need at least 1 MYBUBU.");
      return;
    }
    joinTransfer(referrerAddress, "1");
  };

  const handleInvite = () => {
    if (
      !inviteAddress ||
      !inviteAddress.startsWith("0x") ||
      inviteAddress.length !== 42
    ) {
      toast.error("Please enter a valid wallet address to invite");
      return;
    }
    if (parseFloat(mybubuBalance) < 2) {
      toast.error("Insufficient MYBUBU balance. You need at least 2 MYBUBU.");
      return;
    }
    inviteTransfer(inviteAddress, "2");
  };

  const joinIsProcessing = joinPending || joinConfirming;
  const inviteIsProcessing = invitePending || inviteConfirming;

  const getJoinButtonText = () => {
    if (joinPending) return "Opening Wallet...";
    if (joinConfirming) return "Confirming...";
    return "🤝 Join & Send 1 MYBUBU";
  };

  const getInviteButtonText = () => {
    if (invitePending) return "Opening Wallet...";
    if (inviteConfirming) return "Confirming...";
    return "📨 Send Invite (2 MYBUBU)";
  };

  // --- Already joined view: show Invite + Referral ---
  if (isJoined) {
    return (
      <div className="space-y-6">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
          style={{ boxShadow: "0 0 60px hsl(340 80% 65% / 0.15)" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 size={64} className="mx-auto text-primary mb-4" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold gradient-text mb-2">
            Welcome to MYBUBU! 🎉
          </h2>
          <p className="text-muted-foreground mb-4">
            You've joined the ecosystem. Invite others and earn referral
            rewards!
          </p>

          {/* Balance */}
          <div className="glass-card p-3 inline-flex items-center gap-2 rounded-xl mb-4">
            <span className="text-xs text-muted-foreground">
              Your MYBUBU:
            </span>
            <span className="text-sm font-bold text-primary">
              {parseFloat(mybubuBalance).toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-3"
        >
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Your Referral Link
            </h3>
          </div>
          <div className="glass-card p-4 flex items-center gap-2">
            <code className="text-xs text-primary flex-1 truncate">
              {address
                ? `https://mybubu.io/ref/${address.slice(0, 10)}...${address.slice(-8)}`
                : "---"}
            </code>
            <button
              onClick={handleCopyReferral}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              {copied ? (
                <Check size={16} className="text-primary" />
              ) : (
                <Copy size={16} className="text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this link. When someone joins using your address, you earn
            referral rewards!
          </p>
        </motion.div>

        {/* Invite someone (send 2 MYBUBU) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Send size={20} className="text-secondary" />
            <h3 className="font-display font-semibold text-foreground">
              Invite a Friend
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Send 2 MYBUBU tokens to invite someone into the ecosystem directly.
          </p>
          <input
            type="text"
            placeholder="0x... (Friend's wallet address)"
            value={inviteAddress}
            onChange={(e) => setInviteAddress(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <div className="glass-card p-3 flex justify-between text-sm">
            <span className="text-muted-foreground">Cost</span>
            <span className="text-foreground font-bold">2 MYBUBU</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleInvite}
            disabled={inviteIsProcessing || !walletConnected}
            className="w-full py-3 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
            style={{ boxShadow: "var(--shadow-glow-sm)" }}
          >
            {inviteIsProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
                {getInviteButtonText()}
              </span>
            ) : (
              getInviteButtonText()
            )}
          </motion.button>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {[
            {
              emoji: "🔗",
              title: "10-Level Referrals",
              desc: "Earn up to 5% on referrals",
            },
            {
              emoji: "💎",
              title: "NFT Boost",
              desc: "Up to 18x reward multiplier",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass-card p-4 flex items-start gap-3 hover:border-primary/30 transition-all"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  }

  // --- Not joined: Join flow ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: "0 0 60px hsl(340 80% 65% / 0.1)" }}
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
          Send 1 MYBUBU token to your upline to activate your membership
        </p>
        {/* Balance */}
        <div className="glass-card p-3 inline-flex items-center gap-2 rounded-xl mt-4">
          <span className="text-xs text-muted-foreground">
            Your MYBUBU:
          </span>
          <span className="text-sm font-bold text-primary">
            {parseFloat(mybubuBalance).toFixed(2)}
          </span>
        </div>
      </motion.div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2].map((s) => (
          <motion.div
            key={s}
            className={`flex items-center gap-2 ${s <= step ? "text-primary" : "text-muted-foreground/40"}`}
          >
            <motion.div
              animate={s === step ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                s < step
                  ? "bg-primary border-primary text-primary-foreground"
                  : s === step
                    ? "border-primary text-primary"
                    : "border-muted text-muted-foreground/40"
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </motion.div>
            {s < 2 && (
              <div
                className={`w-12 h-0.5 ${s < step ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Step 1: Upline Address */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground">
              Upline Address
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the wallet address of the person who invited you. 1 MYBUBU
            will be sent to them.
          </p>
          <input
            type="text"
            placeholder="0x... (Upline wallet address)"
            value={referrerAddress}
            onChange={(e) => setReferrerAddress(e.target.value)}
            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (
                !referrerAddress ||
                !referrerAddress.startsWith("0x") ||
                referrerAddress.length !== 42
              ) {
                toast.error("Please enter a valid upline wallet address");
                return;
              }
              setStep(2);
            }}
            disabled={!walletConnected}
            className="w-full py-3 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              boxShadow: walletConnected ? "var(--shadow-glow-sm)" : "none",
            }}
          >
            {!walletConnected ? "Connect Wallet First" : "Continue"}
            {walletConnected && <ArrowRight size={16} />}
          </motion.button>
        </motion.div>
      )}

      {/* Step 2: Confirm & Send */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-secondary" />
            <h3 className="font-display font-semibold text-foreground">
              Confirm Membership
            </h3>
          </div>

          <div className="glass-card p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Upline</span>
              <span className="text-primary font-mono text-xs">
                {`${referrerAddress.slice(0, 8)}...${referrerAddress.slice(-6)}`}
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
              <span className="text-secondary font-medium">BSC</span>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(1)}
              disabled={joinIsProcessing}
              className="flex-1 py-3 rounded-xl font-medium text-sm glass-card text-muted-foreground hover:text-foreground transition-all"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={joinIsProcessing}
              className="flex-[2] py-3 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-70 transition-all relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-glow-sm)" }}
            >
              {joinIsProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  {getJoinButtonText()}
                </span>
              ) : (
                getJoinButtonText()
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
          {
            emoji: "🔗",
            title: "10-Level Referrals",
            desc: "Earn up to 5% on referrals",
          },
          {
            emoji: "💎",
            title: "NFT Boost",
            desc: "Up to 18x reward multiplier",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="glass-card p-4 flex items-start gap-3 hover:border-primary/30 transition-all"
          >
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
