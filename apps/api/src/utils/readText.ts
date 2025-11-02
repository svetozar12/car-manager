import { readFile } from 'node:fs/promises';

export async function readText(relPath: string) {
  const url = new URL(relPath, import.meta.url); // relative to this file
  return await readFile(url, 'utf8');
}
