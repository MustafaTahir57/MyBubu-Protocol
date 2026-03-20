import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, NFT_NODE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

/**
 * Calls claimTokenRewards() on the NFT_NODE contract.
 */
export const useClaimTokenRewards = () => {
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
      address: nftNodeAddress,
      abi: NFT_NODE_ABI,
      functionName: 'claimTokenRewards',
      args: [],
    });
  };

  return {
    claim,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
    txHash,
  };
};
