import { copyFile, mkdir } from 'node:fs/promises';

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await copyFile(new URL('../app/catalog.mjs', import.meta.url), new URL('../dist/catalog.mjs', import.meta.url));
