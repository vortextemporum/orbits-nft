// Contract and base configuration
export const CONTRACT_ADDRESS = '0x290841bA121462F90EA527849Bd5302C50B6AFB5' as const;

// Server only: read at request time, when Worker vars are available
export function getBaseUri(): string {
  return process.env.BASE_URI || 'https://orbitsnft.art';
}

// Minimal ABI - only what we need for reading token data
export const CONTRACT_ABI = [
  {
    inputs: [{ type: 'uint256', name: 'tokenId' }],
    name: 'tokenHash',
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hasSaleStarted',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Keyless public RPC endpoints, tried in order after RPC_URL (if set).
// Public endpoints come and go, so never rely on a single one.
export const PUBLIC_RPC_URLS = [
  'https://ethereum-rpc.publicnode.com',
  'https://eth.drpc.org',
  'https://mainnet.gateway.tenderly.co',
  'https://rpc.mevblocker.io',
] as const;

// Collection constants
export const TOTAL_SUPPLY = 363;

// Strict token ID parsing: digits only, within supply. Returns null if invalid.
export function parseTokenId(raw: string): number | null {
  if (!/^(0|[1-9]\d{0,5})$/.test(raw)) return null;
  const id = Number(raw);
  return id < TOTAL_SUPPLY ? id : null;
}
