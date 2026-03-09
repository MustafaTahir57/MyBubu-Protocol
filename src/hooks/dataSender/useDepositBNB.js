import { useWriteContract, useWaitForTransactionReceipt, useBalance, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, ACTIVE_CHAIN_ID } from '@/config/contracts';

const depositAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].DEPOSIT_BNB;
const mybubuTokenAddress = CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBUBU_TOKEN;

const DEPOSIT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const useDepositBNB = () => {
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const deposit = (amountInBNB) => {
    const amountParsed = parseEther(amountInBNB);
    writeContract({
      address: depositAddress,
      abi: DEPOSIT_ABI,
      functionName: 'transfer',
      args: [mybubuTokenAddress, amountParsed],
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
