import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, NFT_NODE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

export const useClaimableBNB = (userAddress) => {
  const { data: claimableRaw, refetch, isLoading } = useReadContract({
    address: nftNodeAddress,
    abi: NFT_NODE_ABI,
    functionName: 'getClaimableBNBForAddress',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const claimable = claimableRaw !== undefined ? formatUnits(claimableRaw, 18) : '0';
  const hasClaimable = claimableRaw !== undefined && claimableRaw > 0n;

  return { claimableRaw, claimable, hasClaimable, refetch, isLoading };
};
