const fs=require('fs');
const uniq=JSON.parse(fs.readFileSync('uniq.json')),units=JSON.parse(fs.readFileSync('units.json'));
const tr={};
for(const f of fs.readdirSync('.').filter(f=>/^tr_\d+\.txt$/.test(f))){
  const parts=fs.readFileSync(f,'utf8').split(/^@@(\d+)(?: T)?\n/m);
  for(let i=1;i<parts.length;i+=2){ let t=parts[i+1]; t=t.replace(/\n$/,''); tr[+parts[i]]=t; }
}
const miss=[];uniq.forEach((s,i)=>{if(!(i in tr))miss.push(i)});
if(miss.length){console.log('missing',miss.slice(0,50),miss.length);}
// special: trailing newline values (2287)
const orig=i=>eval(uniq[i]);
uniq.forEach((s,i)=>{ if(i in tr){ const o=orig(i); if(o.endsWith('\n\n')&&!tr[i].endsWith('\n\n')) tr[i]=tr[i].replace(/\n*$/,'\n\n'); else if(o.endsWith('\n')&&!tr[i].endsWith('\n')) tr[i]+='\n'; if(o.startsWith(' ')&&!tr[i].startsWith(' ')) tr[i]=' '+tr[i]; if(o.endsWith(' ')&&!tr[i].endsWith(' ')&&!o.endsWith('\n')) tr[i]+=' '; }});
const idx=new Map(uniq.map((s,i)=>[s,i]));
const AR=/[؀-ۿ]/;
const byFile={};units.forEach(u=>(byFile[u.f]=byFile[u.f]||[]).push(u));
fs.mkdirSync('en',{recursive:true});
for(const f of Object.keys(byFile)){
  let src=fs.readFileSync('/home/claude/app/'+f,'utf8');
  const us=byFile[f].sort((a,b)=>b.s-a.s);
  for(const u of us){ const i=idx.get(u.src); const t=tr[i]; if(t===undefined) continue;
    const rep = u.src[0]==='`' ? '`'+t+'`' : JSON.stringify(t);
    src=src.slice(0,u.s)+rep+src.slice(u.e);}
  fs.writeFileSync('en/'+f,src);
  // leftover Arabic outside comments
  const left=src.split('\n').map((l,n)=>[n+1,l]).filter(([n,l])=>AR.test(l.replace(/\/\/.*$/,'')));
  console.log(f,'leftover lines:',left.length); left.slice(0,5).forEach(x=>console.log('  ',x[0],x[1].slice(0,140)));
}
