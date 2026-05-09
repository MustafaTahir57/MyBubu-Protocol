import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDownUp, Repeat, Info, Gift, Clock } from "lucide-react";
import { useAccount } from "wagmi";
import { useUserInfo } from "@/hooks/dataFetcher/useUserInfo";
import { useMyBooApproval } from "@/hooks/dataSender/useMyBooApproval";
import { useSwapMyBoo } from "@/hooks/dataSender/useSwapMyBoo";
import { useSwapUserInfo } from "@/hooks/dataFetcher/useSwapUserInfo";
import { useClaimAllSwap } from "@/hooks/dataSender/useClaimAllSwap";
import { toast } from "react-toastify";

export const BuyTokensPanel = ({ walletConnected }) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const [mybooAmount, setMybooAmount] = useState("");
  const [swapStep, setSwapStep] = useState("idle");

  const numAmount = parseFloat(mybooAmount) || 0;
  const mybubuReceived = numAmount;

  const { tokensBought, MyBooBalanceRefetch: refetchMyBooBalance } = useUserInfo(address);
  const mybooBalance = parseFloat(tokensBought) || 0;

  const approval = useMyBooApproval(address, numAmount > 0 ? mybooAmount : "0");
  const swap = useSwapMyBoo();

  const isProcessing = swapStep !== "idle";
  const isValid = numAmount > 0;

  const swapInfo = useSwapUserInfo(address);
  const claim = useClaimAllSwap();
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    if (swapInfo.claimableNowRaw === 0n || !walletConnected) return;
    setIsClaiming(true);
    claim.claimAll();
  };

  useEffect(() => {
    if (claim.isConfirmed && isClaiming) {
      setIsClaiming(false);
      claim.reset();
      swapInfo.refetch();
      toast.success(t('app.swap.claimSuccess'));
    }
  }, [claim.isConfirmed, isClaiming]);

  useEffect(() => {
    if (claim.error && isClaiming) {
      setIsClaiming(false);
      toast.error(claim.error.shortMessage || claim.error.message || t('app.swap.claimFailed'));
    }
  }, [claim.error]);


  const handleSwap = () => {
    if (!isValid || !walletConnected) return;
    if (approval.needsApproval) {
      setSwapStep("approving");
      approval.handleApprove();
    } else {
      setSwapStep("swapping");
      swap.swapMyBoo(mybooAmount);
    }
  };

  useEffect(() => {
    if (approval.approveConfirmed && swapStep === "approving") {
      approval.refetch();
      setSwapStep("swapping");
      swap.swapMyBoo(mybooAmount);
    }
  }, [approval.approveConfirmed, swapStep]);

  useEffect(() => {
    if (swap.isConfirmed && swapStep === "swapping") {
      setSwapStep("idle");
      setMybooAmount("");
      approval.refetch();
      swap.reset();
      approval.resetApprove();
      refetchMyBooBalance();
      swapInfo.refetch();
      toast.success(t('app.swap.successToast'));
    }
  }, [swap.isConfirmed, swapStep]);

  useEffect(() => {
    const err = approval.approveError || swap.error;
    if (err && swapStep !== "idle") {
      setSwapStep("idle");
      toast.error(err.shortMessage || err.message || t('app.myboo.txFailed'));
    }
  }, [approval.approveError, swap.error]);

  const getButtonContent = () => {
    if (isProcessing) {
      const stepText =
        swapStep === "approving"
          ? approval.isApproving ? t('app.swap.approving') : t('app.common.openingWallet')
          : swap.isPending ? t('app.common.openingWallet') : t('app.swap.swapping');

      return (
        <span className="flex items-center justify-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
          />
          {stepText}
        </span>
      );
    }

    if (!walletConnected) return t('app.common.connectFirst');
    if (isValid && !approval.hasEnoughBalance) return t('app.swap.insufficient');

    return (
      <span className="flex items-center justify-center gap-2">
        <Repeat size={18} />
        {approval.needsApproval ? t('app.swap.approveSwap') : t('app.swap.swapBtn')}
      </span>
    );
  };

  const isButtonDisabled =
    !walletConnected || !isValid || isProcessing ||
    (isValid && !approval.hasEnoughBalance);

  const quickAmounts =
    mybooBalance > 0
      ? [
          Math.floor(mybooBalance * 0.25),
          Math.floor(mybooBalance * 0.5),
          Math.floor(mybooBalance * 0.75),
          Math.floor(mybooBalance),
        ].filter((v) => v > 0)
      : [1000, 2500, 5000, 10000];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 text-center"
        style={{ boxShadow: "0 0 60px hsl(340 80% 65% / 0.1)" }}
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Repeat size={48} className="mx-auto text-primary mb-4" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold gradient-text mb-2">{t('app.swap.title')}</h2>
        <p className="text-muted-foreground text-sm">{t('app.swap.subtitle')}</p>
      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-4 border-primary/20 flex gap-3 items-start"
      >
        <Info size={18} className="text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">{t('app.swap.howWorks')}</span>{" "}
          {t('app.swap.howWorksDesc')}{" "}
          <span className="text-primary font-medium">{t('app.swap.migration')}</span>
          {t('app.swap.burnedMinted')}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 space-y-4"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t('app.common.youSend')}</span>
            <span className="text-xs text-muted-foreground">
              {t('app.common.balance')}:{" "}
              {walletConnected
                ? `${mybooBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} MyBoo`
                : "—"}
            </span>
          </div>
          <div className="relative bg-background/50 border border-border rounded-xl p-4">
            <input
              type="text"
              placeholder="0.00"
              value={mybooAmount}
              onChange={(e) => setMybooAmount(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-transparent text-2xl font-display font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none disabled:opacity-50"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">👻</span>
              <span className="font-bold text-sm text-foreground">MyBoo</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {quickAmounts.map((v) => (
              <motion.button
                key={v}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMybooAmount(v.toString())}
                disabled={isProcessing}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium glass-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
              >
                {v.toLocaleString()}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center border-primary/30"
          >
            <ArrowDownUp size={18} className="text-primary" />
          </motion.div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t('app.common.youReceive')}</span>
            <span className="text-xs text-muted-foreground">{t('app.swap.rate11')}</span>
          </div>
          <div className="relative bg-background/30 border border-border/50 rounded-xl p-4">
            <p className="text-2xl font-display font-bold text-primary">{mybubuReceived.toLocaleString()}</p>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-lg">🐱</span>
              <span className="font-bold text-sm text-foreground">MYBUBU</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {numAmount > 0 && !approval.hasEnoughBalance && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive text-center"
            >
              {t('app.swap.insufficientDetail', { balance: mybooBalance.toLocaleString() })}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="glass-card p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.swap.swapRatio')}</span>
            <span className="text-primary">1:1</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.common.type')}</span>
            <span className="text-secondary">{t('app.common.tokenMigration')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.common.fee')}</span>
            <span className="text-primary">0%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">{t('app.common.approval')}</span>
            <span className={approval.needsApproval ? "text-yellow-500" : "text-green-500"}>
              {numAmount > 0
                ? approval.needsApproval ? t('app.common.needsApproval') : t('app.common.approved')
                : "—"}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.button
        whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
        whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
        onClick={handleSwap}
        disabled={isButtonDisabled}
        className="w-full py-4 rounded-xl font-display font-bold text-base bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={isValid && !isButtonDisabled ? { boxShadow: "var(--shadow-glow)" } : {}}
      >
        {getButtonContent()}
      </motion.button>

      {walletConnected && swapInfo.hasSwapped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 space-y-4 border-primary/30"
          style={{ boxShadow: "0 0 60px hsl(340 80% 65% / 0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Gift size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground">{t('app.swap.claimTitle')}</h3>
              <p className="text-xs text-muted-foreground">{t('app.swap.claimSubtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/50 border border-primary/30 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Gift size={12} className="text-primary" />
                {t('app.swap.claimableNow')}
              </div>
              <p className="font-display text-lg font-bold gradient-text break-all">
                {parseFloat(swapInfo.claimableNow).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
              <p className="text-[10px] text-muted-foreground">MYBUBU</p>
            </div>

            <div className="bg-background/30 border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Clock size={12} className="text-secondary" />
                {t('app.swap.pendingVesting')}
              </div>
              <p className="font-display text-lg font-bold text-secondary break-all">
                {parseFloat(swapInfo.pending).toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
              <p className="text-[10px] text-muted-foreground">MYBUBU</p>
            </div>
          </div>

          <div className="glass-card p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('app.swap.totalAllocated')}</span>
              <span className="text-foreground font-medium">
                {parseFloat(swapInfo.mybubuAllocated).toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('app.swap.alreadyClaimed')}</span>
              <span className="text-green-500 font-medium">
                {parseFloat(swapInfo.mybubuClaimed).toLocaleString(undefined, { maximumFractionDigits: 4 })} MYBUBU
              </span>
            </div>
          </div>

          <motion.button
            whileHover={swapInfo.claimableNowRaw > 0n && !isClaiming ? { scale: 1.02 } : {}}
            whileTap={swapInfo.claimableNowRaw > 0n && !isClaiming ? { scale: 0.98 } : {}}
            onClick={handleClaim}
            disabled={swapInfo.claimableNowRaw === 0n || isClaiming || claim.isConfirming}
            className="w-full py-3 rounded-xl font-display font-bold text-sm bg-gradient-to-r from-primary to-secondary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={swapInfo.claimableNowRaw > 0n && !isClaiming ? { boxShadow: "var(--shadow-glow)" } : {}}
          >
            {isClaiming || claim.isConfirming ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
                {t('app.swap.claiming')}
              </span>
            ) : swapInfo.claimableNowRaw === 0n ? (
              t('app.swap.nothingToClaim')
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Gift size={16} />
                {t('app.swap.claimBtn')}
              </span>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
