import asyncio, json
from playwright.async_api import async_playwright
# scenario: list of steps; ('fill', textIndexName, val) ('click', btnCaptionOrName) ('ans', inputValue or None, buttonText) ('expect', ctrlName, substring)
S = {
 'lab0':[('fill','Text1','1'),('fill','Text2','2'),('click','Command1'),('expect','Text3','3'),('click','Command2'),('print','Hello from VB'),('click','Command3'),('noprint','Hello')],
 'e1a':[('expect','Label1','Welcome to VB6'),('click','Say Hello'),('expect','Label1','Hello, World!')],
 'e2a':[('lclick','Label5'),('hidden','Label1'),('lclick','Label4'),('visible','Label1')],
 'e2b':[('focus','Text2'),('hidden','Text3'),('focus','Text1'),('visible','Text3')],
 'e2c':[('fill','Text1','12'),('fill','Text2','5'),('click','+'),('expect','Text3','17'),('click','-'),('expect','Text3','7'),('click','*'),('expect','Text3','60'),('click','/'),('expect','Text3','2.4'),('fill','Text2','0'),('click','/'),('expect','Text3','Cannot divide'),('click','Clear'),('expect','Text3','')],
 'e2d':[('click','Text1 + Text2'),('expect','Label1','1230'),('click','Val + Val'),('expect','Label1','42')],
 'e2e':[('type','Text1','hello'),('expect','Text2','HELLO'),('expect','Label1','Characters: 5')],
 'e2f':[('fill','Text1','6'),('fill','Text2','4'),('click','Calculate'),('expect','Text3','24')],
 'e3a':[('click','Command1'),('ans',None,'OK'),('lclick','Label1'),('expect','Label1','Click')],
 'e3b':[('dbl','Label1'),('expect','Text2','Hello')],
 'e3c':[('hover','Command2'),('hoverform',),('expectnz','Text1')],
 'e3d':[('drag','Image1')],
 'e3e':[('down','Label1'),('expect','Label1','Mouse Down'),('up','Label1'),('expect','Label1','Mouse Up')],
 'e4a':[('click','Press'),('expect','Text2','12.56'),('expect','Text3','12.56')],
 'e4b':[('click','Command1'),('click','Command2'),('click','Command3'),('print','x = welcome')],
 'e4c':[('click','n = n + 1'),('click','n = n + 1'),('click','n = n + 10'),('print','n = 12')],
 'e4d':[('click','Declared (Dim s)'),('print','1'),('click','Not declared'),('err','Variable not defined')],
 'e4e':[('click','Command1'),('click','Command2'),('click','Command3'),('print','z=  10'),('print','a 0')],
 'e4f':[('click','Integer + 10000'),('err','Overflow'),('click','Long + 10000'),('print','40000'),('click','Integer = 3.7'),('print','4'),('click','Single = 3.7'),('print','3.7')],
 'e5a':[('click','Add'),('ans','7','OK'),('ans','5','OK'),('print','Sum =  12'),('click','Subtract'),('ans','7','OK'),('ans','5','OK'),('print','Difference =  2')],
 'e5b':[('click','Solve y = a*b + c'),('ans','2','OK'),('ans','3','OK'),('ans','4','OK'),('expect','Label1','y = 10')],
 'e5c':[('click','Enter data'),('ans','Ahmed','OK'),('ans','Third','OK'),('expect','Label3','Ahmed - Third')],
 'e5d':[('click','1'),('ans',None,'OK'),('click','1 + 32'),('ans',None,'Cancel'),('click','4 + 64'),('ans',None,'Yes'),('click','2 + 16'),('ans',None,'Ignore'),('click','5 + 48'),('ans',None,'Cancel')],
 'e5e':[('click','Exit'),('ans',None,'No'),('expect','Label1','value = 7'),('click','Exit'),('ans',None,'Yes'),('ended',)],
 'e5f':[('click','Start'),('ans','Sara','OK'),('expect','Text1','Sara'),('click','Clear'),('ans',None,'Yes'),('expect','Text1',''),('click','Exit'),('ans',None,'OK'),('ended',)],
 'e5g':[('click','Square root'),('ans','16','OK'),('expect','Label1','= 4'),('click','Square root'),('ans','-4','OK'),('expect','Label1','negative')],
 'e5h':[('click','Run'),('expect','Text1','50')],
 'e6a':[('click','Determine'),('expect','Text2','Odd'),('fill','Text1','10'),('click','Determine'),('expect','Text2','Even')],
 'e6b':[('click','Roll'),('expectnz','Text4')],
 'e6c':[('click','PRESS'),('expect','Text2','4'),('fill','Text1','-2'),('click','PRESS'),('expect','Text2','-13')],
 'e6d':[('click','EVALUATE'),('expect','Text2','Very Good'),('fill','Text1','95'),('click','EVALUATE'),('expect','Text2','Excellent'),('fill','Text1','40'),('click','EVALUATE'),('expect','Text2','Failed')],
 'e6e':[('click','Solution'),('expect','Text3','8.02'),('fill','Text2','9'),('click','Solution'),('expect','Text3','Wrong')],
 'e6f':[('fill','Text1','admin'),('fill','Text2','1234'),('click','Check'),('expect','Label3','Welcome'),('fill','Text2','9'),('click','Check'),('expect','Label3','Wrong password'),('fill','Text1','x'),('click','Check'),('expect','Label3','Wrong Information'),('fill','Text2','1234'),('click','Check'),('expect','Label3','Wrong user')],
 'e6g':[('click','Find Max and Min'),('expect','Label4','Max = 9'),('expect','Label4','Min = 4')],
 'e6h':[('click','Check'),('expect','Label2','4 and 5'),('fill','Text1','7'),('click','Check'),('expect','Label2','Not')],
 'e6i':[('click','Solve'),('expect','Text2','6.5'),('fill','Text1','15'),('click','Solve'),('expect','Text2','45'),('fill','Text1','11'),('click','Solve'),('expect','Text2','Undefined')],
 't_label':[('click','Caption'),('expect','Label1','Visual Basic 6'),('click','FontSize'),('click','Reset'),('expect','Label1','Hello')],
 't_text':[('fill','Text1','Ali'),('click','Copy to Label'),('expect','Label3','Ali'),('click','Clear'),('expect','Text1','')],
 't_btn':[('click','Target'),('expect','Label1','Target was clicked'),('click','Rename'),('click','Renamed'),('click','OK (Default)'),('expect','Label1','Default')],
 't_img':[('click','Dog'),('expect','Image1','🐶'),('lclick','Image1'),('expect','Label1','clicked the image')],
 't_form':[('fill','Text1','New'),('click','Set Caption'),('title','New'),('click','Print'),('print','Hello from the form')],
 'all1':[('fill','Text1','Sara'),('fill','Text2','90'),('fill','Text3','95'),('fill','Text4','100'),('click','Calculate'),('expect','Text5','95.0'),('expect','Text6','Excellent'),('expect','Image1','😀'),
         ('click','Pass mark'),('ans','80','OK'),('expect','Label8','80'),('click','Clear'),('click','Calculate'),('ans',None,'OK'),('fill','Text1','Omar'),('fill','Text2','150'),('click','Calculate'),('ans',None,'OK'),
         ('lclick','Image1'),('ans',None,'OK'),('click','Exit'),('ans',None,'Yes'),('ended',)],
 'cmd_dim':[('click','Show'),('expect','Label3','21 next year')],
 'cmd_msgbox':[('click','Info'),('ans',None,'OK'),('click','Delete file?'),('ans',None,'Yes'),('expect','Label1','deleted'),('click','Delete file?'),('ans',None,'No'),('expect','Label1','Cancelled')],
 'cmd_inputbox':[('click','Ask my name'),('ans','Ali','OK'),('expect','Label1','Hello Ali'),('click','Ask my name'),('ans',None,'Cancel'),('expect','Label1','No name'),('click','Add two numbers'),('ans','7','OK'),('ans','5','OK'),('expect','Label2','= 12')],
 'cmd_select':[('click','Show day'),('expect','Label2','Monday'),('fill','Text1','9'),('click','Show day'),('expect','Label2','1 to 7')],
 'cmd_if':[('click','Check'),('expect','Label2','Adult'),('fill','Text1','15'),('click','Check'),('expect','Label2','Teenager')],
 'cmd_click':[('click','Click me'),('click','Click me'),('click','Click me'),('expect','Label1','Clicks: 3'),('click','Reset'),('expect','Label1','Clicks: 0')],
}

