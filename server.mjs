import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

const server = createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const requestedFile = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const relativePath = requestedFile === 'manus-routes.json' ? 'public/manus-routes.json' : requestedFile;
    const filePath = normalize(join(root, relativePath));
    if (!filePath.startsWith(root)) throw new Error('Forbidden');
    const fileInfo = await stat(filePath);
    if (!fileInfo.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => console.log(`Myanmar Open preview listening on http://0.0.0.0:${port}`));
