import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import {
  CONTRACT_ADDRESSES,
  MYBUBU_LP_REWARD_ABI,
  ACTIVE_CHAIN_ID,
} from '@/config/contracts';

const lpRewardAddress =
  CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID]?.MYBUBU_LP_REWARD ||
  CONTRACT_ADDRESSES[97].MYBUBU_LP_REWARD;

/**
 * Reads the pending MYBUBU LP reward for a given user from MYBUBU_LP_REWARD contract.
 * @param {`0x${string}`|undefined} address - User wallet address
 */
export const usePendingLPReward = (address) => {
  const { data, isLoading, error, refetch } = useReadContract({
    address: lpRewardAddress,
    abi: MYBUBU_LP_REWARD_ABI,
    functionName: 'pendingReward',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 15000,
    },
  });

  const pendingRewardRaw = data ?? 0n;
  const pendingReward = data ? formatUnits(data, 18) : '0';

  return {
    pendingReward,
    pendingRewardRaw,
    isLoading,
    error,
    refetch,
  };
};
