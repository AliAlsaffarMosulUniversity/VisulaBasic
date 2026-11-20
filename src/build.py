import re, base64
QR=open('qr.b64').read().strip()
LOGO='data:image/webp;base64,'+base64.b64encode(open('logo.webp','rb').read()).decode()
css=open('style.css').read()
import sys
LANG=sys.argv[1] if len(sys.argv)>1 else 'ar'
EN=LANG=='en'
D='en/' if EN else ''
js=[open(('' if f=='interp.js' else D)+f).read() for f in ['interp.js','examples.js','apps.js','guides.js','apps_guide.js','content.js','practice.js','ui.js']]
# strip node exports guard issues: examples/content use const at top-level; wrap together in one script
src='\n'.join(js)
src=src.replace("if (typeof module !== 'undefined') module.exports = { EX };","").replace("if (typeof module !== 'undefined') module.exports = { CH, GLOSS };","")
T=dict(lang='en',dir='ltr',short='Visual Basic 6',title='Visual Programming Kit — Visual Basic 6',alt='Logo of the College of Administration and Economics',c1='College of Administration and Economics',c2='Dept. of Management Information Systems',name='Visual Programming Kit',theme='Light and dark mode',other='index.html',olab='عربي',oaria='العربية') if EN else dict(lang='ar',dir='rtl',short='البرمجة المرئية',title='حقيبة البرمجة المرئية — Visual Basic 6',alt='شعار كلية الإدارة والاقتصاد',c1='كلية الإدارة والاقتصاد',c2='قسم نظم المعلومات الإدارية',name='حقيبة البرمجة المرئية',theme='الوضع النهاري والليلي',other='en.html',olab='EN',oaria='English')
if EN:
    src=src.replace('dir="rtl"','dir="ltr"')
html=f'''<!DOCTYPE html>
<html lang="{T['lang']}" dir="{T['dir']}">
<head>
<script>try{{var t=localStorage.getItem("vbtheme")||"light";document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="apple-180.png">
<link rel="icon" type="image/png" sizes="32x32" href="icon-32.png">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="{T['short']}">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#14325c">
<title>{T['title']}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div id="app">
<header class="top"><img class="logo" src="{LOGO}" alt="{T['alt']}"><div class="htxt"><small>{T['c1']}</small><small>{T['c2']}</small><b>{T['name']}</b></div></header>
<script>window.LOGO="{LOGO}";window.QR="data:image/png;base64,{QR}";</script><main id="view"></main>
</div>
<nav id="nav"></nav>
<script>(function(){{function f(){{var h=document.querySelector("header.top");if(h&&h.offsetHeight)document.documentElement.style.setProperty("--hh",h.offsetHeight+"px")}}addEventListener("resize",f);addEventListener("hashchange",function(){{setTimeout(f,50)}});addEventListener("load",f);setTimeout(f,0)}})()</script>
<button class="themebtn" id="themebtn" aria-label="{T['theme']}" title="{T['theme']}"><span class="cl">☁️</span><span class="st">✨</span><span class="knob"></span></button>
<a class="langbtn" id="langbtn" href="{T['other']}" lang="{'ar' if EN else 'en'}" aria-label="{T['oaria']}" title="{T['oaria']}">{T['olab']}</a>
<script>document.getElementById("langbtn").onclick=function(){{this.href="{T['other']}"+location.hash}}</script>
<script>
{src}
</script>
</body>
</html>'''
open('en.html' if EN else 'index.html','w').write(html)
print(len(html))
