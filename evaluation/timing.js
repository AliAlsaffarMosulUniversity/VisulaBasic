const fs=require('fs');const VB=require('/home/claude/app/interp.js');
const src=['examples.js','apps.js'].map(f=>fs.readFileSync('/home/claude/app/'+f,'utf8')).join('\n').replace(/if \(typeof module[^\n]*\n/g,'');
const EX=new Function('VB',fs.readFileSync('/home/claude/app/examples.js','utf8').split('\n').filter(l=>!/module.exports/.test(l)).join('\n')+'\n'+fs.readFileSync('/home/claude/app/apps.js','utf8')+';return EX')(VB);
(async()=>{const comp=[],start=[],loc=[];
for(const id in EX){const e=EX[id];loc.push(e.code.trim().split('\n').length);
 const host={print(){},cls(){},refresh(){},focus(){},msgbox:async()=>1,inputbox:async()=>'5',error(){},ended(){}};
 let t0=process.hrtime.bigint();let it;for(let k=0;k<50;k++) it=new VB.Interp({code:e.code,form:e.form,host}).compile();
 comp.push(Number(process.hrtime.bigint()-t0)/50/1e6);
 t0=process.hrtime.bigint();await it.start();start.push(Number(process.hrtime.bigint()-t0)/1e6);}
const st=a=>{a=[...a].sort((x,y)=>x-y);const m=a.reduce((s,x)=>s+x,0)/a.length;return {n:a.length,mean:+m.toFixed(3),median:+a[a.length>>1].toFixed(3),p95:+a[Math.floor(a.length*.95)].toFixed(3),max:+a.at(-1).toFixed(3)}};
console.log('LOC',st(loc),'total',loc.reduce((s,x)=>s+x,0));console.log('compile ms',st(comp));console.log('start ms',st(start));
// loop throughput
const host={print(){},cls(){},refresh(){},focus(){},msgbox:async()=>1,inputbox:async()=>'',error(e){console.log(e.desc)},ended(){}};
const code='Private Sub Form_Load()\nDim i As Long, s As Double\nFor i = 1 To 100000\ns = s + i Mod 7\nNext i\nEnd Sub';
const it=new VB.Interp({code,form:{caption:'F',w:10,h:10,controls:[]},host}).compile();let t0=process.hrtime.bigint();await it.start();const ms=Number(process.hrtime.bigint()-t0)/1e6;console.log('100k loop ms',ms.toFixed(1),'iter/s',Math.round(100000/ms*1000));
console.log(process.version, require('os').cpus()[0].model);
})();
