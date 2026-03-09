import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI, MYBOO_TOKEN_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

export const useUserInfo = (address) => {

    const { data: myBooBalance, isLoading: MyBooLoading , refetch: MyBooBalanceRefetch } = useReadContract({
    address: CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBOO_TOKEN,
    abi: MYBOO_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBOO_PRESALE,
    abi: MYBOO_PRESALE_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const usdSpent = data ? formatUnits(data[1], 18) : '0.00';
  const tokensBought = myBooBalance ? formatUnits(myBooBalance, 18) : '0.00';

  return { usdSpent, tokensBought, isLoading, refetch , MyBooBalanceRefetch };
};
