/**
 * Token Hash Snapshot Script
 *
 * Reads tokenHash() for every minted token and writes src/lib/token-hashes.json,
 * so the deployed Worker never needs an RPC call for existing tokens.
 *
 * Usage: npm run sync-hashes   (optionally set RPC_URL in .env.local)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

dotenv.config({ path: path.join(import.meta.dirname, '../.env.local'), quiet: true });

import { getPublicClient } from '../src/lib/contract';
import { CONTRACT_ADDRESS, CONTRACT_ABI, TOTAL_SUPPLY } from '../src/lib/constants';

const HASHES_FILE = path.join(import.meta.dirname, '../src/lib/token-hashes.json');
const BATCH_SIZE = 20;

async function main() {
  const client = getPublicClient();
  const contract = { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI } as const;

  const [totalSupply, hasSaleStarted] = await Promise.all([
    client.readContract({ ...contract, functionName: 'totalSupply' }),
    client.readContract({ ...contract, functionName: 'hasSaleStarted' }),
  ]);
  console.log(`On-chain totalSupply: ${totalSupply}, minting open: ${hasSaleStarted}`);
  if (Number(totalSupply) !== TOTAL_SUPPLY) {
    console.warn(`Warning: TOTAL_SUPPLY in constants.ts is ${TOTAL_SUPPLY} - update it.`);
  }

  const hashes: Record<string, string> = {};
  for (let start = 0; start < Number(totalSupply); start += BATCH_SIZE) {
    const ids = Array.from(
      { length: Math.min(BATCH_SIZE, Number(totalSupply) - start) },
      (_, i) => start + i
    );
    const results = await Promise.all(
      ids.map((id) =>
        client.readContract({ ...contract, functionName: 'tokenHash', args: [BigInt(id)] })
      )
    );
    ids.forEach((id, i) => (hashes[id.toString()] = results[i]));
    console.log(`Fetched ${start + ids.length}/${totalSupply}`);
  }

  fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2) + '\n');
  console.log(`Wrote ${Object.keys(hashes).length} hashes to ${HASHES_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
