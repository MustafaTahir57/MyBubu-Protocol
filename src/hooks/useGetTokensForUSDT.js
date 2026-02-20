import { useReadContract } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBUBU_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

export const useGetTokensForUSDT = (usdtAmount) => {
  const parsedAmount = usdtAmount && parseFloat(usdtAmount) > 0
    ? parseUnits(usdtAmount, 18)
    : undefined;

  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES[bscTestnet.id].MYBUBU_PRESALE,
    abi: MYBUBU_PRESALE_ABI,
    functionName: 'getTokensForUSDT',
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
