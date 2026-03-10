import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import {
  CONTRACT_ADDRESSES,
  MYBUBU_ABI,
  ACTIVE_CHAIN_ID,
} from "@/config/contracts";

export const useMyBubuBalance = (address) => {
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID].MYBUBU_TOKEN,
    abi: MYBUBU_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const mybubuBalance = data ? formatUnits(data, 18) : "0.00";

  return {
    mybubuBalance,
    refetch,
  };
};
