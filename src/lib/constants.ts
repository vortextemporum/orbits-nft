// Contract and base configuration
export const CONTRACT_ADDRESS = '0x290841bA121462F90EA527849Bd5302C50B6AFB5' as const;
export const BASE_URI = process.env.NEXT_PUBLIC_BASE_URI || 'https://orbitsnft.art';

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
] as const;

// RPC configuration
export const RPC_URL = process.env.RPC_URL || 'https://eth.llamarpc.com';

// Collection constants
export const TOTAL_SUPPLY = 363;
