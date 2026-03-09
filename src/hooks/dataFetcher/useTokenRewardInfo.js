import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, NFT_NODE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

export const useTokenRewardInfo = (userAddress) => {
  const { data, refetch, isLoading } = useReadContract({
    address: nftNodeAddress,
    abi: NFT_NODE_ABI,
    functionName: 'getTokenRewardInfo',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const nftBalance = data ? Number(data[0]) : 0;
  const pendingClaimable = data ? formatUnits(data[1], 18) : '0';
  const lifetimeClaimed = data ? formatUnits(data[2], 18) : '0';
  const contractRewardBalance = data ? formatUnits(data[3], 18) : '0';

  return {
    nftBalance,
    pendingClaimable,
    lifetimeClaimed,
    contractRewardBalance,
    refetch,
    isLoading,
  };
};
