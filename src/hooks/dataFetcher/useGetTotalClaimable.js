import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYMOMO_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mymomoAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYMOMO_Token;

/**
 * Reads getTotalClaimable(address) from the MYMOMO contract.
 */
export const useGetTotalClaimable = (userAddress) => {
  const { data: claimableRaw, refetch, isLoading } = useReadContract({
    address: mymomoAddress,
    abi: MYMOMO_ABI,
    functionName: 'getTotalClaimable',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const claimable = claimableRaw !== undefined ? formatUnits(claimableRaw, 18) : '0';
  const hasClaimable = claimableRaw !== undefined && claimableRaw > 0n;

  return {
    claimableRaw,
    claimable,
    hasClaimable,
    refetch,
    isLoading,
  };
};
