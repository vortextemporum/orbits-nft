import { createPublicClient, http, getContract } from 'viem';
import { mainnet } from 'viem/chains';
import { CONTRACT_ADDRESS, CONTRACT_ABI, RPC_URL } from './constants';

// Create a viem public client for reading blockchain data
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(RPC_URL),
});

// Get contract instance
export const contract = getContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  client: publicClient,
});

// Helper function to get token hash
export async function getTokenHash(tokenId: number | string): Promise<string> {
  const hash = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'tokenHash',
    args: [BigInt(tokenId)],
  });
  return hash as string;
}
