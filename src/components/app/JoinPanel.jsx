import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useSearchParams } from "react-router-dom";
import {
  UserPlus,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Send,
  Users,
} from "lucide-react";
import { useMybubuTransfer } from "@/hooks/dataSender/useMybubuTransfer";
import { useMyBubuBalance } from "@/hooks/dataFetcher/useMyBubuBalance";
import { toast } from "react-toastify";

const DEFAULT_UPLINE = "0x682c5aFeD8cd7f22B1b7Bd30Aa9f16bFd58C255F";

export const JoinPanel = ({ isJoined, onJoinSuccess, walletConnected }) => {
  const [searchParams] = useSearchParams();
  const [inviteAddress, setInviteAddress] = useState("");
  const [copied, setCopied] = useState(false);

  const referrerAddress = useMemo(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl && refFromUrl.startsWith("0x") && refFromUrl.length === 42) {
      return refFromUrl;
    }
    return DEFAULT_UPLINE;
  }, [searchParams]);

  const { address } = useAccount();
  const { mybubuBalance } = useMyBubuBalance(address);

  const {
    transferMybubu: joinTransfer,
    isPending: joinPending,
    isConfirming: joinConfirming,
    isConfirmed: joinConfirmed,
    error: joinError,
    reset: joinReset,
  } = useMybubuTransfer();

  const {
    transferMybubu: inviteTransfer,
    isPending: invitePending,
    isConfirming: inviteConfirming,
    isConfirmed: inviteConfirmed,
    error: inviteError,
    reset: inviteReset,
  } = useMybubuTransfer();

  useEffect(() => {
    if (joinConfirmed) {
      toast.success("🎉 Successfully joined MYBUBU!");
      onJoinSuccess();
      joinReset();
    }
  }, [joinConfirmed]);

  useEffect(() => {
    if (inviteConfirmed) {
      toast.success("🎉 Invite sent! 2 MYBUBU transferred.");
      setInviteAddress("");
      inviteReset();
    }
  }, [inviteConfirmed]);

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
      navigator.clipboard.writeText(`https://my-bubu-protocol.vercel.app/app?ref=${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = () => {
    if (parseFloat(mybubuBalance) < 1) {
      toast.error("Insufficient MYBUBU balance. You need at least 1 MYBUBU.");
      return;
    }
    joinTransfer(referrerAddress, "1");
  };

  const handleInvite = () => {
    if (!inviteAddress || !inviteAddress.startsWith("0x") || inviteAddress.length !== 42) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: "0 0 60px hsl(340 80% 65% / 0.1)" }}
      >
        {isJoined ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold gradient-text mb-2">
              Welcome to MYBUBU! 🎉
            </h2>
            <p className="text-muted-foreground text-sm">
              You've joined the ecosystem. Invite others and earn referral rewards!
            </p>
          </>
        ) : (
          <>
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
          </>
        )}
        <div className="glass-card p-3 inline-flex items-center gap-2 rounded-xl mt-4">
          <span className="text-xs text-muted-foreground">Your MYBUBU:</span>
          <span className="text-sm font-bold text-primary">
            {parseFloat(mybubuBalance).toFixed(2)}
          </span>
        </div>
      </motion.div>

      {/* 1) Join via Upline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield size={20} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">
            Join via Upline
          </h3>
          {isJoined && (
            <span className="ml-auto text-xs text-primary font-medium flex items-center gap-1">
              <CheckCircle2 size={14} /> Joined
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Your upline address is set from your referral link. 1 MYBUBU will be sent to them.
        </p>
        <input
          type="text"
          value={referrerAddress}
          readOnly
          className="w-full bg-background/30 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground font-mono cursor-not-allowed opacity-70"
        />
        {referrerAddress === DEFAULT_UPLINE && (
          <p className="text-xs text-secondary">
            ⚠️ No referral link detected — using default address. Join via a referral link for better rewards.
          </p>
        )}
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleJoin}
          disabled={joinIsProcessing || !walletConnected || isJoined}
          className="w-full py-3 rounded-xl font-display font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden"
          style={{ boxShadow: "var(--shadow-glow-sm)" }}
        >
          {joinIsProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
              {getJoinButtonText()}
            </span>
          ) : isJoined ? (
            "✅ Already Joined"
          ) : (
            getJoinButtonText()
          )}
        </motion.button>
      </motion.div>

      {/* 2) Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
              ? `https://my-bubu-protocol.vercel.app/app?ref=${address.slice(0, 10)}...${address.slice(-8)}`
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
          Share this link. When someone joins using your address, you earn referral rewards!
        </p>
      </motion.div>

      {/* 3) Invite a Friend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
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
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {[
          { emoji: "🔗", title: "10-Level Referrals", desc: "Earn up to 5% on referrals" },
          { emoji: "💎", title: "NFT Boost", desc: "Up to 18x reward multiplier" },
        ].map((item) => (
          <div
            key={item.title}
            className="glass-card p-4 flex items-start gap-3 hover:border-primary/30 transition-all"
          >
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
