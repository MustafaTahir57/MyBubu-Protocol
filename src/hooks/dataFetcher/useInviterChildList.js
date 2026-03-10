import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, MYBUBU_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

export const useInviterChildList = (address) => {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBUBU_TOKEN,
    abi: MYBUBU_ABI,
    functionName: 'getInviterChildList',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const referralCount = data ? data?.length : 0;

  return { referralCount, isLoading, refetch };
};
