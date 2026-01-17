import { NextRequest, NextResponse } from 'next/server';
import { getTokenHash } from '@/lib/contract';
import { getAttributes } from '@/lib/metadata';
import { BASE_URI, TOTAL_SUPPLY } from '@/lib/constants';
import ipfsHashes from '@/lib/ipfs-hashes.json';

// Type for IPFS hashes
const hashes = ipfsHashes as Record<string, string>;

// Simple in-memory cache for metadata
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

// Get IPFS image URL for a token
function getImageUrl(tokenId: string): string {
  const hash = hashes[tokenId];
  if (hash) {
    // Use IPFS gateway URL
    return `https://ipfs.io/ipfs/${hash}`;
  }
  // Fallback to animation URL if no thumbnail exists
  return `${BASE_URI}/generator/${tokenId}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate token ID
  const tokenId = parseInt(id, 10);
  if (isNaN(tokenId) || tokenId < 0 || tokenId >= TOTAL_SUPPLY) {
    return NextResponse.json({ error: 'Invalid token ID' }, { status: 404 });
  }

  // Check cache
  const cached = cache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // Get token hash from blockchain
    const hash = await getTokenHash(tokenId);

    if (!hash) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    // Generate attributes using the same logic as the original
    const [attributes] = getAttributes(hash);

    // Build metadata object (matching original structure for OpenSea compatibility)
    const metadata = {
      name: `orbits - #${id}`,
      description: `In 2019, I was heavily influenced by Alexai Shulgin's "Form Art", and one of my first generative visual works using p5.js was, orbiting html radio buttons on browser. The live sketch can be viewed at my website "https://berkozdemir.com/", and SuperRare (as radiOrbit #1 and #2). "orbits" is the updated version, rewritten for on-chain generative art purposes; which displays a unique combination of varying object shapes, color palettes & distribution, orbit directions & speeds for every mint. You can click on canvas and move in x-axis to change the overall spinning speed. Love y'all, xoxo`,
      license: `YOUR orbits, YOUR CALL. If you own an orbits NFT, you are fully permitted to do whatever you want with it (including both non-commercial/commercial uses). You can even do paid fortune telling with it lol. Also, creative derivative works are highly encouraged.`,
      image: getImageUrl(id),
      animation_url: `${BASE_URI}/generator/${id}`,
      token_uri: `${BASE_URI}/api/token/${id}`,
      external_url: `${BASE_URI}/generator/${id}`,
      script_type: 'p5js',
      aspect_ratio: '1',
      attributes,
      hash,
    };

    // Update cache
    cache.set(id, { data: metadata, timestamp: Date.now() });

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}
