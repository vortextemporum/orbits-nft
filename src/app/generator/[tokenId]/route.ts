import { getTokenHash } from '@/lib/contract';
import { TOTAL_SUPPLY } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;
  const id = parseInt(tokenId, 10);

  // Validate token ID
  if (isNaN(id) || id < 0 || id >= TOTAL_SUPPLY) {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Token Not Found</title>
</head>
<body style="margin:0;padding:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh">
  <h1>Token #${tokenId} not found</h1>
</body>
</html>`,
      {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  let hash: string;
  try {
    hash = await getTokenHash(id);
  } catch (error) {
    console.error('Error fetching token hash:', error);
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
</head>
<body style="margin:0;padding:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh">
  <h1>Error loading token #${tokenId}</h1>
</body>
</html>`,
      {
        status: 500,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Return minimal HTML page with p5.js scripts
  // This matches the original generator.jade exactly
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>orbits #${tokenId}</title>
  <link rel="stylesheet" href="/style.css" />
  <script>window.tokenHash = "${hash}";</script>
</head>
<body id="generator" style="margin:0;padding:0;overflow:hidden;background:#000">
  <script src="/javascripts/p5.min.js"></script>
  <script src="/javascripts/chroma.min.js"></script>
  <script src="/javascripts/orbits.js"></script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
