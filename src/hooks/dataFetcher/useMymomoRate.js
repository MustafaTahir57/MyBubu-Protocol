import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MYMOMO_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mymomoAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYMOMO_Token;

/**
 * Reads getStakingStats() from the MYMOMO contract and exposes
 * the live daily reward rate as a percentage (rate / 1000).
 *
 * Contract returns _dailyRewardRate as a uint256 (e.g. 10),
 * and the displayed % is rate / 1000 (e.g. 10 -> 0.01%).
 */
export const useMymomoRate = () => {
  const { data, refetch, isLoading } = useReadContract({
    address: mymomoAddress,
    abi: MYMOMO_ABI,
    functionName: 'getStakingStats',
  });

  // data is a tuple: [_totalMybubuDeposited, _totalMymomoClaimed, _mymomoRewardPool, _mybubuToken, _dailyRewardRate, _maxStakeDuration]
  const dailyRewardRateRaw = data ? data[4] : undefined;

  const dailyRatePercent =
    dailyRewardRateRaw !== undefined ? Number(dailyRewardRateRaw) / 1000 : null;

  // Formatted display: trims trailing zeros, falls back to "0.01" style
  const dailyRatePercentLabel =
    dailyRatePercent !== null
      ? `${parseFloat(dailyRatePercent.toFixed(6))}%`
      : '—';

  // Multiplier to apply to an injected amount to get daily reward
  const dailyRewardMultiplier =
    dailyRatePercent !== null ? dailyRatePercent / 100 : 0;

  return {
    dailyRewardRateRaw,
    dailyRatePercent,
    dailyRatePercentLabel,
    dailyRewardMultiplier,
    isLoading,
    refetch,
  };
};
