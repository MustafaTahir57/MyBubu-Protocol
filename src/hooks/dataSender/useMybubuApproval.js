import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBUBU_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mybubuAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBUBU_TOKEN;
const mymomoAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYMOMO_Token;

/**
 * Manages MYBUBU token approval for the MYMOMO contract.
 * Checks balance, allowance, and provides an approve function.
 */
export const useMybubuApproval = (userAddress, amount) => {
  const amountParsed = amount && parseFloat(amount) > 0
    ? parseUnits(amount, 18)
    : 0n;

  // Read MYBUBU balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: mybubuAddress,
    abi: MYBUBU_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  // Read current allowance to MYMOMO contract
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: mybubuAddress,
    abi: MYBUBU_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, mymomoAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  const formattedBalance = balance !== undefined ? formatUnits(balance, 18) : '0';
  const hasEnoughBalance = balance !== undefined && balance >= amountParsed;
  const hasEnoughAllowance = allowance !== undefined && allowance >= amountParsed;
  const needsApproval = hasEnoughBalance && !hasEnoughAllowance && amountParsed > 0n;

  // Write: approve
  const {
    writeContract: approve,
    data: approveTxHash,
    isPending: isApproving,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const { isLoading: isWaitingApproval, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveTxHash });

  const handleApprove = () => {
    approve({
      address: mybubuAddress,
      abi: MYBUBU_ABI,
      functionName: 'approve',
      args: [mymomoAddress, amountParsed],
    });
  };

  const refetch = () => {
    refetchBalance();
    refetchAllowance();
  };

  return {
    balance,
    formattedBalance,
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
