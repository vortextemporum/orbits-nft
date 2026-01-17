'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TOTAL_SUPPLY = 363;

export default function HomePage() {
  const [showcaseId, setShowcaseId] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Generate random token ID on client side to avoid hydration mismatch
    setShowcaseId(Math.floor(Math.random() * TOTAL_SUPPLY));
    setIsLoaded(true);
  }, []);

  const refreshShowcase = () => {
    setShowcaseId(Math.floor(Math.random() * TOTAL_SUPPLY));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="py-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          orbits NFTs
        </h1>
        <p className="text-xl text-center mt-4 text-gray-300">
          a humble generative art nft project no one asked for
        </p>
        <p className="text-lg text-center mt-2 text-gray-400">
          by{' '}
          <a
            href="https://berkozdemir.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-400 transition-colors"
          >
            berk
          </a>
        </p>
      </header>

      {/* Showcase Section */}
      <section className="flex flex-col items-center justify-center px-4 py-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-black rounded-lg overflow-hidden">
            {isLoaded && (
              <iframe
                key={showcaseId}
                src={`/generator/${showcaseId}`}
                className="w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
                title={`orbits #${showcaseId}`}
              />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <p className="text-lg text-gray-300">
            orbits #{showcaseId}
          </p>
          <button
            onClick={refreshShowcase}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
          >
            Random
          </button>
          <Link
            href={`/generator/${showcaseId}`}
            target="_blank"
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm"
          >
            Full Screen
          </Link>
        </div>
      </section>

      {/* Status */}
      <section className="py-8 px-4 text-center">
        <p className="text-xl text-gray-300">
          {TOTAL_SUPPLY} orbits minted &middot;{' '}
          <a
            href="https://opensea.io/collection/orbits-nft"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 underline"
          >
            OpenSea
          </a>
        </p>
      </section>

      {/* About Section */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <p className="text-gray-300 leading-relaxed">
            orbits is a generative art NFT collection using p5.js. Each token displays a unique combination
            of varying object shapes, color palettes, orbit directions & speeds. Click on canvas and move
            in x-axis to change the spinning speed.
          </p>
          <p className="text-gray-300 leading-relaxed mt-4">
            Related works:{' '}
            <a href="https://superrare.com/artwork-v2/radiorbit-1-6925" className="text-red-500 hover:underline" target="_blank" rel="noopener noreferrer">
              radiOrbit #1
            </a>
            {' '}&middot;{' '}
            <a href="https://superrare.com/artwork-v2/radiorbit-2-8346" className="text-red-500 hover:underline" target="_blank" rel="noopener noreferrer">
              radiOrbit #2
            </a>
          </p>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <a
              href="https://opensea.io/collection/orbits-nft"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" viewBox="0 0 90 90" fill="currentColor">
                <path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.701 34.911 46.935C34.839 47.034 34.713 47.088 34.587 47.088H22.491C22.167 47.088 21.987 46.737 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.134 52.677 36.936 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.302 46.944 40.878 45.846 41.337 44.739C41.454 44.478 41.544 44.205 41.634 43.941C41.778 43.479 41.922 43.044 42.03 42.609C42.138 42.228 42.228 41.829 42.318 41.454C42.543 40.347 42.651 39.186 42.651 37.989C42.651 37.521 42.633 37.035 42.597 36.576C42.579 36.072 42.516 35.568 42.453 35.064C42.408 34.632 42.327 34.209 42.246 33.768C42.138 33.147 42.003 32.535 41.841 31.923L41.787 31.707C41.661 31.278 41.553 30.867 41.409 30.438C40.977 29.034 40.473 27.675 39.933 26.406C39.717 25.884 39.483 25.38 39.24 24.885C38.88 24.138 38.511 23.454 38.169 22.806C38.007 22.5 37.863 22.221 37.719 21.942C37.557 21.636 37.395 21.321 37.233 21.024C37.116 20.808 36.981 20.61 36.891 20.412L35.892 18.63C35.775 18.423 35.964 18.171 36.198 18.234L42.417 19.89H42.435C42.453 19.89 42.462 19.899 42.471 19.899L43.254 20.115L44.109 20.367L44.388 20.448V17.01C44.388 15.351 45.729 14.001 47.38 14.001C48.205 14.001 48.949 14.337 49.485 14.886C50.021 15.435 50.349 16.179 50.349 17.01V22.176L50.985 22.356C51.039 22.374 51.093 22.401 51.147 22.437C51.327 22.572 51.588 22.779 51.912 23.022C52.164 23.22 52.434 23.463 52.758 23.715C53.397 24.237 54.144 24.876 54.936 25.605C55.152 25.785 55.359 25.974 55.557 26.163C56.574 27.09 57.699 28.134 58.77 29.295C59.062 29.61 59.346 29.934 59.64 30.276C59.934 30.618 60.246 30.951 60.504 31.293C60.858 31.761 61.239 32.256 61.557 32.76C61.713 33.003 61.896 33.255 62.043 33.507C62.502 34.254 62.88 35.019 63.24 35.784C63.384 36.108 63.528 36.459 63.636 36.801C63.96 37.737 64.212 38.691 64.347 39.645C64.392 39.825 64.419 40.023 64.428 40.203V40.257C64.473 40.527 64.491 40.815 64.491 41.112C64.491 42.12 64.365 43.11 64.095 44.073C63.96 44.577 63.798 45.063 63.591 45.567C63.384 46.053 63.168 46.548 62.898 47.016C62.493 47.808 62.025 48.573 61.494 49.284C61.332 49.527 61.143 49.779 60.954 50.022C60.756 50.283 60.549 50.526 60.36 50.76C60.09 51.093 59.811 51.435 59.514 51.741C59.253 52.074 58.983 52.398 58.695 52.695C58.281 53.163 57.885 53.595 57.471 54.009C57.222 54.288 56.955 54.567 56.679 54.819C56.421 55.089 56.154 55.332 55.905 55.557C55.485 55.944 55.134 56.241 54.837 56.484L54.225 56.994C54.117 57.078 53.973 57.123 53.829 57.123H50.349V62.172H55.377C56.634 62.172 57.828 61.71 58.788 60.867C59.121 60.576 60.555 59.319 62.223 57.537C62.277 57.474 62.349 57.429 62.43 57.402L73.917 54.063C74.178 53.982 74.376 54.216 74.376 54.477V52.812Z"/>
              </svg>
              OpenSea
            </a>
            <a
              href="https://github.com/vortextemporum/orbits-nft"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://etherscan.io/address/0x290841bA121462F90EA527849Bd5302C50B6AFB5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
              </svg>
              Etherscan
            </a>
          </div>
          <p className="text-center text-gray-500 text-sm">
            <a href="https://berkozdemir.com" className="hover:text-gray-400" target="_blank" rel="noopener noreferrer">
              berkozdemir.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
