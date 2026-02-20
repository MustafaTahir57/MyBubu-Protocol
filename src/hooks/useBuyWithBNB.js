import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

const presaleAddress = CONTRACT_ADDRESSES[bscTestnet.id].MYBOO_PRESALE;

/**
 * Handles buyWithBNB transaction on the presale contract.
 */
export const useBuyWithBNB = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const buyWithBNB = (bnbAmount) => {
    const valueParsed = parseEther(bnbAmount);
    writeContract({
      address: presaleAddress,
      abi: MYBOO_PRESALE_ABI,
      functionName: 'buyWithBNB',
      value: valueParsed,
    });
  };

  return {
    buyWithBNB,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
