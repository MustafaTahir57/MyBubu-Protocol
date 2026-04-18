import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

export const usePresaleInfo = () => {
  const { data, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBOO_PRESALE,
    abi: MYBOO_PRESALE_ABI,
    functionName: 'getPresaleInfo',
  });

  const totalRaisedUSD = data ? parseFloat(formatUnits(data[2], 18)) : 0;
  const totalTokensSold = data ? parseFloat(formatUnits(data[5], 18)) : 0;
  const presaleActive = data ? data[6] : false;

  return { totalRaisedUSD, totalTokensSold, presaleActive, isLoading, refetch };
};
