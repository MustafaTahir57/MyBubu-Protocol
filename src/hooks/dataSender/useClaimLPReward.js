import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import {
  CONTRACT_ADDRESSES,
  MYBUBU_LP_REWARD_ABI,
  ACTIVE_CHAIN_ID,
} from '@/config/contracts';

const lpRewardAddress =
  CONTRACT_ADDRESSES[ACTIVE_CHAIN_ID]?.MYBUBU_LP_REWARD ||
  CONTRACT_ADDRESSES[97].MYBUBU_LP_REWARD;

/**
 * Calls claimReward() on the MYBUBU_LP_REWARD contract.
 */
export const useClaimLPReward = () => {
  const {
    writeContract,
    data: txHash,
    isPending,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const claimReward = () => {
    writeContract({
      address: lpRewardAddress,
      abi: MYBUBU_LP_REWARD_ABI,
      functionName: 'claimReward',
      args: [],
    });
  };

  return {
    claimReward,
    txHash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  };
};
