// VB6 conformance suite: each case = [category, description, code body, expected trimmed output or 'ERR:<num>' / 'COMPILE']
const VB=require('/home/claude/app/interp.js');
const C=[
['Arithmetic','Integer division 7 \\ 2','Print 7 \\ 2','3'],
['Arithmetic','Mod with negative dividend','Print -7 Mod 3','-1'],
['Arithmetic','Exponent 2 ^ 10','Print 2 ^ 10','1024'],
['Arithmetic','Float division 7 / 2','Print 7 / 2','3.5'],
['Arithmetic','Operator precedence 2 + 3 * 4 ^ 2','Print 2 + 3 * 4 ^ 2','50'],
['Arithmetic','Unary minus with power -2 ^ 2','Print -2 ^ 2','-4'],
['Arithmetic','Integer * Integer overflow (200*200)','Dim a As Integer, b As Integer\na = 200: b = 200\nPrint a * b','ERR:6'],
['Arithmetic','Division by zero (/)','Dim z As Integer\nPrint 1 / z','ERR:11'],
['Arithmetic','Division by zero (\\)','Dim z As Integer\nPrint 1 \\ z','ERR:11'],
['Numeric functions','Int(-2.5)','Print Int(-2.5)','-3'],
['Numeric functions','Fix(-2.5)','Print Fix(-2.5)','-2'],
['Numeric functions','CInt(2.5) banker\'s rounding','Print CInt(2.5)','2'],
['Numeric functions','CInt(3.5) banker\'s rounding','Print CInt(3.5)','4'],
['Numeric functions','Round(2.5)','Print Round(2.5)','2'],
['Numeric functions','Sqr(16)','Print Sqr(16)','4'],
['Numeric functions','Sqr(-1) raises error 5','Print Sqr(-1)','ERR:5'],
['Numeric functions','Abs(-3) and Sgn(-9)','Print Abs(-3); Sgn(-9)','3 -1'],
['Numeric functions','RGB(255, 0, 0)','Print RGB(255, 0, 0)','255'],
['Conversion','Val("12abc")','Print Val("12abc")','12'],
['Conversion','Val("abc")','Print Val("abc")','0'],
['Conversion','Val ignores embedded spaces Val(" 4 5")','Print Val(" 4 5")','45'],
['Conversion','Val("&H10") hexadecimal','Print Val("&H10")','16'],
['Conversion','Val("1e3") exponent','Print Val("1e3")','1000'],
['Conversion','Implicit conversion "5" + 3','Print "5" + 3','8'],
['Conversion','Concatenation "5" & 3','Print "5" & 3','53'],
['Conversion','String + String concatenates','Print "12" + "30"','1230'],
['Conversion','Str(5) keeps sign space','Print "[" & Str(5) & "]"','[ 5]'],
['Conversion','CStr(5) has no sign space','Print "[" & CStr(5) & "]"','[5]'],
['Conversion','Type mismatch on Integer = "abc"','Dim x As Integer\nx = "abc"','ERR:13'],
['Conversion','Variant arithmetic v = "12": v + 1','Dim v\nv = "12"\nPrint v + 1','13'],
['Types','Integer assignment rounds 2.5 to 2','Dim x As Integer\nx = 2.5\nPrint x','2'],
['Types','Integer assignment rounds 3.7 to 4','Dim x As Integer\nx = 3.7\nPrint x','4'],
['Types','Integer overflow at 32768','Dim x As Integer\nx = 32767\nx = x + 1','ERR:6'],
['Types','Long overflow at 2147483648','Dim l As Long\nl = 2147483647\nl = l + 1','ERR:6'],
['Types','Long holds 100000','Dim l As Long\nl = 100000\nPrint l','100000'],
['Types','Single keeps fraction','Dim s As Single\ns = 3.75\nPrint s','3.75'],
['Types','String receives number','Dim s As String\ns = 5\nPrint "[" & s & "]"','[5]'],
['Types','Boolean True as number','Print CInt(True)','-1'],
['Types','Not 0 = -1','Print Not 0','-1'],
['Types','Default numeric value is 0','Dim n As Integer\nPrint n','0'],
['Types','Const cannot be assigned','Const PI = 3.14\nPI = 3','COMPILE'],
['Strings','Len("Mosul")','Print Len("Mosul")','5'],
['Strings','UCase / LCase','Print UCase("vb6"); LCase("VB")','VB6vb'],
['Strings','Mid("Visual", 2, 3)','Print Mid("Visual", 2, 3)','isu'],
['Strings','Left / Right','Print Left("Basic", 2); Right("Basic", 3)','Basic'],
['Strings','InStr("Hello", "l")','Print InStr("Hello", "l")','3'],
['Strings','Trim("  a  ")','Print "[" & Trim("  a  ") & "]"','[a]'],
['Strings','Chr(65) and Asc("A")','Print Chr(65); Asc("A")','A 65'],
['Strings','Binary comparison "Ali" = "ali"','Print "Ali" = "ali"','False'],
['Strings','Ordering "a" < "b"','Print "a" < "b"','True'],
['Formatting','Format(3.14159, "0.00")','Print Format(3.14159, "0.00")','3.14'],
['Formatting','Format(1234567, "#,##0")','Print Format(1234567, "#,##0")','1,234,567'],
['Formatting','Format(0.5, "0.00")','Print Format(0.5, "0.00")','0.50'],
['Formatting','Print omits leading zero (.5)','Print 0.5','.5'],
['Formatting','Print negative fraction (-.5)','Print -0.5','-.5'],
['Formatting','Print 1/3 to 15 significant digits','Print 1 / 3','.333333333333333'],
['Formatting','Print positive number with sign space','Print "x"; 5','x 5'],
['Control flow','For with Step 3','Dim i As Integer, s As Integer\nFor i = 1 To 10 Step 3\ns = s + i\nNext i\nPrint s','22'],
['Control flow','For with negative Step','Dim i As Integer, c As Integer\nFor i = 10 To 1 Step -2\nc = c + 1\nNext\nPrint c','5'],
['Control flow','Do While loop 1..100','Dim i As Integer, s As Long\ni = 1\nDo While i <= 100\ns = s + i\ni = i + 1\nLoop\nPrint s','5050'],
['Control flow','Do ... Loop Until','Dim i As Integer\nDo\ni = i + 1\nLoop Until i >= 5\nPrint i','5'],
['Control flow','Exit For','Dim i As Integer\nFor i = 1 To 10\nIf i = 4 Then Exit For\nNext\nPrint i','4'],
['Control flow','Single-line If ... Else','Dim y As Integer\nIf 3 > 5 Then y = 1 Else y = 2\nPrint y','2'],
['Control flow','If ... ElseIf ... Else','Dim a As Integer\na = 15\nIf a < 13 Then\nPrint "C"\nElseIf a < 18 Then\nPrint "T"\nElse\nPrint "A"\nEnd If','T'],
['Control flow','Select Case with Is and To','Select Case 85\nCase Is >= 90\nPrint "E"\nCase 80 To 89\nPrint "VG"\nCase Else\nPrint "F"\nEnd Select','VG'],
['Control flow','Select Case list of strings','Select Case "b"\nCase "a", "b"\nPrint "ok"\nCase Else\nPrint "no"\nEnd Select','ok'],
['Control flow','GoTo label skips a line','Print "a";\nGoTo L1\nPrint "b";\nL1:\nPrint "c"','ac'],
['Control flow','Logical And / Or','Print (5 > 3 And 2 > 1); (1 > 2 Or 2 > 3)','TrueFalse'],
['Procedures','Sub with ByRef argument','Dim n As Integer\nn = 1\nInc n\nPrint n','2','Private Sub Inc(x As Integer)\nx = x + 1\nEnd Sub'],
['Procedures','Function return value','Print Twice(21)','42','Private Function Twice(x As Integer) As Integer\nTwice = x * 2\nEnd Function'],
['Procedures','Option Explicit rejects undeclared variable','qq = 1','COMPILE','',true],
['Procedures','Local Dim shadows module variable','g = 5\nShowG\nPrint g','0 5','Dim g As Integer\nPrivate Sub ShowG()\nDim g As Integer\nPrint g;\nEnd Sub'],
];
(async()=>{
 const rows=[];
 for(const [cat,desc,body,exp,extra,explicit] of C){
  const code=(explicit?'Option Explicit\n':'')+(extra?extra+'\n':'')+'Private Sub Form_Load()\n'+body+'\nEnd Sub';
  let out='',err=null,res;
  const host={print:(s,nl)=>{out+=s+(nl?'\n':'')},cls(){},refresh(){},focus(){},msgbox:async()=>1,inputbox:async()=>'',error:e=>{err=/^Compile error/.test(e.desc)?'COMPILE':'ERR:'+e.num},ended(){}};
  try{const it=new VB.Interp({code,form:{caption:'F',w:100,h:100,controls:[]},host}).compile();await it.start();res=err||out.replace(/\s+$/,'').replace(/^\s+/,'');}
  catch(e){res=(e&&e.num&&!/Compile/i.test(e.desc||e.message))?'ERR:'+e.num:'COMPILE';}
  const norm=s=>s.replace(/\s+/g,' ').trim();
  const pass=norm(res)===norm(exp);
  rows.push({cat,desc,exp,got:res,pass});
 }
 const fs=require('fs');fs.writeFileSync('/home/claude/paper/conformance.json',JSON.stringify(rows,null,1));
 const by={};rows.forEach(r=>{by[r.cat]=by[r.cat]||[0,0];by[r.cat][0]++;if(r.pass)by[r.cat][1]++;});
 console.log(by,'total',rows.length,'pass',rows.filter(r=>r.pass).length);
 rows.filter(r=>!r.pass).forEach(r=>console.log('FAIL',r.cat,'|',r.desc,'| exp',JSON.stringify(r.exp),'got',JSON.stringify(r.got)));
})();
