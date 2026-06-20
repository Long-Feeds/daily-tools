// Minimal static file server (node http) used for local integration testing.
// The homepage fetches manifest.json at runtime, so file:// won't work — tests
// (and `npm run serve`) go through this server. Runtime-agnostic ES module.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize, sep } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.txt': 'text/plain; charset=utf-8',
};

export function startServer(root, port = 0) {
  const base = normalize(root);
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        let urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        if (urlPath.endsWith('/')) urlPath += 'index.html';
        const fp = normalize(join(base, urlPath));
        if (fp !== base && !fp.startsWith(base + sep)) {
          res.writeHead(403); res.end('forbidden'); return;
        }
        let data;
        try { data = await readFile(fp); }
        catch { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }); res.end('not found: ' + urlPath); return; }
        res.writeHead(200, {
          'content-type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream',
          'cache-control': 'no-store',
        });
        res.end(data);
      } catch (e) {
        res.writeHead(500); res.end(String(e));
      }
    });
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

// `node test/server.mjs [port]` for manual local dev
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd();
  const port = Number(process.argv[2] || 8080);
  startServer(root, port).then(({ url }) => console.log('Serving', root, '→', url));
}