S.update({
 'app_calc':[('click','1'),('click','2'),('click','+'),('click','8'),('click','='),('expect','Text1','20'),('click','9'),('click','/'),('click','0'),('click','='),('ans',None,'OK'),('click','C'),('expect','Text1','0'),('click','2'),('click','.'),('click','5'),('click','*'),('click','4'),('click','='),('expect','Text1','10'),('click','√'),('expect','Text1','3.16'),('click','←'),('click','±')],
 'app_bmi':[('click','Calculate'),('expect','Label4','22.9'),('expect','Label5','Normal'),('click','Clear'),('click','Calculate'),('ans',None,'OK'),('fill','Text1','100'),('fill','Text2','175'),('click','Calculate'),('expect','Label5','Obese')],
 'app_temp':[('click','°C → °F'),('expect','Label3','86.0'),('fill','Text1','5'),('click','°C → °F'),('expect','Image1','🥶'),('fill','Text1','212'),('click','°F → °C'),('expect','Label3','100.0')],
 'app_currency':[('click','$ → IQD'),('expect','Label4','131,000'),('fill','Text2','655000'),('click','IQD → $'),('expect','Label4','500.00'),('fill','Text1','0'),('click','IQD → $'),('ans',None,'OK')],
 'app_invoice':[('click','Add item'),('fill','Text1','Book'),('fill','Text2','25000'),('fill','Text3','4'),('click','Add item'),('click','Total'),('expect','Label5','103,500'),('print','Book'),('click','Add item'),('ans',None,'OK'),('click','New invoice'),('ans',None,'Yes'),('expect','Label4','Items: 0'),('noprint','Book')],
 'app_salary':[('click','Calculate'),('expect','Text5','855,000'),('fill','Text1','200000'),('fill','Text2','0'),('click','Calculate'),('expect','Text4','(0%)'),('click','Clear'),('expect','Text5','')],
 'app_guess':[('guess',)],
 'app_rps':[('click','Rock ✊'),('click','Paper ✋'),('click','Scissors ✌️'),('expectnz','Label4'),('click','Reset score'),('expect','Label5','You 0 : 0')],
 'app_table':[('click','Show'),('print','7  x  10  =  70'),('click','Clear'),('noprint','70')],
 'app_traffic':[('expect','Label4','STOP'),('click','Next ▶'),('expect','Label4','GO'),('click','Next ▶'),('expect','Label4','READY'),('click','Next ▶'),('expect','Label4','STOP')],
 'app_quiz':[('click','Caption'),('click','Val'),('click','Dim'),('click','Yes'),('click','Form_Load'),('expect','Label2','5 / 5'),('click','Start again'),('expect','Label1','Question 1')],
})

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width':900,'height':1000})
        perr=[]; pg.on('pageerror', lambda e: perr.append(str(e)))
        await pg.goto('file:///home/claude/app/index.html#lab'); await pg.wait_for_timeout(600)
        ids=json.load(open('/tmp/ids.json'))
        missing=[i for i in ids if i not in S]; print('no scenario:',missing)
        fails={}
        for id in ids:
            if id not in S: continue
            await pg.select_option('#labsel', id); await pg.wait_for_timeout(300)
            R='#labrun '
            async def ctl(name):
                return pg.locator(R+'[data-n="%s"]'%name)
            async def val(name):
                return await pg.evaluate("""(n)=>{const e=document.querySelector('#labrun [data-n="'+n+'"]'); if(!e) return null; return e.value!==undefined&&e.tagName!=='BUTTON'&&e.tagName!=='DIV'?e.value:e.textContent}""", name)
            bad=[]
            if await pg.locator('#labrun .cerr').count(): bad.append('compile '+await pg.inner_text('#labrun .cerr'))
            for st in S[id]:
                k=st[0]
                try:
                    if k=='fill':
                        el=await ctl(st[1]); await el.fill(st[2]); await el.dispatch_event('input')
                    elif k=='type':
                        el=await ctl(st[1]); await el.click(); await el.type(st[2])
                    elif k=='click':
                        btn=pg.locator(R+'button.vbbtn').filter(has_text=st[1])
                        cands=[i for i in range(await btn.count()) if (await btn.nth(i).inner_text()).replace('&','').strip()==st[1]]
                        if not cands: cands=[i for i in range(await btn.count())]
                        el=btn.nth(cands[0]) if cands else (await ctl(st[1]))
                        await el.click(timeout=2000)
                    elif k=='lclick': await (await ctl(st[1])).click(timeout=2000)
                    elif k=='dbl': await (await ctl(st[1])).dblclick()
                    elif k=='focus': await (await ctl(st[1])).focus()
                    elif k=='hover': await (await ctl(st[1])).hover()
                    elif k=='hoverform':
                        bb=await pg.locator(R+'.vbbody').bounding_box(); await pg.mouse.move(bb['x']+250,bb['y']+120); await pg.mouse.move(bb['x']+260,bb['y']+130)
                    elif k=='down':
                        bb=await (await ctl(st[1])).bounding_box(); await pg.mouse.move(bb['x']+5,bb['y']+5); await pg.mouse.down()
                    elif k=='up': await pg.mouse.up()
                    elif k=='drag':
                        el=await ctl(st[1]); bb=await el.bounding_box(); x0=bb['x']
                        await pg.mouse.move(bb['x']+10,bb['y']+10); await pg.mouse.down(); await pg.mouse.move(bb['x']+150,bb['y']+80,steps=8); await pg.mouse.up(); await pg.wait_for_timeout(150)
                        bb2=await el.bounding_box()
                        if abs(bb2['x']-x0)<20: bad.append('drag did not move')
                    elif k=='ans':
                        await pg.wait_for_timeout(150)
                        d=pg.locator(R+'.vbdlg')
                        if await d.count()==0: bad.append('no dialog for '+str(st)); continue
                        if 'Microsoft Visual Basic' in await d.first.inner_text(): bad.append('ERROR DLG: '+(await d.first.inner_text()).replace('\n',' ')[:120])
                        if st[1] is not None: await d.first.locator('input').fill(st[1])
                        await d.first.locator('.dbtns button', has_text=st[2]).first.click()
                    elif k=='err':
                        await pg.wait_for_timeout(150)
                        d=pg.locator(R+'.vbdlg'); t=await d.first.inner_text() if await d.count() else ''
                        if st[1] not in t: bad.append('expected error '+st[1])
                        else: await d.first.locator('.dbtns button').first.click()
                    elif k=='guess':
                        lo,hi=1,100
                        for _ in range(10):
                            m=(lo+hi)//2
                            await (await ctl('Text1')).fill(str(m)); await (await ctl('Text1')).dispatch_event('input')
                            await pg.locator(R+'button.vbbtn').filter(has_text='Guess').first.click(); await pg.wait_for_timeout(120)
                            cap=await val('Label2')
                            if 'small' in cap: lo=m+1
                            elif 'big' in cap: hi=m-1
                            else: break
                        if 'Correct' not in cap: bad.append('guess not solved '+cap)
                        d=pg.locator(R+'.vbdlg')
                        if await d.count(): await d.first.locator('.dbtns button').first.click()
                        else: bad.append('no win msg')
                    elif k=='ended':
                        await pg.wait_for_timeout(150)
                        if await pg.locator(R+'.vbend').count()==0: bad.append('not ended')
                    elif k=='title':
                        t=await pg.inner_text(R+'.vbtitle')
                        if st[1] not in t: bad.append('title '+t)
                    elif k in('print','noprint'):
                        t=await pg.inner_text(R+'.vbprint')
                        if (st[1] in t)!=(k=='print'): bad.append('%s %r got %r'%(k,st[1],t[-80:]))
                    elif k in ('hidden','visible'):
                        v=await (await ctl(st[1])).is_visible()
                        if v!=(k=='visible'): bad.append(k+' '+st[1])
                    elif k=='expect':
                        await pg.wait_for_timeout(60)
                        v=await val(st[1])
                        if v is None or (st[2]=='' and v!='') or (st[2] not in v): bad.append('%s expected %r got %r'%(st[1],st[2],v))
                    elif k=='expectnz':
                        v=await val(st[1])
                        if not v: bad.append(st[1]+' empty')
                    await pg.wait_for_timeout(60)
                    # unexpected error dialog?
                    d=pg.locator(R+'.vbdlg')
                    if k!='err' and await d.count() and 'Microsoft Visual Basic' in await d.first.inner_text():
                        nxt=S[id][S[id].index(st)+1] if S[id].index(st)+1<len(S[id]) else None
                        if not nxt or nxt[0]!='err':
                            bad.append('UNEXPECTED ERR after %s: %s'%(st,(await d.first.inner_text()).replace('\n',' ')[:120])); await d.first.locator('.dbtns button').first.click()
                except Exception as ex:
                    bad.append('step %s failed: %s'%(st,str(ex).split('\n')[0][:100]))
            if bad: fails[id]=bad
        for k,v in fails.items(): print(k,v)
        print('FAILED',len(fails),'of',len(S),'pageerrors',perr)
        await b.close()
asyncio.run(main())
