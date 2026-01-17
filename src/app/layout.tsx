import type { Metadata } from 'next';
import { Play, Tourney } from 'next/font/google';
import './globals.css';

const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-play',
});

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-tourney',
});

export const metadata: Metadata = {
  title: 'orbits - Generative art NFT project on Ethereum',
  description: 'orbits - Generative art NFT project on Ethereum. A humble generative art nft project using p5.js.',
  twitter: {
    card: 'summary_large_image',
    creator: '@berkozdemir',
  },
  openGraph: {
    url: 'https://orbitsnft.art',
    description: 'orbits - Generative art NFT project on Ethereum',
    images: ['https://berk.mypinata.cloud/ipfs/QmVAyByLRV7ema4QqsxDcnyehWM8xgdbfeyXTdDCg8VsEv'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${play.variable} ${tourney.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
