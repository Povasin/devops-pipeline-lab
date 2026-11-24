import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const products = [
  { id: 1, name: 'Desk lamp', category: 'lighting' },
  { id: 2, name: 'Side table', category: 'furniture' },
  { id: 3, name: 'Floor lamp', category: 'lighting' },
];

export function filterProducts(category) {
  return category === null ? products : products.filter((item) => item.category === category);
}

export function createCatalogServer() {
  return createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const body = request.method === 'GET' && url.pathname === '/health' ? { ok: true }
      : request.method === 'GET' && url.pathname === '/products' ? filterProducts(url.searchParams.get('category'))
      : null;

    response.writeHead(body === null ? 404 : 200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body ?? { error: 'Not found' }));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createCatalogServer();
  server.listen(8080, '0.0.0.0', () => console.log('Catalog API listening on port 8080'));
  process.on('SIGTERM', () => server.close());
}
