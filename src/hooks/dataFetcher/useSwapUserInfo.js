import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, SWAP_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const swapAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].SWAP;

/**
 * Reads getUserInfo(user) from the SWAP contract.
 * Returns: _hasSwapped, _swapCount, _myBooSwapped, _mybubuAllocated,
 * _mybubuClaimed, _mybubuClaimableNow, _mybubuPending
 */
export const useSwapUserInfo = (address) => {
  const { data, refetch, isLoading } = useReadContract({
    address: swapAddress,
    abi: SWAP_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const hasSwapped = data ? data[0] : false;
  const swapCount = data ? Number(data[1]) : 0;
  const myBooSwappedRaw = data ? data[2] : 0n;
  const mybubuAllocatedRaw = data ? data[3] : 0n;
  const mybubuClaimedRaw = data ? data[4] : 0n;
  const claimableNowRaw = data ? data[5] : 0n;
  const pendingRaw = data ? data[6] : 0n;

  console.log("data ", data, mybubuClaimedRaw)

  return {
    hasSwapped,
    swapCount,
    myBooSwapped: data ? formatUnits(myBooSwappedRaw, 18) : '0',
    mybubuAllocated: data ? formatUnits(mybubuAllocatedRaw, 18) : '0',
    mybubuClaimed: data ? formatUnits(mybubuClaimedRaw, 18) : '0',
    claimableNow: data ? formatUnits(claimableNowRaw, 18) : '0',
    pending: data ? formatUnits(pendingRaw, 18) : '0',
    claimableNowRaw,
    pendingRaw,
    refetch,
    isLoading,
  };
};
