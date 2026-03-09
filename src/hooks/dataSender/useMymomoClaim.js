import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYMOMO_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mymomoAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYMOMO_Token;

/**
 * Reads getTotalClaimable(address) and calls claimMymomo() on the MYMOMO contract.
 */
export const useMymomoClaim = (userAddress) => {
  // Read claimable amount
  const { data: claimableRaw, refetch: refetchClaimable } = useReadContract({
    address: mymomoAddress,
    abi: MYMOMO_ABI,
    functionName: 'getTotalClaimable',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const claimable = claimableRaw !== undefined ? formatUnits(claimableRaw, 18) : '0';
  const hasClaimable = claimableRaw !== undefined && claimableRaw > 0n;

  // Write: claimMymomo
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
    claimable,
    hasClaimable,
    claim,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
    refetchClaimable,
  };
};
