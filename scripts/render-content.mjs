import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sanitizeHtml from 'sanitize-html';

const root = fileURLToPath(new URL('../', import.meta.url));
export const escapeText = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export function assertPublicText(value, label) {
  if (typeof value !== 'string' || !value.trim() || value.length > 20000) throw new Error(`${label}: enter non-empty text under 20,000 characters.`);
  if (/\bflash[\s-]?trace\b|\bTCHES\b/i.test(value)) throw new Error(`${label}: contains research currently excluded from the public website.`);
  if (value.includes('\u2014')) throw new Error(`${label}: replace the em dash with a comma, colon or full stop.`);
}
export function renderInline(value, label) {
  assertPublicText(value, label);
  // Rich-text editors wrap single text blocks in paragraphs. The template already
  // supplies the semantic element (heading, paragraph or list item).
  value = value.trim();
  if (/^<p(?:\s[^>]*)?>[\s\S]*<\/p>$/.test(value)) value = value.replace(/^<p(?:\s[^>]*)?>/, '').replace(/<\/p>$/, '').replace(/<\/p>\s*<p(?:\s[^>]*)?>/g, '<br><br>');
  if (/<\/?(?:h[1-6]|ul|ol|li|table|blockquote)\b/i.test(value)) throw new Error(`${label}: use inline text in this field; add completed theses through the supervision list.`);
  return sanitizeHtml(value, {
    allowedTags: ['strong', 'em', 'b', 'i', 'a', 'code', 'br', 'sup', 'sub'],
    allowedAttributes: { '*': ['itemprop'], a: ['href', 'title', 'target', 'rel', 'itemprop'] },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: { a: (_tag, attrs) => ({ tagName: 'a', attribs: { ...attrs, ...(attrs.target === '_blank' ? {rel:'noopener noreferrer'} : {}) } }) }
  });
}
export function renderSupervision(data) {
  assertPublicText(data.intro, 'Supervision introduction');
  assertPublicText(data.ongoing, 'Theses in progress');
  if (!Array.isArray(data.completed) || data.completed.length < 1 || data.completed.length > 100) throw new Error('Enter between 1 and 100 completed theses.');
  const entries=data.completed.map((entry,i)=>{
    assertPublicText(entry.student, `Thesis ${i+1} student`);
    assertPublicText(entry.title, `Thesis ${i+1} title`);
    if (!Number.isInteger(entry.year) || entry.year < 1950 || entry.year > new Date().getUTCFullYear()+1) throw new Error(`Thesis ${i+1}: invalid completion year.`);
    return `<li>${escapeText(entry.student)}: <em>“${escapeText(entry.title)}”</em> (${entry.year})</li>`;
  });
  return `\n            <li>${escapeText(data.intro)} Completed B.Sc. theses:\n              <ul class="bullets">\n                ${entries.join('\n                ')}\n              </ul>\n              <p>${escapeText(data.ongoing)}</p>\n            </li>\n          `;
}
export async function renderSite(base=root) {
  const definitions=JSON.parse(await readFile(path.join(base,'scripts/cms-bindings.json'),'utf8'));
  const documents=new Map();const values=new Map();
  for (const field of definitions) {
    if (!documents.has(field.file)) documents.set(field.file,JSON.parse(await readFile(path.join(base,field.file),'utf8')));
    const data=documents.get(field.file), value=data[field.field];
    let rendered;
    if(field.kind==='supervision') rendered=renderSupervision(data);
    else if(field.kind==='inline') rendered=renderInline(value,field.key);
    else {
      assertPublicText(value,field.key);
      if(field.kind==='file') {
        if(!/^\/?assets\/[a-zA-Z0-9_./ -]+\.pdf$/.test(value) || value.split('/').includes('..')) throw new Error('The CV must be a PDF in the assets folder.');
        await access(path.join(base,value.replace(/^\//,'')));
      }
      rendered=escapeText(value);
    }
    if(values.has(field.key))throw new Error(`Duplicate content key: ${field.key}`);
    values.set(field.key,rendered);
  }
  const outputs=new Map();const used=new Set();
  for(const page of await readdir(path.join(base,'templates'))) {
    if(!page.endsWith('.html'))continue;
    let html=await readFile(path.join(base,'templates',page),'utf8');
    html=html.replace(/\{\{cms:([a-z0-9_.-]+)\}\}/g,(_match,key)=>{
      if(!values.has(key))throw new Error(`${page}: missing content binding ${key}`);
      used.add(key);return values.get(key);
    });
    if(html.includes('{{cms:'))throw new Error(`${page}: unresolved content marker`);
    const seo=documents.get(`content/${page==='index.html'?'home':page.replace('.html','')}-seo.json`);
    html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_match,json)=>{
      const obj=JSON.parse(json);
      const update=item=>{
        if(item['@type']==='ProfilePage'||item['@type']==='WebPage'){item.name=seo.title;item.description=seo.description;}
        if(item['@type']==='Person'&&page==='index.html')item.description=seo.description;
        if(item['@graph'])item['@graph'].forEach(update);
      };update(obj);
      return '<script type="application/ld+json">\n'+JSON.stringify(obj,null,2).replace(/</g,'\\u003c')+'\n</script>';
    });
    outputs.set(page,html);
  }
  for(const key of values.keys())if(!used.has(key))throw new Error(`Unused content field: ${key}`);
  // Validate every page and field before replacing any generated public page.
  for(const [page,html]of outputs)await writeFile(path.join(base,page),html);
  return [...outputs.keys()];
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log('Rendered:',(await renderSite()).join(', '));
