import { motion } from 'framer-motion';
import { TrendingUp, Users, Gem, Coins } from 'lucide-react';
import { useUserInfo } from '@/hooks/useUserInfo';

export const UserStatsBar = ({ isJoined, walletConnected, address }) => {
  const { usdSpent, tokensBought } = useUserInfo(address);

  const stats = [
    { label: 'MyBoo Balance', value: parseFloat(tokensBought).toLocaleString(undefined, { maximumFractionDigits: 2 }), icon: Coins, color: 'text-primary' },
    { label: 'USD Deposited', value: parseFloat(usdSpent).toLocaleString(undefined, { maximumFractionDigits: 2 }), icon: TrendingUp, color: 'text-secondary' },
    { label: 'NFTs Owned', value: '0', icon: Gem, color: 'text-primary' },
    { label: 'Referrals', value: '0', icon: Users, color: 'text-secondary' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="container mx-auto px-4 py-4"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className="glass-card p-4 text-center group hover:border-primary/30 transition-all"
          >
            <stat.icon size={18} className={`mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} />
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className={`font-display font-bold text-lg ${stat.color}`}>
              {walletConnected ? stat.value : '—'}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
