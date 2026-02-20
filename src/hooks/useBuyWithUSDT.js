import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

const presaleAddress = CONTRACT_ADDRESSES[bscTestnet.id].MYBOO_PRESALE;

/**
 * Handles buyWithUSDT transaction on the presale contract.
 */
export const useBuyWithUSDT = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const buyWithUSDT = (usdtAmount) => {
    const amountParsed = parseUnits(usdtAmount, 18);
    writeContract({
      address: presaleAddress,
      abi: MYBOO_PRESALE_ABI,
      functionName: 'buyWithUSDT',
      args: [amountParsed],
    });
  };

  return {
    buyWithUSDT,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
