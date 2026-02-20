import { useWriteContract, useWaitForTransactionReceipt, useBalance, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

const presaleAddress = CONTRACT_ADDRESSES[bscTestnet.id].MYBOO_PRESALE;

/**
 * Handles buyWithBNB transaction on the presale contract.
 * Also checks if user has enough BNB balance.
 */
export const useBuyWithBNB = () => {
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

  const bnbBalance = balanceData ? Number(balanceData.value)/1e18 : 0;

  const hasEnoughBNB = (amount) => {
    const num = parseFloat(amount) || 0;
    return num > 0 && bnbBalance >= num;
  };

  const buyWithBNB = (bnbAmount) => {
    const valueParsed = parseEther(bnbAmount);
    writeContract({
      address: presaleAddress,
      abi: MYBOO_PRESALE_ABI,
      functionName: 'buyWithBNB',
      value: valueParsed,
    });
  };

  return {
    buyWithBNB,
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
