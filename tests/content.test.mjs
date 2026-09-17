import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, cp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import YAML from 'yaml';
import { renderInline, renderSupervision, assertPublicText, renderSite } from '../scripts/render-content.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));

test('editor formatting keeps inline HTML and removes executable content',()=>{
  const safe=renderInline('<p><strong>Tested silicon</strong> and <em>software</em><script>alert(1)</script><a href="javascript:alert(1)" onclick="alert(2)">link</a></p>','test');
  assert.match(safe,/<strong>Tested silicon<\/strong>/);
  assert.doesNotMatch(safe,/<p>|script|onclick|javascript:/);
  assert.throws(()=>renderInline('<ul><li>nested list</li></ul>','test'),/inline text/);
});
test('public content constraints and missing content fail clearly',()=>{
  assert.throws(()=>assertPublicText('', 'empty'),/non-empty/);
  assert.throws(()=>assertPublicText('FLASH-Trace', 'research'),/excluded/);
  assert.throws(()=>assertPublicText('One\u2014two','dash'),/em dash/);
});
test('supervision list can grow and preserves escaping and degree boundaries',()=>{
  const data={intro:'B.Sc. and M.Sc. co-supervision',completed:[{student:'Student <test>',title:'AES & RISC-V',year:2026}],ongoing:'Further B.Sc. and M.Sc. theses are in progress.'};
  const html=renderSupervision(data);assert.match(html,/Completed B.Sc. theses/);assert.match(html,/Student &lt;test&gt;/);assert.match(html,/AES &amp; RISC-V/);
  assert.match(html,/Further B.Sc. and M.Sc./);
  assert.throws(()=>renderSupervision({...data,completed:[{...data.completed[0],year:'2026'}]}),/year/);
});
test('Pages CMS fields correspond to existing content and renderer bindings',async()=>{
  const config=YAML.parse(await readFile(path.join(root,'.pages.yml'),'utf8'));
  const definitions=JSON.parse(await readFile(path.join(root,'scripts/cms-bindings.json'),'utf8'));
  const entries=[];const walk=items=>items.forEach(x=>x.type==='group'?walk(x.items):entries.push(x));walk(config.content);
  for(const item of entries){
    const data=JSON.parse(await readFile(path.join(root,item.path),'utf8'));
    for(const field of item.fields)assert.ok(Object.hasOwn(data,field.name),`${item.name}.${field.name}`);
  }
  for(const binding of definitions)assert.ok(entries.some(e=>e.path===binding.file),`Uneditable binding: ${binding.key}`);
});
test('all output pages have crawlable metadata, valid JSON-LD and one main heading',async()=>{
  for(const page of ['index','thesis-phd','thesis-msc','thesis-bsc','thesis-assoc']){
    const html=await readFile(path.join(root,page+'.html'),'utf8');
    assert.equal((html.match(/<h1\b/g)||[]).length,1);
    assert.doesNotMatch(html,/\{\{cms:/);
    assert.match(html,/<link rel="canonical" href="https:\/\/abolfazlsajadi\.com\//);
    for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
    const doc=parse(html),all=[];const walk=n=>{all.push(n);(n.childNodes||[]).forEach(walk)};walk(doc);
    for(const node of all){
      for(const attr of (node.attrs||[]).filter(a=>['src','href','poster'].includes(a.name))){
        if(!attr.value||/^(https?:|mailto:|tel:|data:|#)/.test(attr.value))continue;
        const local=decodeURIComponent(attr.value.split(/[?#]/)[0]);if(local==='./')continue;
        await readFile(path.join(root,local));
      }
    }
  }
  const home=await readFile(path.join(root,'index.html'),'utf8');
  assert.match(home,/<title>Xoodyak co-processor:  integrated, not designed by me<\/title>/);
  assert.match(home,/<em itemprop="isPartOf">Iranian Journal/);
});
test('saved CMS data changes the rendered site; validation is transactional',async()=>{
  const temp=await mkdtemp(path.join(tmpdir(),'cv-cms-test-'));
  try{
    for(const folder of ['content','templates','scripts'])await cp(path.join(root,folder),path.join(temp,folder),{recursive:true});
    await cp(path.join(root,'assets/Abolfazl_Sajadi_CV.pdf'),path.join(temp,'assets/Abolfazl_Sajadi_CV.pdf'),{recursive:true});
    const p=path.join(temp,'content/supervision.json'),data=JSON.parse(await readFile(p,'utf8'));
    data.completed.push({student:'Test Student',title:'A temporary test thesis',year:2026});await writeFile(p,JSON.stringify(data));
    await renderSite(temp);const before=await readFile(path.join(temp,'index.html'),'utf8');assert.match(before,/Test Student/);
    data.completed[0].year='invalid';await writeFile(p,JSON.stringify(data));
    await assert.rejects(()=>renderSite(temp),/year/);assert.equal(await readFile(path.join(temp,'index.html'),'utf8'),before);
  }finally{await rm(temp,{recursive:true,force:true})}
});
