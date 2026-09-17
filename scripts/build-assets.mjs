import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';
import { minify } from 'terser';

// Keep source files readable; commit generated assets with their HTML references.
const root = new URL('../', import.meta.url);
const css = new CleanCSS({ level: 1, rebase: false }).minify(await readFile(new URL('styles.css', root), 'utf8'));
if (css.errors.length) throw new Error(css.errors.join('\n'));
const js = await minify(await readFile(new URL('script.js', root), 'utf8'), {
  compress: true, mangle: true, format: { comments: false }
});
if (!js.code) throw new Error('JavaScript output is empty');
const outputs = [['styles.min.css', css.styles], ['script.min.js', js.code]];
const versions = {};
for (const [name, content] of outputs) {
  await writeFile(new URL(name, root), content + '\n');
  versions[name] = createHash('sha256').update(content + '\n').digest('hex').slice(0, 12);
  console.log(`${name}: ${Buffer.byteLength(content)} bytes`);
}
for (const name of await readdir(fileURLToPath(root))) {
  if (!name.endsWith('.html')) continue;
  const path = new URL(name, root);
  let html = await readFile(path, 'utf8');
  html = html.replace(/styles(?:\.min)?\.css\?v=[^"\s]+/g, `styles.min.css?v=${versions['styles.min.css']}`)
    .replace(/script(?:\.min)?\.js\?v=[^"\s]+/g, `script.min.js?v=${versions['script.min.js']}`);
  await writeFile(path, html);
}
