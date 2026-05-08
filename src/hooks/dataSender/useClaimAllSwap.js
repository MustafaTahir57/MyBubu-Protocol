import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, SWAP_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const swapAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].SWAP;

/**
 * Calls claimAll() on the SWAP contract — claims all currently-vested
 * MYBUBU across the user's swap entries.
 */
export const useClaimAllSwap = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const claimAll = () => {
    writeContract({
      address: swapAddress,
      abi: SWAP_ABI,
      functionName: 'claimAll',
      args: [],
    });
  };

  return {
    claimAll,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
