import { createPublicClient, fallback, http, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { CONTRACT_ADDRESS, CONTRACT_ABI, PUBLIC_RPC_URLS } from './constants';
import tokenHashes from './token-hashes.json';

// Token hashes are written once at mint and never change, so they are
// snapshotted at build time (npm run sync-hashes) and served without any RPC.
const snapshot = tokenHashes as Record<string, string>;

let client: PublicClient | undefined;

// Create a viem public client for reading blockchain data.
// Created lazily so RPC_URL is read at request time (Worker vars/secrets).
export function getPublicClient(): PublicClient {
  if (!client) {
    const urls = [process.env.RPC_URL, ...PUBLIC_RPC_URLS].filter(
      (url): url is string => !!url
    );
    client = createPublicClient({
      chain: mainnet,
      transport: fallback(
        urls.map((url) => http(url, { timeout: 5_000, retryCount: 0 }))
      ),
    });
  }
  return client;
}

// Helper function to get token hash
export async function getTokenHash(tokenId: number): Promise<string> {
  const known = snapshot[tokenId];
  if (known) return known;

  // Only reached for tokens minted after the last snapshot
  const hash = await getPublicClient().readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'tokenHash',
    args: [BigInt(tokenId)],
  });
  if (!/^0x[0-9a-f]{64}$/i.test(hash)) {
    throw new Error(`Unexpected tokenHash for token ${tokenId}`);
  }
  return hash;
}
