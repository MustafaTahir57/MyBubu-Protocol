import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, SWAP_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const swapAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].SWAP;

/**
 * Calls the swap(uint256 amount) function on the SWAP contract.
 * Amount is in human-readable MyBoo tokens (e.g. "1000").
 */
export const useSwapMyBoo = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const swapMyBoo = (mybooAmount) => {
    const amountParsed = parseUnits(mybooAmount, 18);
    writeContract({
      address: swapAddress,
      abi: SWAP_ABI,
      functionName: 'swap',
      args: [amountParsed],
    });
  };

  return {
    swapMyBoo,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
