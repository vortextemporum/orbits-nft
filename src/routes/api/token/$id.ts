import { createFileRoute } from '@tanstack/react-router';
import { getTokenHash } from '@/lib/contract';
import { getAttributes } from '@/lib/metadata';
import { getBaseUri, parseTokenId } from '@/lib/constants';
import ipfsHashes from '@/lib/ipfs-hashes.json';

// Type for IPFS hashes
const hashes = ipfsHashes as Record<string, string>;

// Token metadata is derived from an immutable on-chain hash, so let
// browsers and marketplaces cache it.
const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400';

// Token metadata is public and read cross-origin by marketplaces
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
};

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: { ...CORS_HEADERS, ...init.headers },
  });
}

// Get IPFS image URL for a token
function getImageUrl(tokenId: number, baseUri: string): string {
  const hash = hashes[tokenId];
  if (hash) {
    // Use IPFS gateway URL
    return `https://ipfs.io/ipfs/${hash}`;
  }
  // Fallback to animation URL if no thumbnail exists
  return `${baseUri}/generator/${tokenId}`;
}

export const Route = createFileRoute('/api/token/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // Validate token ID
        const tokenId = parseTokenId(params.id);
        if (tokenId === null) {
          return json({ error: 'Invalid token ID' }, { status: 404 });
        }

        try {
          const baseUri = getBaseUri();

          // Get token hash (build-time snapshot, blockchain as fallback)
          const hash = await getTokenHash(tokenId);

          // Generate attributes using the same logic as the original
          const [attributes] = getAttributes(hash);

          // Build metadata object (matching original structure for OpenSea compatibility)
          const metadata = {
            name: `orbits - #${tokenId}`,
            description: `In 2019, I was heavily influenced by Alexai Shulgin's "Form Art", and one of my first generative visual works using p5.js was, orbiting html radio buttons on browser. The live sketch can be viewed at my website "https://berkozdemir.com/", and SuperRare (as radiOrbit #1 and #2). "orbits" is the updated version, rewritten for on-chain generative art purposes; which displays a unique combination of varying object shapes, color palettes & distribution, orbit directions & speeds for every mint. You can click on canvas and move in x-axis to change the overall spinning speed. Love y'all, xoxo`,
            license: `YOUR orbits, YOUR CALL. If you own an orbits NFT, you are fully permitted to do whatever you want with it (including both non-commercial/commercial uses). You can even do paid fortune telling with it lol. Also, creative derivative works are highly encouraged.`,
            image: getImageUrl(tokenId, baseUri),
            animation_url: `${baseUri}/generator/${tokenId}`,
            token_uri: `${baseUri}/api/token/${tokenId}`,
            external_url: `${baseUri}/generator/${tokenId}`,
            script_type: 'p5js',
            aspect_ratio: '1',
            attributes,
            hash,
          };

          return json(metadata, { headers: { 'Cache-Control': CACHE_CONTROL } });
        } catch (error) {
          console.error('Error fetching token:', error);
          return json({ error: 'Failed to fetch token' }, { status: 500 });
        }
      },
    },
  },
});
