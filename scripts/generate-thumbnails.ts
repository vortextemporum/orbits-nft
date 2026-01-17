/**
 * Thumbnail Generation Script
 *
 * Generates 1000x1000 thumbnails for all 363 orbits tokens
 * and uploads them to Pinata IPFS in a dedicated group.
 *
 * Usage:
 *   1. Set PINATA_JWT in .env.local (get it from https://app.pinata.cloud/developers/api-keys)
 *   2. Start the dev server: npm run dev
 *   3. Run: npm run generate-thumbnails
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { PinataSDK } from 'pinata';
import puppeteer from 'puppeteer';
import * as fs from 'fs';

const TOTAL_SUPPLY = 363;
const THUMBNAIL_SIZE = 1000;
const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../thumbnails');
const HASHES_FILE = path.join(__dirname, '../src/lib/ipfs-hashes.json');
const GROUP_ID_FILE = path.join(__dirname, '../.pinata-group-id');
const GROUP_NAME = 'orbits-thumbnails';

// Pinata JWT configuration
const PINATA_JWT = process.env.PINATA_JWT;

if (!PINATA_JWT) {
  console.error('Error: PINATA_JWT must be set in environment');
  console.error('Get your JWT from https://app.pinata.cloud/developers/api-keys');
  console.error('Add it to .env.local: PINATA_JWT=your_jwt_here');
  process.exit(1);
}

interface IpfsHashes {
  [tokenId: string]: string;
}

// Initialize Pinata SDK
const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
});

async function getOrCreateGroup(): Promise<string> {
  // Check if we have a saved group ID
  if (fs.existsSync(GROUP_ID_FILE)) {
    const savedGroupId = fs.readFileSync(GROUP_ID_FILE, 'utf-8').trim();
    console.log(`Using existing group: ${savedGroupId}`);
    return savedGroupId;
  }

  // List existing groups to see if our group already exists
  console.log('Checking for existing group...');
  try {
    const groups = await pinata.groups.public.list();
    const existingGroup = groups.groups?.find((g: { name: string }) => g.name === GROUP_NAME);
    if (existingGroup) {
      console.log(`Found existing group: ${existingGroup.id}`);
      fs.writeFileSync(GROUP_ID_FILE, existingGroup.id);
      return existingGroup.id;
    }
  } catch (error) {
    console.log('Could not list groups, will create new one');
  }

  // Create new group
  console.log(`Creating new group: ${GROUP_NAME}`);
  const group = await pinata.groups.public.create({
    name: GROUP_NAME,
  });
  console.log(`Created group: ${group.id}`);
  fs.writeFileSync(GROUP_ID_FILE, group.id);
  return group.id;
}

async function uploadToPinata(filePath: string, name: string, groupId: string): Promise<string> {
  const fileContent = fs.readFileSync(filePath);
  const blob = new Blob([fileContent], { type: 'image/png' });
  const file = new File([blob], name, { type: 'image/png' });

  const upload = await pinata.upload.public
    .file(file)
    .group(groupId);

  return upload.cid;
}

async function main() {
  console.log('Starting thumbnail generation...');
  console.log(`Total tokens: ${TOTAL_SUPPLY}`);
  console.log(`Thumbnail size: ${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}`);
  console.log('');

  // Get or create the group
  const groupId = await getOrCreateGroup();
  console.log(`Using group ID: ${groupId}`);
  console.log('');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Load existing hashes if any
  let hashes: IpfsHashes = {};
  if (fs.existsSync(HASHES_FILE)) {
    hashes = JSON.parse(fs.readFileSync(HASHES_FILE, 'utf-8'));
    console.log(`Loaded ${Object.keys(hashes).length} existing hashes`);
  }

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE });

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let tokenId = 0; tokenId < TOTAL_SUPPLY; tokenId++) {
    // Skip if already processed
    if (hashes[tokenId.toString()]) {
      console.log(`[${tokenId}/${TOTAL_SUPPLY - 1}] Skipping (already uploaded): ${hashes[tokenId.toString()]}`);
      skipCount++;
      continue;
    }

    const filePath = path.join(OUTPUT_DIR, `${tokenId}.png`);

    try {
      // Navigate to generator page
      console.log(`[${tokenId}/${TOTAL_SUPPLY - 1}] Loading generator page...`);
      await page.goto(`${BASE_URL}/generator/${tokenId}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Wait for p5.js canvas to render (give it a few seconds)
      await page.waitForSelector('canvas', { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 3000)); // Extra time for animation to stabilize

      // Take screenshot
      console.log(`[${tokenId}/${TOTAL_SUPPLY - 1}] Taking screenshot...`);
      await page.screenshot({
        path: filePath,
        type: 'png',
        clip: {
          x: 0,
          y: 0,
          width: THUMBNAIL_SIZE,
          height: THUMBNAIL_SIZE,
        },
      });

      // Upload to Pinata
      console.log(`[${tokenId}/${TOTAL_SUPPLY - 1}] Uploading to Pinata (group: ${groupId})...`);
      const ipfsHash = await uploadToPinata(filePath, `orbits-${tokenId}.png`, groupId);
      hashes[tokenId.toString()] = ipfsHash;

      console.log(`[${tokenId}/${TOTAL_SUPPLY - 1}] Success: ipfs://${ipfsHash}`);
      successCount++;

      // Save progress after each successful upload
      fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2));

      // Clean up local file to save space (optional)
      // fs.unlinkSync(filePath);

    } catch (error) {
      console.error(`[${tokenId}/${TOTAL_SUPPLY - 1}] Error:`, error);
      errorCount++;
    }

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await browser.close();

  // Final save
  fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2));

  console.log('');
  console.log('=== Generation Complete ===');
  console.log(`Successful: ${successCount}`);
  console.log(`Skipped: ${skipCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total hashes saved: ${Object.keys(hashes).length}`);
  console.log(`Hashes file: ${HASHES_FILE}`);
  console.log(`Pinata Group ID: ${groupId}`);
}

main().catch(console.error);
