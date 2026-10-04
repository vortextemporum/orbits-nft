import { createFileRoute } from '@tanstack/react-router';
import { getTokenHash } from '@/lib/contract';
import { parseTokenId } from '@/lib/constants';

// Never echo request input into these pages - they are served as HTML.
function messagePage(title: string, message: string, status: number) {
  return new Response(
    `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh">
  <h1>${message}</h1>
</body>
</html>`,
    {
      status,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }
  );
}

export const Route = createFileRoute('/generator/$tokenId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // Validate token ID
        const id = parseTokenId(params.tokenId);
        if (id === null) {
          return messagePage('Token Not Found', 'Token not found', 404);
        }

        let hash: string;
        try {
          hash = await getTokenHash(id);
        } catch (error) {
          console.error('Error fetching token hash:', error);
          return messagePage('Error', `Error loading token #${id}`, 500);
        }

        // Return minimal HTML page with p5.js scripts
        // This matches the original generator.jade exactly
        const html = `<!DOCTYPE html>
<html>
<head>
  <title>orbits #${id}</title>
  <link rel="stylesheet" href="/style.css" />
  <script>window.tokenHash = "${hash}";</script>
</head>
<body id="generator" style="margin:0;padding:0;overflow:hidden;background:#000">
  <script src="/javascripts/p5.min.js"></script>
  <script src="/javascripts/chroma.min.js"></script>
  <script src="/javascripts/orbits.js"></script>
</body>
</html>`;

        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            // The hash never changes once minted
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          },
        });
      },
    },
  },
});
