import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://127.0.0.1:8080';

async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200, path);
  return response.json();
}

assert.deepEqual(await get('/health'), { ok: true });
assert.deepEqual((await get('/products?category=lighting')).map((item) => item.id), [1, 3]);
assert.deepEqual((await get('/products')).map((item) => item.id), [1, 2, 3]);
console.log('CAT-17: health and both HTTP contracts passed');
