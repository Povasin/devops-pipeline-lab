import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { createCatalogServer, filterProducts } from '../app/catalog.mjs';

test('CAT-17 unit: exact category and an unknown category', () => {
  assert.deepEqual(filterProducts('lighting').map((item) => item.id), [1, 3]);
  assert.deepEqual(filterProducts('unknown'), []);
});

test('CAT-17 integration: filter works over HTTP and old requests remain compatible', async (context) => {
  const server = createCatalogServer().listen(0, '127.0.0.1');
  context.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(`${base}/products?category=lighting`);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).map((item) => item.id), [1, 3]);
  assert.deepEqual((await (await fetch(`${base}/products`)).json()).map((item) => item.id), [1, 2, 3]);
  assert.deepEqual(await (await fetch(`${base}/products?category=unknown`)).json(), []);
});
