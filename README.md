# orbits NFT

Website, generator and metadata API for the orbits generative NFT collection, running on Cloudflare Workers.

## Tech Stack

- **Framework**: TanStack Start (TanStack Router + Vite), React 19
- **Styling**: Tailwind CSS 4
- **Blockchain**: viem for Ethereum interaction
- **Rendering**: p5.js for generative art
- **Deployment**: Cloudflare Workers (via `@cloudflare/vite-plugin`, dev and preview run in workerd)

## Features

- **Generator** (`/generator/[tokenId]`): Renders the p5.js generative art for each token
- **Metadata API** (`/api/token/[id]`): Returns OpenSea-compatible JSON metadata
- **Homepage**: Showcases random tokens with project information

## Development

```bash
npm install

npm run dev        # Vite dev server on http://localhost:3000 (server code runs in workerd)
npm run preview    # Production build served by the local Workers runtime
npm run lint
npm run typecheck
```

## Deployment

```bash
npm run deploy
```

Builds with Vite and deploys the Worker defined in `wrangler.jsonc` (custom domains `orbitsnft.art` and `www.orbitsnft.art`).

## Token hashes and RPC

A token's hash is fixed at mint, so all hashes are snapshotted in `src/lib/token-hashes.json` and the Worker serves existing tokens without any RPC call.

RPC is only used by `npm run sync-hashes` and, at runtime, for a token missing from the snapshot. Endpoints are tried in order: `RPC_URL` (if set), then the keyless public endpoints in `PUBLIC_RPC_URLS` (`src/lib/constants.ts`).

If more tokens are minted, bump `TOTAL_SUPPLY` in `src/lib/constants.ts`, then run:

```bash
npm run sync-hashes           # refresh src/lib/token-hashes.json
npm run generate-thumbnails   # needs PINATA_JWT and a running dev server
```

## Environment Variables

All optional. Locally, put Worker vars in `.dev.vars` and script vars in `.env.local`.

| Variable | Where | Purpose |
| --- | --- | --- |
| `RPC_URL` | Worker secret (`npx wrangler secret put RPC_URL`), `.env.local` for scripts | Keyed Ethereum RPC, tried before the public fallbacks |
| `BASE_URI` | Worker var (`vars` in `wrangler.jsonc`) | Base URL used in metadata (default `https://orbitsnft.art`) |
| `PINATA_JWT` | `.env.local` | Only for `generate-thumbnails` |

## Project Structure

```
src/
├── router.tsx                          # Router factory
├── start.ts                            # Global request middleware (security headers)
├── styles.css                          # Tailwind + fonts
├── routes/
│   ├── __root.tsx                      # Root document, head/meta
│   ├── index.tsx                       # Homepage
│   ├── generator/$tokenId.ts           # p5.js generator page (server route)
│   └── api/token/$id.ts                # Metadata API (server route)
└── lib/
    ├── constants.ts                    # Contract address, ABI, RPC endpoints
    ├── contract.ts                     # Token hash lookup (snapshot + viem fallback)
    ├── metadata.ts                     # Trait generation
    ├── token-hashes.json               # On-chain token hash snapshot
    └── ipfs-hashes.json                # Thumbnail CIDs

public/
├── _headers                            # Cache headers for static assets
└── javascripts/                        # orbits.js, p5.min.js, chroma.min.js
```

## Contract

- **Address**: `0x290841bA121462F90EA527849Bd5302C50B6AFB5`
- **Network**: Ethereum Mainnet
- **Supply**: 363 minted (max 1024, minting paused)

## Original Project

Based on [vortextemporum/orbits-nft](https://github.com/vortextemporum/orbits-nft)

## License

CC BY-SA 4.0 (Attribution-ShareAlike)
