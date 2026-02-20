import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, USDT_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

const usdtAddress = CONTRACT_ADDRESSES[bscTestnet.id].USDT;
const presaleAddress = CONTRACT_ADDRESSES[bscTestnet.id].MYBOO_PRESALE;

/**
 * Manages USDT approval for the presale contract.
 * Checks balance, allowance, and provides an approve function.
 * @param {string} userAddress - Connected wallet address
 * @param {string} usdtAmount - Human-readable USDT amount to approve (e.g. "100")
 */
export const useUSDTApproval = (userAddress, usdtAmount) => {
  const amountParsed = usdtAmount && parseFloat(usdtAmount) > 0
    ? parseUnits(usdtAmount, 18)
    : 0n;

  // Read USDT balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: usdtAddress,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdtAddress,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, presaleAddress] : undefined,
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
    useWaitForTransactionReceipt({
      hash: approveTxHash,
    });

  const handleApprove = () => {
    approve({
      address: usdtAddress,
      abi: USDT_ABI,
      functionName: 'approve',
      args: [presaleAddress, amountParsed],
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
