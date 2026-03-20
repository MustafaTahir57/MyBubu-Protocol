import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, NFT_NODE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

/**
 * Calls mintBatch(quantity) on the NFT_NODE contract.
 */
export const useNFTNodeMint = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const mint = (quantity) => {
    writeContract({
      address: nftNodeAddress,
      abi: NFT_NODE_ABI,
      functionName: 'mintBatch',
      args: [BigInt(quantity)],
    });
  };

  return {
    mint,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
    txHash,
  };
};
