const acorn=require('acorn'),walk=require('acorn-walk'),fs=require('fs');
const AR=/[؀-ۿ]/;
const files=['examples.js','apps.js','guides.js','apps_guide.js','content.js','practice.js','ui.js'];
let units=[];
for(const f of files){
  const src=fs.readFileSync('/home/claude/app/'+f,'utf8');
  const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'script'});
  const nodes=[];
  walk.full(ast,n=>{ if((n.type==='Literal'&&typeof n.value==='string'&&AR.test(n.value))||(n.type==='TemplateLiteral'&&AR.test(src.slice(n.start,n.end)))) nodes.push(n);});
  // keep outermost only
  nodes.sort((a,b)=>a.start-b.start||b.end-a.end);
  let last=-1;
  for(const n of nodes){ if(n.start<last) continue; last=n.end; units.push({f,s:n.start,e:n.end,src:src.slice(n.start,n.end)}); }
}
fs.writeFileSync('units.json',JSON.stringify(units));
const uniq=[...new Set(units.map(u=>u.src))];
fs.writeFileSync('uniq.json',JSON.stringify(uniq));
console.log(units.length,uniq.length,uniq.reduce((a,b)=>a+b.length,0));
const byf={};units.forEach(u=>byf[u.f]=(byf[u.f]||0)+1);console.log(byf);
