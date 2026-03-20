import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, NFT_NODE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

/**
 * Reads getPendingTokenRewards(address) from the NFT_NODE contract.
 */
export const usePendingTokenRewards = (userAddress) => {
  const { data: pendingRaw, refetch, isLoading } = useReadContract({
    address: nftNodeAddress,
    abi: NFT_NODE_ABI,
    functionName: 'getPendingTokenRewards',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const pending = pendingRaw !== undefined ? formatUnits(pendingRaw, 18) : '0';
  const hasPending = pendingRaw !== undefined && pendingRaw > 0n;

  return {
    pendingRaw,
    pending,
    hasPending,
    refetch,
    isLoading,
  };
};
