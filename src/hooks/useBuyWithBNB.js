import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, MYBUBU_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

export const useBuyWithBNB = () => {
  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const buyWithBNB = (bnbAmount) => {
    const parsedAmount = parseEther(bnbAmount);
    writeContract({
      address: CONTRACT_ADDRESSES[bscTestnet.id].MYBUBU_PRESALE,
      abi: MYBUBU_PRESALE_ABI,
      functionName: 'buyWithBNB',
      value: parsedAmount,
    });
  };

  return {
    buyWithBNB,
    isPending,
    isConfirming,
    isConfirmed,
    txHash,
    error,
    reset,
  };
};
