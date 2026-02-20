import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, USDT_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

export const useUSDTApproval = (ownerAddress, usdtAmount) => {
  const addresses = CONTRACT_ADDRESSES[bscTestnet.id];
  const parsedAmount = usdtAmount && parseFloat(usdtAmount) > 0
    ? parseUnits(usdtAmount, 18)
    : 0n;

  // Read USDT balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: addresses.USDT,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: ownerAddress ? [ownerAddress] : undefined,
    query: { enabled: !!ownerAddress },
  });

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: addresses.USDT,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: ownerAddress ? [ownerAddress, addresses.MYBUBU_PRESALE] : undefined,
    query: { enabled: !!ownerAddress },
  });

  // Write: approve
  const { writeContract: approve, data: approveTxHash, isPending: isApproving } = useWriteContract();

  const { isLoading: isWaitingApproval, isSuccess: approvalConfirmed } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  });

  const hasEnoughBalance = balance !== undefined && parsedAmount > 0n && balance >= parsedAmount;
  const hasEnoughAllowance = allowance !== undefined && parsedAmount > 0n && allowance >= parsedAmount;
  const needsApproval = hasEnoughBalance && !hasEnoughAllowance;

  const approveUSDT = () => {
    approve({
      address: addresses.USDT,
      abi: USDT_ABI,
      functionName: 'approve',
      args: [addresses.MYBUBU_PRESALE, parsedAmount],
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
    approveUSDT,
    isApproving: isApproving || isWaitingApproval,
    approvalConfirmed,
    refetch,
  };
};
