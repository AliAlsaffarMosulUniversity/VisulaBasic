const fs=require('fs');const uniq=JSON.parse(fs.readFileSync('uniq.json'));
const N=+process.argv[2],M=+process.argv[3];
let out='';
for(let i=N;i<Math.min(M,uniq.length);i++){const s=uniq[i];
 if(s[0]==='`') out+='@@'+i+' T\n'+s.slice(1,-1)+'\n';
 else out+='@@'+i+'\n'+eval(s)+'\n';}
process.stdout.write(out);
