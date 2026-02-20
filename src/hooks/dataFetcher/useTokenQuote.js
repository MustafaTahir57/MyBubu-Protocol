import { useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, MYBOO_PRESALE_ABI } from '@/config/contracts';
import { bscTestnet } from '@/config/wagmi';

const presaleAddress = CONTRACT_ADDRESSES[bscTestnet.id].MYBOO_PRESALE;

/**
 * Fetches how many MyBoo tokens the user will receive for a given USDT amount.
 * @param {string} usdtAmount - Human-readable USDT amount (e.g. "100")
 */
export const useTokensForUSDT = (usdtAmount) => {
  const parsed = usdtAmount && parseFloat(usdtAmount) > 0
    ? parseUnits(usdtAmount, 18)
    : undefined;

  const { data, isLoading, error } = useReadContract({
    address: presaleAddress,
    abi: MYBOO_PRESALE_ABI,
    functionName: 'getTokensForUSDT',
    args: parsed ? [parsed] : undefined,
    query: { enabled: !!parsed },
  });

  return {
    tokensOut: data ? formatUnits(data, 18) : '0',
    tokensOutRaw: data,
    isLoading,
    error,
  };
};

/**
 * Fetches how many MyBoo tokens the user will receive for a given BNB amount.
 * @param {string} bnbAmount - Human-readable BNB amount (e.g. "0.1")
 */
export const useTokensForBNB = (bnbAmount) => {
  const parsed = bnbAmount && parseFloat(bnbAmount) > 0
    ? parseUnits(bnbAmount, 18)
    : undefined;

  const { data, isLoading, error } = useReadContract({
    address: presaleAddress,
    abi: MYBOO_PRESALE_ABI,
    functionName: 'getTokensForBNB',
    args: parsed ? [parsed] : undefined,
    query: { enabled: !!parsed },
  });

  return {
    tokensOut: data ? formatUnits(data, 18) : '0',
    tokensOutRaw: data,
    isLoading,
    error,
  };
};
