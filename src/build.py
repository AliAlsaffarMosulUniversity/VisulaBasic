import re, base64
QR=open('qr.b64').read().strip()
LOGO='data:image/webp;base64,'+base64.b64encode(open('logo.webp','rb').read()).decode()
css=open('style.css').read()
js=[open(f).read() for f in ['interp.js','examples.js','apps.js','guides.js','apps_guide.js','content.js','practice.js','ui.js']]
# strip node exports guard issues: examples/content use const at top-level; wrap together in one script
src='\n'.join(js)
src=src.replace("if (typeof module !== 'undefined') module.exports = { EX };","").replace("if (typeof module !== 'undefined') module.exports = { CH, GLOSS };","")
html=f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<script>try{{var t=localStorage.getItem("vbtheme")||"light";document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="apple-180.png">
<link rel="icon" type="image/png" sizes="32x32" href="icon-32.png">
<link rel="icon" type="image/svg+xml" href="icon.svg">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="البرمجة المرئية">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#14325c">
<title>حقيبة البرمجة المرئية — Visual Basic 6</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div id="app">
<header class="top"><img class="logo" src="{LOGO}" alt="شعار كلية الإدارة والاقتصاد"><div class="htxt"><small>كلية الإدارة والاقتصاد</small><small>قسم نظم المعلومات الإدارية</small><b>حقيبة البرمجة المرئية</b></div></header>
<script>window.LOGO="{LOGO}";window.QR="data:image/png;base64,{QR}";</script><main id="view"></main>
</div>
<nav id="nav"></nav>
<button class="themebtn" id="themebtn" aria-label="الوضع النهاري والليلي" title="الوضع النهاري / الليلي"><span class="cl">☁️</span><span class="st">✨</span><span class="knob"></span></button>
<script>
{src}
</script>
</body>
</html>'''
open('index.html','w').write(html)
print(len(html))
