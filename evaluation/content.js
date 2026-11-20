const fs=require('fs');const A='/home/claude/app/';
const src=['interp.js','examples.js','apps.js','guides.js','apps_guide.js','content.js','practice.js'].map(f=>fs.readFileSync(A+f,'utf8')).join('\n').replace(/if \(typeof module[^\n]*\n/g,'');
const R=new Function(src+';return {EX,CH,GLOSS,PRACTICE,GUIDE}')();
const {EX,CH,GLOSS,PRACTICE}=R;
const inv={chapters:CH.length,glossary:GLOSS.length};
const bt={};CH.forEach(c=>c.blocks.forEach(b=>{bt[b[0]]=(bt[b[0]]||0)+1}));inv.blockTypes=bt;
inv.quiz=CH.reduce((s,c)=>s+c.quiz.length,0);inv.tasks=CH.reduce((s,c)=>s+c.tasks.length,0);
inv.practice=[1,2,3,4,5,6].reduce((s,k)=>s+PRACTICE[k].length,0);
const exs=Object.values(EX);inv.programs=exs.length;inv.byGroup={};exs.forEach(e=>{inv.byGroup[e.ch]=(inv.byGroup[e.ch]||0)+1});
inv.guided=exs.filter(e=>e.guide).length;inv.lineByLine=exs.filter(e=>e.guide&&e.guide.lines).length;inv.buildSteps=exs.filter(e=>e.guide&&e.guide.steps).length;
const ctl={},ev={};exs.forEach(e=>{e.form.controls.forEach(c=>ctl[c.type]=(ctl[c.type]||0)+1);for(const m of e.code.matchAll(/Private Sub \w+_(\w+)\(/g))ev[m[1]]=(ev[m[1]]||0)+1;});
inv.controls=ctl;inv.events=ev;
// statements used across programs
const kw=['Dim','Const','If','ElseIf','Select Case','For','Do','GoTo','MsgBox','InputBox','Print','Exit Sub','End','Option Explicit','Call','Function'];
inv.kwPrograms={};kw.forEach(k=>{inv.kwPrograms[k]=exs.filter(e=>new RegExp('\\b'+k.replace(' ','\\s+')+'\\b').test(e.code)).length});
// Bloom
const all=[];CH.forEach(c=>c.quiz.forEach(q=>all.push({...q,ch:c.id,set:'quiz'})));[1,2,3,4,5,6].forEach(k=>PRACTICE[k].forEach(q=>all.push({...q,ch:k,set:'practice'})));
const lv=q=>{const t=q.q;
 if(/ما الخطأ|أي عبارة صحيحة|لماذا .* غير|هل يمكن|هل تحتاج/.test(t)) return 'Analyze';
 if(q.c && /ناتج|يحدث|يظهر|قيمة|تفعل|الناتج/.test(t)) return 'Apply';
 if(/السطر الصحيح|أي سطر|نكتب|الصيغة الصحيحة|الشرط الذي|أي تعريف|أي جملة|التعريف الأنسب|لتحريك|لمسح|لتغيير|لتكبير|لجعل|لنقل|لإخفاء|لعرض|لتحميل|لفحص|لمعرفة|لاختيار|لتعريف/.test(t)) return 'Apply';
 if(/لماذا|يعني|تعني|الفرق|فائدة|الفائدة|متى|يقع عندما|ماذا تعني|يكافئ|تُصنَّف|يتطلب|يكفيه|يقوم ب|تُستخدم ل|يُستخدم ل|هو:|هي:|تعني أن/.test(t)) return 'Understand';
 return 'Remember';};
const bl={};const blc={};all.forEach(q=>{const l=lv(q);bl[l]=(bl[l]||0)+1;blc[q.ch]=blc[q.ch]||{};blc[q.ch][l]=(blc[q.ch][l]||0)+1});
inv.questions=all.length;inv.bloom=bl;inv.bloomByChapter=blc;inv.withCode=all.filter(q=>q.c).length;
fs.writeFileSync('/home/claude/paper/content.json',JSON.stringify(inv,null,1));console.log(JSON.stringify(inv,null,1));
