import type { ReactNode } from 'react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import appCss from '../styles.css?url'

const DESCRIPTION = 'orbits - Generative art NFT project on Ethereum'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'orbits - Generative art NFT project on Ethereum' },
      { name: 'description', content: `${DESCRIPTION}. A humble generative art nft project using p5.js.` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@berkozdemir' },
      { property: 'og:url', content: 'https://orbitsnft.art' },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:image', content: 'https://berk.mypinata.cloud/ipfs/QmVAyByLRV7ema4QqsxDcnyehWM8xgdbfeyXTdDCg8VsEv' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-black text-white">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <a href="/" className="text-pink-500 hover:text-pink-400">
        back to orbits
      </a>
    </div>
  )
}
