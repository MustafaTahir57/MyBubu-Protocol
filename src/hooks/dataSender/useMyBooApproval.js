import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_TOKEN_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mybooAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBOO_TOKEN;
const swapAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].SWAP;

/**
 * Manages MyBoo token approval for the SWAP contract.
 * Checks balance, allowance, and provides an approve function.
 */
export const useMyBooApproval = (userAddress, mybooAmount) => {
  const amountParsed = mybooAmount && parseFloat(mybooAmount) > 0
    ? parseUnits(mybooAmount, 18)
    : 0n;

  // Read MyBoo balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: mybooAddress,
    abi: MYBOO_TOKEN_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  // Read current allowance to SWAP contract
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: mybooAddress,
    abi: MYBOO_TOKEN_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, swapAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const hasEnoughBalance = balance !== undefined && balance >= amountParsed;
  const hasEnoughAllowance = allowance !== undefined && allowance >= amountParsed;
  const needsApproval = hasEnoughBalance && !hasEnoughAllowance;

  // Write: approve
  const {
    writeContract: approve,
    data: approveTxHash,
    isPending: isApproving,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  // Wait for approval tx
  const { isLoading: isWaitingApproval, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  const handleApprove = () => {
    approve({
      address: mybooAddress,
      abi: MYBOO_TOKEN_ABI,
      functionName: 'approve',
      args: [swapAddress, amountParsed],
    });
  };

  const refetch = () => {
    refetchBalance();
    refetchAllowance();
  };

  return {
    balance,
    allowance,
    hasEnoughBalance,
    hasEnoughAllowance,
    needsApproval,
    handleApprove,
    isApproving: isApproving || isWaitingApproval,
    approveConfirmed,
    approveError,
    resetApprove,
    refetch,
  };
};
