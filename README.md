# orbits NFT - Next.js Edition

A modern rewrite of the orbits generative NFT collection website, migrated from Heroku/Express to Next.js for Cloudflare Pages deployment.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Blockchain**: viem for Ethereum interaction
- **Rendering**: p5.js for generative art
- **Deployment**: Cloudflare Pages (via OpenNext)

## Features

- **Generator Page** (`/generator/[tokenId]`): Renders the p5.js generative art for each token
- **Metadata API** (`/api/token/[id]`): Returns OpenSea-compatible JSON metadata
- **Homepage**: Showcases random tokens with project information

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server locally
npm run start
```

## Deployment to Cloudflare Pages

### Option 1: Direct Cloudflare Pages (Recommended)

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - Build command: `npm run build`
   - Build output directory: `.next`
3. Add environment variables in Cloudflare dashboard:
   - `RPC_URL` - Your Ethereum RPC endpoint (e.g., Infura, Alchemy)
   - `NEXT_PUBLIC_BASE_URI` - Your production URL

### Option 2: Using OpenNext Adapter

```bash
# Build for Cloudflare Workers
npm run cf:build

# Test locally with Wrangler
npm run cf:dev

# Deploy to Cloudflare
npm run cf:deploy
```

## Environment Variables

Create a `.env.local` file:

```env
# Server-side only
RPC_URL=https://eth.llamarpc.com

# Client-side
NEXT_PUBLIC_CONTRACT_ADDRESS=0x290841bA121462F90EA527849Bd5302C50B6AFB5
NEXT_PUBLIC_BASE_URI=https://orbitsnft.art
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout with fonts/meta
│   ├── globals.css           # Global styles
│   ├── generator/
│   │   └── [tokenId]/
│   │       └── page.tsx      # p5.js visualization
│   └── api/
│       └── token/
│           └── [id]/
│               └── route.ts  # Metadata API
└── lib/
    ├── constants.ts          # Contract address, ABI
    ├── contract.ts           # viem client setup
    └── metadata.ts           # Trait generation

public/
└── javascripts/
    ├── orbits.js             # Original p5.js script
    ├── p5.min.js             # p5.js library
    └── chroma.min.js         # Color library
```

## Contract

- **Address**: `0x290841bA121462F90EA527849Bd5302C50B6AFB5`
- **Network**: Ethereum Mainnet
- **Total Supply**: 1024 tokens (all minted)

## Original Project

Based on [vortextemporum/orbits-nft](https://github.com/vortextemporum/orbits-nft)

## License

CC BY-SA 4.0 (Attribution-ShareAlike)
