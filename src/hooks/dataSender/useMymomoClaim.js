import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, MYMOMO_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mymomoAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYMOMO_Token;

/**
 * Calls claimMymomo() on the MYMOMO contract.
 */
export const useMymomoClaim = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const claim = () => {
    writeContract({
      address: mymomoAddress,
      abi: MYMOMO_ABI,
      functionName: 'claimMymomo',
      args: [],
    });
  };

  return {
    claim,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
