import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYMOMO_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mymomoAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYMOMO_Token;

/**
 * Calls depositMybubu(uint256 amount) on the MYMOMO contract.
 */
export const useMymomoDeposit = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const deposit = (amount) => {
    const amountParsed = parseUnits(amount, 18);
    writeContract({
      address: mymomoAddress,
      abi: MYMOMO_ABI,
      functionName: 'depositMybubu',
      args: [amountParsed],
    });
  };

  return {
    deposit,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
