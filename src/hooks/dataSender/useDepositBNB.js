import { useSendTransaction, useWaitForTransactionReceipt, useBalance, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, ACTIVE_CHAIN_ID } from '@/config/contracts';

const depositAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].DEPOSIT_BNB;

export const useDepositBNB = () => {
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const {
    sendTransaction,
    data: txHash,
    isPending,
    error,
    reset,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const deposit = (amountInBNB) => {
    sendTransaction({
      to: depositAddress,
      value: parseEther(amountInBNB),
    });
  };

  const bnbBalance = balanceData ? Number(balanceData.value) / 1e18 : 0;

  const hasEnoughBNB = (amount) => {
    const num = parseFloat(amount) || 0;
    return num > 0 && bnbBalance >= num;
  };

  return {
    deposit,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
    bnbBalance,
    hasEnoughBNB,
  };
};
