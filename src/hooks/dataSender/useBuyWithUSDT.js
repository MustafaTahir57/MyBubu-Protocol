import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const presaleAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBOO_PRESALE;

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
