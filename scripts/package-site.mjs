import { cp, mkdir, rm, readdir } from 'node:fs/promises';
const root=new URL('../',import.meta.url), out=new URL('_site/',root);
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
const files=['index.html','thesis-phd.html','thesis-msc.html','thesis-bsc.html','thesis-assoc.html','styles.min.css','script.min.js','CNAME','robots.txt','sitemap.xml'];
for(const name of files)await cp(new URL(name,root),new URL(name,out));
for(const name of ['assets','admin'])await cp(new URL(name+'/',root),new URL(name+'/',out),{recursive:true,filter:source=>!source.split('/').some(part=>part.startsWith('.'))});
console.log('Public artifact:',(await readdir(out)).join(', '));
