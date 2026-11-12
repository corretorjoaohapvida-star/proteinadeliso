import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'public');
const output = resolve(root, 'dist');
const index = await readFile(resolve(source, 'index.html'), 'utf8');
if (!index.includes('https://pay.cakto.com.br/gg42ydn_1314408')) throw new Error('Checkout esperado não encontrado.');
if (!index.includes("fbq('init', '1146882501637448')")) throw new Error('Pixel esperado não encontrado.');
const files = await readdir(source, { recursive: true });
for (const path of files) {
  if (path.split(/[\\/]/).some(part => part.startsWith('.'))) throw new Error(`Arquivo oculto na pasta pública: ${path}`);
  if (/\.(env|pem|key|zip|pdf|xlsx|md)$/i.test(path)) throw new Error(`Arquivo não público encontrado: ${path}`);
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log('LP estática pronta em dist/.');
