import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, NFT_NODE_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const nftNodeAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].NFT_NODE;

export const useClaimDividends = () => {
  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const claim = () => {
    writeContract({
      address: nftNodeAddress,
      abi: NFT_NODE_ABI,
      functionName: 'claimDividends',
      args: [],
    });
  };

  return { claim, isPending, isConfirming, isConfirmed, error, reset, txHash };
};
