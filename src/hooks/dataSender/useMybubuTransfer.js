import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_TOKEN_ABI, ACTIVE_CHAIN_ID } from '@/config/contracts';

const mybubuTokenAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBUBU_TOKEN;

/**
 * Hook to transfer MYBUBU tokens to a recipient address.
 * Uses the standard ERC-20 transfer(address, uint256) function.
 */
export const useMybubuTransfer = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  /**
   * @param {string} toAddress - Recipient wallet address
   * @param {string} amount - Human-readable token amount (e.g. "1" or "2")
   */
  const transferMybubu = (toAddress, amount) => {
    const amountParsed = parseUnits(amount, 18);
    writeContract({
      address: mybubuTokenAddress,
      abi: MYBOO_TOKEN_ABI,
      functionName: 'transfer',
      args: [toAddress, amountParsed],
    });
  };

  return {
    transferMybubu,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
