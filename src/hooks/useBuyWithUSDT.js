import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBUBU_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

export const useBuyWithUSDT = () => {
  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const buyWithUSDT = (usdtAmount) => {
    const parsedAmount = parseUnits(usdtAmount, 18);
    writeContract({
      address: CONTRACT_ADDRESSES[bscTestnet.id].MYBUBU_PRESALE,
      abi: MYBUBU_PRESALE_ABI,
      functionName: 'buyWithUSDT',
      args: [parsedAmount],
    });
  };

  return {
    buyWithUSDT,
    isPending,
    isConfirming,
    isConfirmed,
    txHash,
    error,
    reset,
  };
};
