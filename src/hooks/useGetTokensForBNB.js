import { useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, MYBUBU_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

export const useGetTokensForBNB = (bnbAmount) => {
  const parsedAmount = bnbAmount && parseFloat(bnbAmount) > 0
    ? parseEther(bnbAmount)
    : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES[bscTestnet.id].MYBUBU_PRESALE,
    abi: MYBUBU_PRESALE_ABI,
    functionName: 'getTokensForBNB',
    args: parsedAmount ? [parsedAmount] : undefined,
    query: {
      enabled: !!parsedAmount,
    },
  });

  return {
    tokensOut: data,
    isLoading,
    error,
    refetch,
  };
};
