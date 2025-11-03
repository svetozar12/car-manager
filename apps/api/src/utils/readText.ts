import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'url';
const importMetaUrl = pathToFileURL(__filename).href;
export async function readText(relPath: string) {
  const url = new URL(relPath, importMetaUrl); // relative to this file
  return await readFile(url, 'utf8');
}
