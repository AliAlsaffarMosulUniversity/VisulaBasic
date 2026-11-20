/* ===== UI ===== */
(function () {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rt = s => String(s).split(/\{\{(.+?)\}\}/).map((p, i) => i % 2 ? '<bdi class="en">' + esc(p) + '</bdi>' : esc(p)).join('');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const lc = s => s.toLowerCase();

/* ---------- storage (safe) ---------- */
const mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem('vbk_' + k); if (v) return JSON.parse(v); } catch (e) { } return k in mem ? mem[k] : d; },
  set(k, v) { mem[k] = v; try { localStorage.setItem('vbk_' + k, JSON.stringify(v)); } catch (e) { } }
};
let prog = store.get('prog', null) || { quiz: {}, ran: {}, notes: {}, last: null, exam: 0 };
const saveProg = () => store.set('prog', prog);

/* ---------- syntax highlight ---------- */
const KW = new Set('private public sub function end if then else elseif select case dim as const for to next step do loop while wend goto exit call print and or not mod xor is option explicit static'.split(' '));
const TY = new Set('integer long single double string boolean date variant currency byte control'.split(' '));
function hl(code) {
  const re = /('[^\n]*)|("(?:[^"\n]|"")*")|\b(\d+\.?\d*)\b|\b([A-Za-z_]\w*)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index)); last = re.lastIndex;
    if (m[1]) out += '<i class="c">' + esc(m[1]) + '</i>';
    else if (m[2]) out += '<i class="s">' + esc(m[2]) + '</i>';
    else if (m[3]) out += '<i class="n">' + m[3] + '</i>';
    else { const w = m[4].toLowerCase(); out += KW.has(w) ? '<i class="k">' + m[4] + '</i>' : TY.has(w) ? '<i class="t">' + m[4] + '</i>' : esc(m[4]); }
  }
  return out + esc(code.slice(last));
}
const codeBlock = (c, cap) => '<div class="codewrap">' + (cap ? '<div class="codecap">' + rt(cap) + '</div>' : '') + '<pre class="code" dir="ltr">' + hl(c) + '</pre></div>';

/* ---------- colors ---------- */
const bgr = n => { n = Number(n) >>> 0; return 'rgb(' + (n & 255) + ',' + ((n >> 8) & 255) + ',' + ((n >> 16) & 255) + ')'; };
const btnHtml = c => esc(c).replace(/&amp;&amp;/g, '\u0001').replace(/&amp;(\S)/, '<u>$1</u>').replace(/\u0001/g, '&amp;');

/* ---------- dialog (VB style) ---------- */
const ICONS = { 16: ['❌', '#c62828'], 32: ['❓', '#1565c0'], 48: ['⚠️', '#e6a100'], 64: ['ℹ️', '#1565c0'] };
function showDialog(win, o) {
  return new Promise(res => {
    const ov = document.createElement('div'); ov.className = 'vbov';
    const ic = o.icon && ICONS[o.icon] ? '<span class="dico">' + ICONS[o.icon][0] + '</span>' : '';
    ov.innerHTML = '<div class="vbdlg" role="dialog"><div class="dtitle"><span>' + esc(o.title || '') + '</span><i>✕</i></div><div class="dbody">' + ic +
      '<div class="dmsg" dir="auto">' + esc(o.msg || '').replace(/\n/g, '<br>') + (o.ar ? '<div class="dar" dir="rtl">' + esc(o.ar) + '</div>' : '') + '</div></div>' +
      (o.input ? '<div class="dinput"><input type="text" dir="auto" value="' + esc(o.def || '') + '"></div>' : '') +
      '<div class="dbtns"></div></div>';
    const bt = ov.querySelector('.dbtns');
    const done = v => { ov.remove(); res(v); };
    o.buttons.forEach((b, i) => {
      const x = document.createElement('button'); x.textContent = b.t; if (i === 0) x.className = 'def';
      x.onclick = () => done(o.input ? (b.v === 1 ? ov.querySelector('input').value : '') : b.v); bt.appendChild(x);
    });
    ov.querySelector('.dtitle i').onclick = () => { const cb = o.buttons.find(b => b.v === 2 || b.v === 7) || o.buttons[o.buttons.length - 1]; done(o.input ? '' : cb.v); };
    ov.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); bt.firstChild.click(); } if (e.key === 'Escape') { e.preventDefault(); ov.querySelector('.dtitle i').click(); } });
    ov.addEventListener('pointerdown', e => e.stopPropagation());
    win.appendChild(ov);
    const f = ov.querySelector('input') || bt.firstChild; setTimeout(() => f && f.focus && f.focus(), 30);
  });
}
const BTNSETS = { 0: [['OK', 1]], 1: [['OK', 1], ['Cancel', 2]], 2: [['Abort', 3], ['Retry', 4], ['Ignore', 5]], 3: [['Yes', 6], ['No', 7], ['Cancel', 2]], 4: [['Yes', 6], ['No', 7]], 5: [['Retry', 4], ['Cancel', 2]] };
const msgDialog = (win, prompt, sym, title) => showDialog(win, { title, msg: prompt, icon: sym & 0x70, buttons: (BTNSETS[sym & 15] || BTNSETS[0]).map(b => ({ t: b[0], v: b[1] })) });
const ERRAR = {
  13: 'نوع البيانات غير مناسب. مثلًا: إسناد نص إلى متغير رقمي، أو جمع نص فارغ. استخدم Val.',
  6: 'تجاوزت سعة النوع (Overflow). استخدم نوعًا أكبر مثل Long.',
  11: 'قسمة على صفر.', 5: 'قيمة غير مسموحة للدالة (مثل جذر عدد سالب أو لوغاريتم الصفر).',
  424: 'الكائن غير موجود. تحقق من اسم الأداة.', 438: 'هذه الخاصية أو الطريقة غير مدعومة لهذا الكائن.', 35: 'إجراء أو دالة غير معرّفة.', 28: 'يبدو أن البرنامج دخل في تكرار لا ينتهي.', 383: 'خاصية للقراءة فقط.'
};

/* ---------- form runner ---------- */
function mountRunner(box, ex, o) {
  o = o || {};
  if (box._ctl) box._ctl.destroy();
  const spec = ex.form, code = o.code != null ? o.code : ex.code;
  box.innerHTML = '';
  const hold = document.createElement('div'); hold.className = 'vbhold';
  const win = document.createElement('div'); win.className = 'vbwin';
  win.innerHTML = '<div class="vbtitle"><span class="vbcap"></span><span class="vbwb"><i>–</i><i>▢</i><i>✕</i></span></div><div class="vbbody"><div class="vbprint"></div></div>';
  const body = win.querySelector('.vbbody'), printEl = win.querySelector('.vbprint');
  body.style.width = spec.w + 'px'; body.style.height = spec.h + 'px'; if (spec.printTop) printEl.style.top = spec.printTop + 'px';
  hold.appendChild(win); box.appendChild(hold);
  let buf = '', ran = false, it = null, scale = 1;
  const els = new Map();
  const host = {
    print(s, nl) { buf += s + (nl ? '\n' : ''); printEl.textContent = buf; },
    cls() { buf = ''; printEl.textContent = ''; },
    refresh(c) { apply(c); },
    focus(c) { const e = els.get(c); if (e && e.focus) e.focus(); },
    msgbox(p, s, t) { return msgDialog(win, p, s, t); },
    inputbox(p, t, d) { return showDialog(win, { title: t, msg: p, input: true, def: d, buttons: [{ t: 'OK', v: 1 }, { t: 'Cancel', v: 2 }] }); },
    error(e) {
      const msg = e.kind === 'compile' ? e.desc : "Run-time error '" + e.num + "':\n" + e.desc;
      let ar = ERRAR[e.num] || '';
      if (/Variable not defined/.test(e.desc)) ar = 'المتغير غير معرّف وقد فعّلت Option Explicit. عرّفه أولًا بالأمر Dim.';
      if (e.line) ar += (ar ? '  ' : '') + '(السطر ' + e.line + ')';
      return showDialog(win, { title: 'Microsoft Visual Basic', icon: 16, msg: msg, ar: ar, buttons: [{ t: 'OK', v: 1 }] });
    },
    ended() {
      const d = document.createElement('div'); d.className = 'vbend';
      d.innerHTML = '<div><b>End</b><span>انتهى البرنامج</span><button>↻ تشغيل من جديد</button></div>';
      d.querySelector('button').onclick = () => ctl.reset(); win.appendChild(d);
    }
  };
  try { it = new VB.Interp({ code, form: spec, host }); it.compile(); } catch (e) {
    if (e instanceof VB.VBError) {
      const d0 = e.desc.replace(/^Compile error:\s*/, '');
      let ar0 = 'يوجد خطأ في كتابة الشيفرة. راجع السطر المذكور.';
      if (/end of string/i.test(d0)) ar0 = 'نص ناقص: فتحت علامة الاقتباس \" ولم تغلقها في نفس السطر. تأكد أن النص كله في سطر واحد بين علامتين. وإن أضفت قطعة جاهزة (مثل If) فتأكد أن المؤشر لم يكن داخل النص.';
      else if (/Expected/i.test(d0)) ar0 = 'الأمر ناقص أو مكتوب بشكل غير صحيح. قارن سطرك بالأمثلة.';
      box.innerHTML = '<div class="cerr" dir="ltr"><b>Compile error</b>' + (e.line ? ' — line ' + e.line : '') + '<br>' + esc(d0) + '<div dir="rtl" style="margin-top:8px;font-family:Cairo,sans-serif;color:#ffd7a8">' + esc(ar0) + (e.line ? ' (السطر ' + e.line + ')' : '') + '</div></div>';
      const ctl0 = { err: e, reset() { }, destroy() { } }; box._ctl = ctl0; return ctl0;
    } throw e;
  }
  const mark = () => { if (!ran) { ran = true; o.onRun && o.onRun(); } };
  const F = (n, ev, a) => { mark(); return it.fire(n, ev, a); };
  const twips = (e, el) => { const r = el.getBoundingClientRect(); const sc = r.width / (el.offsetWidth || 1) || 1; return [Math.round((e.clientX - r.left) / sc * 15), Math.round((e.clientY - r.top) / sc * 15)]; };
  const shiftOf = e => (e.shiftKey ? 1 : 0) | (e.ctrlKey ? 2 : 0) | (e.altKey ? 4 : 0);
  const btnOf = e => e.button === 0 ? 1 : e.button === 2 ? 2 : 4;

  function apply(c) {
    const p = c.props;
    if (c === it.form) { win.querySelector('.vbcap').textContent = p.caption; body.style.background = bgr(p.backcolor); return; }
    const el = els.get(c); if (!el) return;
    const s = el.style;
    s.left = p.left / 15 + 'px'; s.top = p.top / 15 + 'px'; s.width = p.width / 15 + 'px'; s.height = p.height / 15 + 'px';
    s.background = bgr(p.backcolor); s.color = bgr(p.forecolor); s.fontSize = Math.round(p.fontsize * 1.4) + 'px'; s.fontWeight = p.fontbold ? '700' : '400';
    s.display = p.visible ? '' : 'none'; s.textAlign = ['left', 'right', 'center'][p.alignment] || 'left';
    el.classList.toggle('bd1', p.borderstyle === 1);
    if (c.type === 'TextBox') { if (el.value !== p.text) el.value = p.text; el.readOnly = !!p.locked; el.disabled = !p.enabled; if (p.maxlength > 0) el.maxLength = p.maxlength; else el.removeAttribute('maxlength'); } else if (c.type === 'Label') { el.textContent = p.caption; if (!p.enabled) el.style.opacity = .55; else el.style.opacity = ''; } else if (c.type === 'CommandButton') { el.innerHTML = btnHtml(p.caption); el.disabled = !p.enabled; el.classList.toggle('isdef', !!p.default); } else if (c.type === 'Image') { el.textContent = p.picture || ''; s.fontSize = Math.round(Math.min(p.width, p.height) / 15 * .8) + 'px'; }
  }
  const seen = new Set();
  for (const c of it.ctrls.values()) {
    if (c === it.form || seen.has(c)) continue; seen.add(c);
    let el;
    if (c.type === 'TextBox') { el = document.createElement(c.props.multiline ? 'textarea' : 'input'); if (!c.props.multiline) el.type = 'text'; el.setAttribute('dir', 'auto'); el.spellcheck = false; el.autocomplete = 'off'; el.className = 'vbc vbtext'; el.setAttribute('aria-label', c.name); } else if (c.type === 'CommandButton') { el = document.createElement('button'); el.className = 'vbc vbbtn'; } else if (c.type === 'Image') { el = document.createElement('div'); el.className = 'vbc vbimg'; } else { el = document.createElement('div'); el.className = 'vbc vblabel'; el.setAttribute('dir', 'auto'); }
    els.set(c, el); el.dataset.n = c.name; body.appendChild(el);
    const n = c.name;
    el.addEventListener('click', () => { F(n, 'Click'); });
    el.addEventListener('dblclick', () => { F(n, 'DblClick'); });
    el.addEventListener('mousemove', e => { const [x, y] = twips(e, el); F(n, 'MouseMove', [e.buttons, shiftOf(e), x, y]); });
    el.addEventListener('mousedown', e => { const [x, y] = twips(e, el); F(n, 'MouseDown', [btnOf(e), shiftOf(e), x, y]); });
    el.addEventListener('mouseup', e => { const [x, y] = twips(e, el); F(n, 'MouseUp', [btnOf(e), shiftOf(e), x, y]); });
    el.addEventListener('contextmenu', e => e.preventDefault());
    if (c.type === 'TextBox') {
      el.addEventListener('input', () => { c.props.text = el.value; F(n, 'Change'); });
      el.addEventListener('focus', () => F(n, 'GotFocus'));
      el.addEventListener('blur', () => F(n, 'LostFocus'));
      el.addEventListener('keydown', e => { F(n, 'KeyDown', [e.keyCode, shiftOf(e)]); });
    } else if (c.type === 'CommandButton') { el.addEventListener('focus', () => F(n, 'GotFocus')); el.addEventListener('blur', () => F(n, 'LostFocus')); }
    if (c.props.dragmode === 1) {
      el.style.touchAction = 'none'; el.style.cursor = 'grab';
      let st = null, ghost = null;
      el.addEventListener('pointerdown', e => { st = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); });
      el.addEventListener('pointermove', e => {
        if (!st) return;
        if (!ghost && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 5) { ghost = el.cloneNode(true); ghost.className += ' vbghost'; document.body.appendChild(ghost); const r = el.getBoundingClientRect(); ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px'; }
        if (ghost) { const r = el.getBoundingClientRect(); ghost.style.left = e.clientX - r.width / 2 + 'px'; ghost.style.top = e.clientY - r.height / 2 + 'px'; }
      });
      el.addEventListener('pointerup', e => {
        if (ghost) { ghost.remove(); const [x, y] = twips(e, body); const r = body.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) F('Form', 'DragDrop', [c, x, y]); }
        ghost = null; st = null;
      });
      el.addEventListener('pointercancel', () => { if (ghost) ghost.remove(); ghost = null; st = null; });
    }
  }
  body.addEventListener('click', e => { if (e.target === body || e.target === printEl) F('Form', 'Click'); });
  body.addEventListener('dblclick', e => { if (e.target === body || e.target === printEl) F('Form', 'DblClick'); });
  body.addEventListener('mousemove', e => { if (e.target === body || e.target === printEl) { const [x, y] = twips(e, body); F('Form', 'MouseMove', [e.buttons, shiftOf(e), x, y]); } });
  body.addEventListener('mousedown', e => { if (e.target === body || e.target === printEl) { const [x, y] = twips(e, body); F('Form', 'MouseDown', [btnOf(e), shiftOf(e), x, y]); } });
  body.addEventListener('mouseup', e => { if (e.target === body || e.target === printEl) { const [x, y] = twips(e, body); F('Form', 'MouseUp', [btnOf(e), shiftOf(e), x, y]); } });
  body.addEventListener('contextmenu', e => e.preventDefault());
  win.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('.vbov')) return;
    if ((e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') || e.key === 'Escape') {
      const key = e.key === 'Enter' ? 'default' : 'cancel';
      for (const [c] of els) if (c.type === 'CommandButton' && c.props[key] && c.props.visible && c.props.enabled) { e.preventDefault(); F(c.name, 'Click'); return; }
    }
  });
  for (const c of seen) apply(c); apply(it.form);
  const fit = () => {
    const w = win.offsetWidth, h = win.offsetHeight; if (!w) return;
    scale = Math.min(1, (box.clientWidth - 4) / w); win.style.transform = 'scale(' + scale + ')'; hold.style.height = h * scale + 'px'; hold.style.width = w * scale + 'px';
  };
  let ro = null; if (window.ResizeObserver) { ro = new ResizeObserver(fit); ro.observe(box); } fit(); setTimeout(fit, 60);
  const ctl = { it, reset() { mountRunner(box, ex, o); }, destroy() { if (ro) ro.disconnect(); it.ended = true; } };
  box._ctl = ctl;
  it.start().catch(() => { });
  return ctl;
}

/* ---------- example cards ---------- */
const PROPLABEL = { text: 'Text', caption: 'Caption', locked: 'Locked', maxlength: 'MaxLength', cancel: 'Cancel', default: 'Default', dragmode: 'DragMode', alignment: 'Alignment', fontsize: 'Font size', borderstyle: 'BorderStyle' };
function designTable(spec) {
  const rows = spec.controls.map(c => {
    const ps = [];
    for (const k of ['caption', 'text', 'locked', 'maxlength', 'cancel', 'dragmode']) {
      if (c[k] !== undefined && c[k] !== '' && c[k] !== false && c[k] !== 0) ps.push(PROPLABEL[k] + ' = ' + (typeof c[k] === 'string' ? '"' + c[k] + '"' : c[k] === true ? 'True' : c[k]));
    }
    return '<tr><td><bdi class="en">' + esc(c.type) + '</bdi></td><td><bdi class="en">' + esc(c.name) + '</bdi></td><td dir="ltr" class="tl">' + esc(ps.join(' ، ') || '—') + '</td></tr>';
  }).join('');
  return '<div class="tblwrap"><table class="tbl"><thead><tr><th>الأداة</th><th>Name</th><th>الخصائص</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}
function guideHtml(e) {
  const g = e.guide; if (!g) return '';
  const rows = a => a.map(r => '<div class="grow"><div class="gname"><bdi class="en">' + esc(r[0]) + '</bdi></div><div class="gtext">' + rt(r[1]) + '</div></div>').join('');
  return '<details class="guide" open><summary>📖 شرح البرنامج: ماذا يفعل؟</summary>' +
    '<p>' + rt(g.what) + '</p>' +
    (g.ins && g.ins.length ? '<div class="gsub">① ماذا تكتب في الحقول</div>' + rows(g.ins) : '') +
    (g.btns && g.btns.length ? '<div class="gsub">② ماذا يفعل كل زر أو حدث</div>' + rows(g.btns) : '') +
    '<div class="gsub">③ النتيجة المتوقعة</div><p>' + rt(g.res) + '</p>' +
    (g.lines && g.lines.length ? '<div class="gsub">④ شرح الشيفرة سطرًا سطرًا</div>' + g.lines.map(r => '<div class="grow"><div class="gname"><code class="en">' + esc(r[0]) + '</code></div><div class="gtext">' + rt(r[1]) + '</div></div>').join('') : '') +
    (g.steps ? '<div class="gsub">🛠 خطوات تصميمه في Visual Basic 6</div><ol class="gsteps">' + g.steps.map(x => '<li>' + rt(x) + '</li>').join('') + '</ol>' : '') +
    (g.learn ? '<div class="gsub">🎓 ماذا يتعلم الطالب؟</div><p>' + rt(g.learn) + '</p>' : '') +
    (g.tryit ? '<div class="gsub">💡 جرّب</div><p>' + rt(g.tryit) + '</p>' : '') + '</details>';
}
function exCard(id) {
  const e = EX[id];
  return '<section class="excard" data-ex="' + id + '"><div class="exhead"><span class="exbadge">جرّب</span><b>' + rt(e.title) + '</b></div><p class="exdesc">' + rt(e.desc) + '</p>' +
    '<div class="runner"></div><div class="exbtns"><button data-act="reset">↻ إعادة</button><button data-act="code">{ } الشيفرة</button><button data-act="lab">🧪 افتح في المختبر</button></div>' + guideHtml(e) +
    '<div class="excode" hidden><div class="subh">جدول التصميم (الأدوات وخصائصها)</div>' + designTable(e.form) + '<div class="subh">الشيفرة</div>' + codeBlock(e.code) + '</div></section>';
}
function bindEx(root) {
  $$('.excard', root).forEach(card => {
    const id = card.dataset.ex, e = EX[id], box = $('.runner', card);
    mountRunner(box, e, { onRun() { if (!prog.ran[id]) { prog.ran[id] = 1; saveProg(); } } });
    card.addEventListener('click', ev => {
      const b = ev.target.closest('button[data-act]'); if (!b) return;
      if (b.dataset.act === 'reset') box._ctl.reset();
      if (b.dataset.act === 'code') { const c = $('.excode', card); c.hidden = !c.hidden; }
      if (b.dataset.act === 'lab') openLab(id);
    });
  });
}

/* ---------- blocks ---------- */
function renderBlocks(blocks) {
  let h = '';
  for (const b of blocks) {
    const k = b[0];
    if (k === 'h') h += '<h2 class="h3">' + rt(b[1]) + '</h2>';
    else if (k === 'p') h += '<p>' + rt(b[1]) + '</p>';
    else if (k === 'ul') h += '<ul>' + b[1].map(x => '<li>' + rt(x) + '</li>').join('') + '</ul>';
    else if (k === 'ol') h += '<ol>' + b[1].map(x => '<li>' + rt(x) + '</li>').join('') + '</ol>';
    else if (k === 'tip') h += '<div class="callout tip"><span>💡</span><div>' + rt(b[1]) + '</div></div>';
    else if (k === 'warn') h += '<div class="callout warn"><span>⚠️</span><div>' + rt(b[1]) + '</div></div>';
    else if (k === 'note') h += '<div class="callout note"><span>📌</span><div>' + rt(b[1]) + '</div></div>';
    else if (k === 'table') h += '<div class="tblwrap"><table class="tbl"><thead><tr>' + b[1].map(x => '<th>' + rt(x) + '</th>').join('') + '</tr></thead><tbody>' + b[2].map(r => '<tr>' + r.map(x => '<td>' + rt(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    else if (k === 'code') h += codeBlock(b[1], b[2]);
    else if (k === 'ex') h += exCard(b[1]);
    else if (k === 'w') h += '<div class="widget" data-w="' + b[1] + '"></div>';
  }
  return h;
}

/* ---------- widgets ---------- */
const IDEINFO = {
  menu: ['شريط القوائم والأدوات', 'Menu Bar و Toolbar: فيها أوامر المشروع (File, Edit, View, Project, Run…) وأزرار سريعة مثل تشغيل البرنامج Start وإيقافه End.'],
  toolbox: ['صندوق الأدوات Toolbox', 'يحوي 20 أداة قياسية. تسحب منه الأداة إلى النموذج أو تنقر عليها نقرًا مزدوجًا.'],
  form: ['نافذة مصمم النماذج Form Designer', 'سطح الرسم. هنا تصمم واجهة البرنامج وتضع الأدوات. عنوانها الأول Form1 وفيها شبكة نقاط تساعد على المحاذاة.'],
  proj: ['مستكشف المشروع Project Explorer', 'يعرض ملفات المشروع بشكل شجري (Forms و Modules). فيه زرا View Code و View Object. وملف المشروع امتداده VBP.'],
  props: ['نافذة الخصائص Properties Window', 'تعرض خصائص الأداة المحددة. تختار الأداة من القائمة في أعلاها. ولها تبويبان: Alphabetic و Categorized.'],
  layout: ['نافذة مخطط النموذج Form Layout', 'تُريك موقع النموذج على الشاشة وقت التنفيذ. وبالزر الأيمن ← Resolution Guide ترى الدقات المختلفة.'],
  code: ['نافذة محرر الشيفرة Code Editor', 'تكتب فيها الأوامر. تُفتح بالنقر المزدوج على الأداة أو بالمفتاح F7. فيها قائمتان: الكائنات (يسار) والأحداث (يمين).']
};
const TOOLS = [
  ['Pointer', '↖️', 'يعيد مؤشر الفأرة إلى شكله الطبيعي بعد وضع أداة (لا يضع شيئًا على النموذج).'], ['PictureBox', '🖼️', 'لوضع صور على النموذج ودمجها في المشروع.'],
  ['Label', '🔤', 'عنوان للعرض فقط على النموذج.'], ['TextBox', '✏️', 'عرض أو إدخال البيانات مثل اسم الموظف.'],
  ['Frame', '🔲', 'إطار حاضنة للأدوات التي تريد أن تكسبها نفس الخصائص (خاصية التوريث).'], ['CommandButton', '🔘', 'زر لتنفيذ أوامر معينة مثل حفظ وإنهاء وإلغاء.'],
  ['CheckBox', '☑️', 'صندوق اختيار لخيار واحد أو أكثر من مجموعة خيارات.'], ['OptionButton', '🔵', 'لاختيار خيار واحد فقط من مجموعة خيارات.'],
  ['ComboBox', '🔽', 'قائمة منسدلة: تُظهر خيارًا واحدًا ويمكن فتحها لباقي الخيارات.'], ['ListBox', '📃', 'قائمة تضعها على النموذج فيها مجموعة خيارات، وتتيح اختيار أكثر من خيار بآن واحد.'],
  ['HScrollBar', '↔️', 'شريط تمرير أفقي.'], ['VScrollBar', '↕️', 'شريط تمرير عمودي. (الأداتان تستخدمان لوضع شريط تمرير على النافذة).'],
  ['Timer', '⏱️', 'المؤقت: ينفّذ أمرًا معينًا بعد فترة زمنية محددة (خاصية Interval).'], ['DriveListBox', '💽', 'قائمة تُظهر السواقات المرنة والمضغوطة.'],
  ['DirListBox', '📁', 'نفس عمل السابقة لكن تطبق الكلام على المجلدات وما تحتويه.'], ['FileListBox', '🗂️', 'نفس الكلام السابق ولكن بالنسبة للملفات.'],
  ['Shape', '⬛', 'لرسم أشكال هندسية (مستطيل، دائرة…).'], ['Line', '➖', 'لرسم خط على النموذج.'],
  ['Image', '🌄', 'لوضع صور على النماذج (تختلف قليلًا عن PictureBox وهي أخف).'], ['Data', '🗄️', 'للتعامل مع قواعد البيانات.'], ['OLE', '📎', 'للتعامل مع الكائنات مثل برنامج Word و Excel.']
];
const RESERVED = new Set('date integer long single double string boolean variant currency byte dim as if then else elseif end select case const private public static sub function for next to step do loop while wend goto exit call print and or not mod xor is true false option explicit new set let me nothing null empty object'.split(' '));
const widgets = {
  ide(el) {
    el.innerHTML = '<div class="ide" dir="ltr"><button class="r r-menu" data-r="menu">Menu Bar · Toolbar</button><div class="ide-main"><button class="r r-tb" data-r="toolbox">Toolbox</button><button class="r r-form" data-r="form"><span>Form1</span></button><div class="ide-right"><button class="r" data-r="proj">Project Explorer</button><button class="r" data-r="props">Properties</button><button class="r" data-r="layout">Form Layout</button></div></div><button class="r r-code" data-r="code">Code Editor (F7)</button></div><div class="winfo" id="ideinfo">اضغط على أي جزء.</div>';
    el.addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; $$('.r', el).forEach(x => x.classList.remove('on')); b.classList.add('on'); const i = IDEINFO[b.dataset.r]; $('.winfo', el).innerHTML = '<b>' + esc(i[0]) + '</b><p>' + rt(i[1]) + '</p>'; });
  },
  toolbox(el) {
    el.innerHTML = '<div class="tools" dir="ltr">' + TOOLS.map((t, i) => '<button data-i="' + i + '"><span>' + t[1] + '</span><small>' + t[0] + '</small></button>').join('') + '</div><div class="winfo">اضغط على أداة لتعرف وظيفتها.</div>';
    el.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; $$('button', el).forEach(x => x.classList.remove('on')); b.classList.add('on'); const t = TOOLS[b.dataset.i]; $('.winfo', el).innerHTML = '<b><bdi class="en">' + t[0] + '</bdi></b><p>' + esc(t[2]) + '</p>'; });
  },
  namecheck(el) {
    el.innerHTML = '<label class="wl">اكتب اسم متغير:</label><input class="winput" dir="ltr" value="My Name" spellcheck="false"><div class="rules"></div>';
    const inp = $('input', el), out = $('.rules', el);
    const run = () => {
      const v = inp.value;
      const R = [['يبدأ بحرف (لا برقم)', /^[A-Za-z]/.test(v)], ['بلا فراغات', v.length > 0 && !/\s/.test(v)], ['لا يزيد عن 255 حرفًا', v.length > 0 && v.length <= 255], ['بلا إشارات (+ - * . ,)', v.length > 0 && /^[A-Za-z0-9_]+$/.test(v.replace(/\s/g, ''))], ['ليس كلمة محجوزة', v.length > 0 && !RESERVED.has(v.toLowerCase())]];
      const ok = R.every(r => r[1]);
      out.innerHTML = R.map(r => '<div class="rule ' + (r[1] ? 'ok' : 'no') + '"><span>' + (r[1] ? '✓' : '✗') + '</span>' + esc(r[0]) + '</div>').join('') + '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' + (ok ? 'اسم صحيح ✔' : 'اسم خاطئ ✘') + '</div>';
    };
    inp.addEventListener('input', run); run();
  },
  types(el) {
    el.innerHTML = '<div class="memdemo"><div class="mrow"><label>الاسم<input id="mn" dir="ltr" value="x"></label><label>النوع<select id="mt" dir="ltr"><option>Integer</option><option>Long</option><option>Single</option><option>Double</option><option>String</option><option>Boolean</option><option>Variant</option></select></label><label>القيمة<input id="mv" dir="ltr" value="3.7"></label></div><div class="mcode" dir="ltr"></div><div class="mbox"></div></div>';
    const run = () => {
      const n = $('#mn', el).value || 'x', t = $('#mt', el).value, v = $('#mv', el).value;
      let res, err = null, val = isNaN(v) || v.trim() === '' ? v : parseFloat(v);
      try { res = VB.coerce(t.toLowerCase(), val); } catch (e) { err = e; }
      $('.mcode', el).innerHTML = hl('Dim ' + n + ' As ' + t + '\n' + n + ' = ' + (typeof val === 'string' ? '"' + val + '"' : val));
      $('.mbox', el).innerHTML = err ? '<div class="memerr">⛔ ' + (err.num === 6 ? 'Overflow — القيمة أكبر من سعة النوع' : 'Type mismatch — النوع لا يقبل هذه القيمة') + '</div>' : '<div class="memcell"><small dir="ltr">' + esc(n) + ' : ' + t + '</small><b dir="auto">' + esc(typeof res === 'boolean' ? (res ? 'True' : 'False') : String(res)) + '</b></div>';
    };
    $$('input,select', el).forEach(x => x.addEventListener('input', run)); run();
  },
  msgbuilder(el) {
    el.innerHTML = '<div class="mb"><div class="mrow"><label>الأزرار<select id="bb" dir="ltr"><option value="0">0 — OK</option><option value="1">1 — OK / Cancel</option><option value="2">2 — Abort / Retry / Ignore</option><option value="3">3 — Yes / No / Cancel</option><option value="4">4 — Yes / No</option><option value="5">5 — Retry / Cancel</option></select></label><label>الأيقونة<select id="bi" dir="ltr"><option value="0">0 — none</option><option value="16">16 — Critical</option><option value="32">32 — Question</option><option value="48">48 — Exclamation</option><option value="64">64 — Information</option></select></label></div><div class="mcode" dir="ltr"></div><button class="btn" id="bs">▶ اعرض الصندوق</button><div class="mbstage"></div><div class="mbres"></div></div>';
    const code = () => { const b = +$('#bb', el).value, i = +$('#bi', el).value; $('.mcode', el).innerHTML = hl('MsgBox "Save Changes?", ' + b + (i ? ' + ' + i : '') + ', "Exit"\n\' symbol value = ' + (b + i)); };
    $$('select', el).forEach(s => s.addEventListener('change', code)); code();
    $('#bs', el).onclick = async () => {
      const st = $('.mbstage', el); st.innerHTML = '<div class="vbwin small"><div class="vbtitle"><span>Exit</span></div><div class="vbbody" style="width:100%;height:150px"></div></div>';
      const w = st.firstChild, sym = +$('#bb', el).value + +$('#bi', el).value;
      const v = await msgDialog(w.querySelector('.vbbody'), 'Save Changes?', sym, 'Exit');
      const names = { 1: 'OK', 2: 'Cancel', 3: 'Abort', 4: 'Retry', 5: 'Ignore', 6: 'Yes', 7: 'No' };
      $('.mbres', el).innerHTML = 'القيمة المرجعة: <b class="en">' + v + '</b> (' + names[v] + ')';
    };
  },
  mouse(el) {
    el.innerHTML = '<div class="mouse" dir="ltr"><div class="marea">Move / click here</div><div class="mout"><div><span>Event</span><b id="m_e">—</b></div><div><span>Button</span><b id="m_b">0</b></div><div><span>Shift</span><b id="m_s">0</b></div><div><span>X</span><b id="m_x">0</b></div><div><span>Y</span><b id="m_y">0</b></div></div></div><div class="winfo">اضغط بأزرار الفأرة المختلفة (أو Shift / Ctrl / Alt مع النقر). على الهاتف يظهر الزر الأيسر فقط.</div>';
    const a = $('.marea', el);
    const upd = (ev, e, btn) => { const r = a.getBoundingClientRect(); $('#m_e', el).textContent = ev; $('#m_b', el).textContent = btn; $('#m_s', el).textContent = (e.shiftKey ? 1 : 0) | (e.ctrlKey ? 2 : 0) | (e.altKey ? 4 : 0); $('#m_x', el).textContent = Math.round((e.clientX - r.left) * 15); $('#m_y', el).textContent = Math.round((e.clientY - r.top) * 15); };
    a.addEventListener('mousemove', e => upd('MouseMove', e, e.buttons));
    a.addEventListener('mousedown', e => upd('MouseDown', e, e.button === 0 ? 1 : e.button === 2 ? 2 : 4));
    a.addEventListener('mouseup', e => upd('MouseUp', e, e.button === 0 ? 1 : e.button === 2 ? 2 : 4));
    a.addEventListener('click', e => upd('Click', e, 1));
    a.addEventListener('dblclick', e => upd('DblClick', e, 1));
    a.addEventListener('contextmenu', e => e.preventDefault());
  }
};
function bindWidgets(root) { $$('.widget', root).forEach(w => { if (widgets[w.dataset.w]) widgets[w.dataset.w](w); }); }

/* ---------- quiz engine ---------- */
function runQuiz(box, list, opt) {
  opt = opt || {};
  const qs = shuffle(list).slice(0, opt.n || list.length).map(q => { const all = shuffle([q.ok].concat(q.bad)); return Object.assign({}, q, { all, idx: all.indexOf(q.ok) }); });
  let i = 0, score = 0; const wrong = [];
  function show() {
    const q = qs[i];
    box.innerHTML = '<div class="qprog"><span>سؤال ' + (i + 1) + ' من ' + qs.length + '</span><div class="bar"><i style="width:' + (i / qs.length * 100) + '%"></i></div></div>' +
      '<div class="qcard"><div class="qtext">' + rt(q.q) + '</div>' + (q.c ? '<pre class="code" dir="ltr">' + hl(q.c) + '</pre>' : '') +
      '<div class="opts">' + q.all.map((o, k) => '<button class="opt" data-k="' + k + '">' + rt(o) + '</button>').join('') + '</div><div class="qfb" hidden></div></div>';
    $$('.opt', box).forEach(b => b.onclick = () => {
      const k = +b.dataset.k; $$('.opt', box).forEach(x => x.disabled = true);
      const okb = $$('.opt', box)[q.idx]; okb.classList.add('right');
      const fb = $('.qfb', box); fb.hidden = false;
      if (k === q.idx) { score++; fb.className = 'qfb good'; fb.innerHTML = '<b>أحسنت ✔</b> ' + rt(q.e); } else { b.classList.add('wrong'); wrong.push(q); fb.className = 'qfb bad'; fb.innerHTML = '<b>الإجابة الصحيحة: </b>' + rt(q.ok) + '<br>' + rt(q.e); }
      const nx = document.createElement('button'); nx.className = 'btn'; nx.textContent = i + 1 < qs.length ? 'التالي ←' : 'عرض النتيجة'; nx.onclick = () => { i++; i < qs.length ? show() : finish(); }; fb.after(nx);
    });
  }
  function finish() {
    const pct = Math.round(score / qs.length * 100);
    const g = pct >= 90 ? 'ممتاز' : pct >= 80 ? 'جيد جدًا' : pct >= 70 ? 'جيد' : pct >= 60 ? 'متوسط' : pct >= 50 ? 'مقبول' : 'راسب';
    box.innerHTML = '<div class="result"><div class="ring big" style="--p:' + pct + '"><b>' + pct + '%</b></div><h3>' + score + ' من ' + qs.length + ' — ' + g + '</h3>' +
      (wrong.length ? '<div class="subh">راجع هذه الأسئلة:</div>' + wrong.map(q => '<div class="rev"><div>' + rt(q.q) + '</div>' + (q.c ? '<pre class="code" dir="ltr">' + hl(q.c) + '</pre>' : '') + '<div class="ans">✔ ' + rt(q.ok) + '</div><small>' + rt(q.e) + '</small></div>').join('') : '<p>إجابات كلها صحيحة! 🎉</p>') +
      '<button class="btn" id="qre">↻ أعد المحاولة</button></div>';
    $('#qre', box).onclick = () => runQuiz(box, list, opt);
    opt.onDone && opt.onDone(pct);
  }
  show();
}

/* ---------- views ---------- */
let labState = { id: 'lab0', code: null };
const view = $('#view');
const chapterProg = c => {
  const ids = Object.keys(EX).filter(k => EX[k].ch === c.id); const r = ids.filter(k => prog.ran[k]).length;
  const qb = (prog.quiz[c.id] || 0) / 100;
  return { pct: Math.round((qb * 0.6 + (ids.length ? r / ids.length : 0) * 0.4) * 100), ran: r, total: ids.length, q: prog.quiz[c.id] || 0 };
};
const overall = () => Math.round(CH.reduce((a, c) => a + chapterProg(c).pct, 0) / CH.length);

function viewHome() {
  const ov = overall();
  view.innerHTML = '<section class="hero"><div class="herotxt"><div class="hcol"><img src="' + window.LOGO + '" alt="شعار الكلية"><div><span>كلية الإدارة والاقتصاد</span><span>قسم نظم المعلومات الإدارية</span><h1>حقيبة البرمجة المرئية</h1></div></div><p>اشرح ← جرّب ← اختبر نفسك. كل مثال برمجي يعمل أمامك فعليًا، وتستطيع تعديل شيفرته.</p>' +
    '<div class="herobtns"><a class="btn" href="#' + (prog.last ? 'ch' + prog.last : 'ch1') + '">' + (prog.last ? 'تابع من حيث توقفت' : 'ابدأ التعلم') + '</a><a class="btn ghost" href="#lab">🧪 المختبر</a></div></div>' +
    '<div class="ring" style="--p:' + ov + '"><b>' + ov + '%</b><small>إنجازك</small></div></section>' +
    (isStandalone() ? '' : '<div class="install"><span>📲</span><div><b>ثبّت التطبيق على جهازك</b><small>على الحاسوب أو الهاتف، ويعمل بدون إنترنت</small></div><button class="btn" onclick="installApp()">تثبيت</button></div>') +
    '<div class="invite"><img src="' + window.QR + '" alt="رمز QR لرابط التطبيق"><div class="invtxt"><b>📣 ادعُ زملاءك</b><small>امسح الرمز بكاميرا الهاتف لفتح التطبيق</small><bdi class="en">' + APPURL.replace('https://', '') + '</bdi>' +
    '<div class="invbtns"><button class="btn small" onclick="shareApp()">مشاركة</button><button class="btn small ghost" onclick="copyApp(this)">نسخ الرابط</button><a class="btn small ghost" href="' + window.QR + '" download="VisualBasic-QR.png">تنزيل QR</a></div></div></div>' +
    '<h2 class="sec">الفصول</h2><div class="cards">' + CH.map(c => { const p = chapterProg(c); return '<a class="chcard" href="#ch' + c.id + '" style="--c:' + c.color + '"><div class="chico">' + c.icon + '</div><div class="chnum">الفصل ' + c.id + '</div><b>' + esc(c.title) + '</b><small dir="auto">' + esc(c.sub) + '</small><div class="bar"><i style="width:' + p.pct + '%"></i></div><div class="chmeta">' + p.ran + '/' + p.total + ' أمثلة · اختبار ' + p.q + '%</div><div class="chnew"><span class="newbadge">جديد</span> ' + ((PRACTICE[c.id] || []).length) + ' سؤالًا تدريبيًا</div></a>'; }).join('') + '</div>' +
    '<h2 class="sec">أدوات سريعة</h2><div class="quick"><a href="#apps"><span>🎨</span>تصميمات<small>' + APPS.length + ' تطبيقًا جاهزًا</small></a><a href="#lab"><span>🧪</span>مختبر VB<small>اكتب وشغّل</small></a><a href="#exam"><span>📝</span>الاختبار الشامل<small>20 سؤالًا</small></a><a href="#gloss"><span>📖</span>المسرد<small>' + GLOSS.length + ' مصطلحًا</small></a><a href="#me"><span>📊</span>تقدّمي<small>ملاحظات</small></a></div>' +
    footer();
}
const footer = () => '<footer class="foot"><b>تصميم وبرمجة :</b><br>م. سهير عبد داؤد<br>م. لمى فواز الدليمي<br>م.م. علي عبد الوهاب الصفار<small>المحتوى مبني على محاضرات مادة البرمجة المرئية</small></footer>';

let chTab = 'learn';
function viewChapter(id) {
  const c = CH[id - 1]; if (!c) return viewHome();
  prog.last = id; saveProg();
  const tabs = [['learn', 'الشرح'], ['quiz', 'اختبر نفسك'], ['practice', 'تدريب <span class="newbadge">جديد</span>'], ['tasks', 'واجبات']];
  view.innerHTML = '<div class="chhead" style="--c:' + c.color + '"><a class="back" href="#home">‹ الرئيسية</a><div class="chico">' + c.icon + '</div><div><div class="chnum">الفصل ' + c.id + ' من ' + CH.length + '</div><h1>' + esc(c.title) + '</h1></div></div>' +
    '<div class="tabs2">' + tabs.map(t => '<button data-t="' + t[0] + '" class="' + (chTab === t[0] ? 'on' : '') + '">' + t[1] + '</button>').join('') + '</div><div id="chbody" class="chbody"></div>';
  const body = $('#chbody');
  const draw = () => {
    $$('.tabs2 button').forEach(b => b.classList.toggle('on', b.dataset.t === chTab));
    if (chTab === 'learn') {
      body.innerHTML = renderBlocks(c.blocks) + '<div class="pager">' + (id > 1 ? '<a class="btn ghost" href="#ch' + (id - 1) + '">› السابق</a>' : '<span></span>') + '<button class="btn" data-go="quiz">اختبر نفسك ←</button></div>';
      bindEx(body); bindWidgets(body);
    } else if (chTab === 'quiz') {
      body.innerHTML = '<div class="qintro"><b>اختبار الفصل ' + c.id + '</b><span>' + c.quiz.length + ' سؤالًا. أفضل نتيجة لك: ' + (prog.quiz[c.id] || 0) + '%</span></div><div id="qbox"></div>';
      runQuiz($('#qbox'), c.quiz, { onDone(p) { if (p > (prog.quiz[c.id] || 0)) { prog.quiz[c.id] = p; saveProg(); } } });
    } else if (chTab === 'practice') {
      const P = PRACTICE[c.id] || []; prog.prac = prog.prac || {};
      body.innerHTML = '<div class="qintro pracintro"><b>🏋️ أسئلة تدريبية <span class="newbadge">جديد</span></b><span>' + P.length + ' سؤالًا جديدًا للتدرّب على الفصل ' + c.id + '، مع التصحيح والتوضيح. أفضل نتيجة لك: ' + (prog.prac[c.id] || 0) + '%</span>' +
        '<div class="pracn"><span>عدد الأسئلة:</span>' + [10, 20, P.length].map(n => '<button class="btn small' + (n === P.length ? '' : ' ghost') + '" data-pn="' + n + '">' + (n === P.length ? 'كلها (' + n + ')' : n) + '</button>').join('') + '</div></div><div id="qbox"></div>';
      const start = n => { $$('.pracn .btn', body).forEach(b => b.classList.toggle('ghost', +b.dataset.pn !== n)); runQuiz($('#qbox'), P, { n, onDone(pc) { if (n === P.length && pc > (prog.prac[c.id] || 0)) { prog.prac[c.id] = pc; saveProg(); } } }); };
      $$('.pracn .btn', body).forEach(b => b.onclick = () => start(+b.dataset.pn));
      start(P.length);
    } else {
      body.innerHTML = '<p class="muted">حاول الحل بنفسك أولًا ثم اضغط «الحل».</p>' + c.tasks.map((t, i) => '<div class="task"><div class="tnum">' + (i + 1) + '</div><div class="tbody"><div>' + rt(t.t) + '</div>' + (t.a ? '<details><summary>عرض الحل</summary>' + (/^(Private Sub|MsgBox)/.test(t.a) ? '<pre class="code" dir="ltr">' + hl(t.a) + '</pre>' : '<p>' + esc(t.a).replace(/\n/g, '<br>') + '</p>') + '</details>' : '') + (t.ex ? '<button class="btn small" data-lab="' + t.ex + '">🧪 جرّب الحل في المختبر</button>' : '') + '</div></div>').join('');
    }
  };
  draw();
  view.addEventListener('click', function h(e) {
    if (!view.contains(body)) { view.removeEventListener('click', h); return; }
    const t = e.target.closest('.tabs2 button'); if (t) { chTab = t.dataset.t; draw(); window.scrollTo(0, 0); return; }
    const g = e.target.closest('[data-go]'); if (g) { chTab = g.dataset.go; draw(); window.scrollTo(0, 0); }
    const l = e.target.closest('[data-lab]'); if (l) openLab(l.dataset.lab);
  });
}

const SNIP = [['Click', 'Private Sub Command1_Click()\n\nEnd Sub\n'], ['If', 'If x > 0 Then\n   \nElse\n   \nEnd If\n'], ['Select', 'Select Case x\nCase 1\n   \nCase Else\n   \nEnd Select\n'], ['InputBox', 'x = Val(InputBox("Enter x", "Title"))\n'], ['MsgBox', 'MsgBox "Hello", 64, "Title"\n'], ['Dim', 'Dim x As Integer\n']];
function openLab(id, code) { labState = { id: id, code: code == null ? null : code }; if (location.hash === '#lab') viewLab(); else location.hash = '#lab'; }
function viewLab() {
  const e = EX[labState.id] || EX.lab0;
  const groups = [[0, 'مختبر فارغ'], ['cmd', 'أمثلة الأوامر السريعة'], ['apps', 'تصميمات: تطبيقات جاهزة']].concat(CH.map(c => [c.id, 'الفصل ' + c.id + ': ' + c.title]));
  view.innerHTML = '<div class="pagehead"><h1>🧪 مختبر Visual Basic</h1><p>اختر مثالًا أو اكتب شيفرتك. ثم اضغط «تشغيل». الأدوات في النموذج تتفاعل كما في برنامج حقيقي.</p></div>' +
    '<label class="wl">اختر مثالًا:</label><select id="labsel" class="sel" aria-label="اختر مثالًا">' + groups.map(g => '<optgroup label="' + esc(g[1]) + '">' + Object.values(EX).filter(x => x.ch === g[0]).map(x => '<option value="' + x.id + '"' + (x.id === e.id ? ' selected' : '') + '>' + esc(x.title) + '</option>').join('') + '</optgroup>').join('') + '</select>' +
    '<div class="runner lab" id="labrun"></div><div class="exbtns"><button class="btn" id="labgo">▶ تشغيل الشيفرة</button><button class="btn ghost" id="labreset">↺ استرجع الشيفرة الأصلية</button></div>' + guideHtml(e) +
    '<div class="snips">' + SNIP.map((s, i) => '<button data-s="' + i + '">+ ' + s[0] + '</button>').join('') + '<button data-clear="1">🗑 مسح المحرر</button></div>' +
    '<div class="subh">مثال كامل لكل أمر (يُحمَّل في المحرر):</div><div class="snips ex2">' + [['cmd_dim', 'Dim'], ['cmd_msgbox', 'MsgBox'], ['cmd_inputbox', 'InputBox'], ['cmd_select', 'Select Case'], ['cmd_if', 'If'], ['cmd_click', 'Click']].map(x => '<button data-ex2="' + x[0] + '"' + (e.id === x[0] ? ' class="on"' : '') + '>▶ ' + x[1] + '</button>').join('') + '</div>' +
    '<textarea id="labcode" class="editor" aria-label="محرر الشيفرة" dir="ltr" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>' +
    '<details class="cheat"><summary>📋 ورقة مرجعية سريعة</summary><div class="cheatbody" dir="ltr"><pre class="code">' + hl(CHEAT) + '</pre></div></details>' + footer();
  const ta = $('#labcode'); ta.value = labState.code != null ? labState.code : e.code;
  const run = () => { labState.code = ta.value; const c = mountRunner($('#labrun'), e, { code: ta.value }); };
  run();
  $('#labsel').onchange = ev => { labState = { id: ev.target.value, code: null }; viewLab(); };
  $('#labgo').onclick = run;
  $('#labreset').onclick = () => { ta.value = e.code; run(); };
  ta.addEventListener('keydown', ev => {
    if (ev.key === 'Tab') { ev.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '   ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 3; }
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') { ev.preventDefault(); run(); }
  });
  let lastSnip = null; // آخر قطعة أُدرجت: {start, text}
  const snipHandler = ev => {
    const e2 = ev.target.closest('[data-ex2]'); if (e2) { labState = { id: e2.dataset.ex2, code: null }; viewLab(); return; }
    const clr = ev.target.closest('[data-clear]');
    if (clr) { ta.value = ''; lastSnip = null; ta.focus(); return; }
    const b = ev.target.closest('[data-s]'); if (!b) return;
    const t = SNIP[b.dataset.s][1]; let v = ta.value;
    // إن كانت القطعة السابقة ما زالت كما أُدرجت دون تعديل، نستبدلها بالجديدة
    if (lastSnip && v.slice(lastSnip.start, lastSnip.start + lastSnip.text.length) === lastSnip.text) {
      ta.value = v.slice(0, lastSnip.start) + t + v.slice(lastSnip.start + lastSnip.text.length);
      lastSnip = { start: lastSnip.start, text: t };
      ta.focus(); ta.selectionStart = ta.selectionEnd = lastSnip.start + t.length; return;
    }
    // وإلا نُدرجها في سطر جديد بعد السطر الحالي، حتى لا تدخل داخل نص بين علامتي اقتباس
    let s = ta.selectionStart;
    let ls = v.lastIndexOf('\n', s - 1) + 1, le = v.indexOf('\n', s); if (le < 0) le = v.length;
    const line = v.slice(ls, le).trim();
    let pos = line === '' ? ls : le + 1, pre = '';
    if (line !== '' && le === v.length) { pre = '\n'; pos = v.length; }
    ta.value = v.slice(0, pos) + pre + t + v.slice(pos);
    lastSnip = { start: pos + pre.length, text: t };
    ta.focus(); ta.selectionStart = ta.selectionEnd = pos + pre.length + t.length;
  };
  $$('.snips').forEach(el => { el.onclick = snipHandler; });
  ta.addEventListener('input', () => { lastSnip = null; });
}
const CHEAT = String.raw`' Events
Private Sub Command1_Click()
Private Sub Text1_Change()
Private Sub Form_Load()

' Properties
Label1.Caption = "Hi"        ' text shown
Text1.Text = ""              ' value in box
Label1.ForeColor = vbBlue
Text1.Visible = False

' Variables
Dim x As Integer, s As String
Const PI As Single = 3.14

' Input / Output
x = Val(InputBox("Enter x", "Title"))
MsgBox "Done", 64, "Title"
Print "x = "; x

' Decisions
If x > 0 Then ... ElseIf ... Else ... End If
Select Case x: Case 1 To 5: Case Is > 9: Case Else
GoTo MyLabel`;

/* exam */
let examState = null;
function viewExam() {
  const all = []; CH.forEach(c => c.quiz.forEach(q => all.push(q)));
  view.innerHTML = '<div class="pagehead"><h1>📝 الاختبار الشامل</h1><p>20 سؤالًا عشوائيًا من الفصول الستة. التقدير بحسب سلّم المحاضرة.</p></div><div id="exbox"></div>' + footer();
  const box = $('#exbox');
  const intro = () => {
    box.innerHTML = '<div class="qintro big"><b>جاهز؟</b><span>أفضل نتيجة سابقة: ' + (prog.exam || 0) + '%</span><div class="scale"><span>90+ ممتاز</span><span>80 جيد جدًا</span><span>70 جيد</span><span>60 متوسط</span><span>50 مقبول</span><span>أقل: راسب</span></div><button class="btn" id="exgo">ابدأ الاختبار</button></div>';
    $('#exgo').onclick = () => runQuiz(box, all, { n: 20, onDone(p) { if (p > (prog.exam || 0)) { prog.exam = p; saveProg(); } } });
  };
  intro();
}
function viewGloss() {
  view.innerHTML = '<div class="pagehead"><h1>📖 مسرد المصطلحات</h1></div><input id="gs" class="winput" placeholder="ابحث عن مصطلح…" dir="auto"><div id="gl" class="gl"></div>' + footer();
  const draw = q => { q = q.trim().toLowerCase(); $('#gl').innerHTML = GLOSS.filter(g => !q || g[0].toLowerCase().includes(q) || g[1].includes(q)).map(g => '<div class="gi"><bdi class="en">' + esc(g[0]) + '</bdi><span>' + esc(g[1]) + '</span></div>').join('') || '<p class="muted">لا نتائج.</p>'; };
  $('#gs').oninput = e => draw(e.target.value); draw('');
}
function viewMe() {
  view.innerHTML = '<div class="pagehead"><h1>📊 تقدّمي</h1></div><div class="cards2">' + CH.map(c => { const p = chapterProg(c); return '<div class="prow" style="--c:' + c.color + '"><div class="pico">' + c.icon + '</div><div class="pmid"><b>الفصل ' + c.id + ': ' + esc(c.title) + '</b><div class="bar"><i style="width:' + p.pct + '%"></i></div><small>' + p.ran + '/' + p.total + ' أمثلة · اختبار ' + p.q + '%</small></div><div class="ppct">' + p.pct + '%</div></div>'; }).join('') + '</div>' +
    '<div class="prow"><div class="pico">📝</div><div class="pmid"><b>الاختبار الشامل</b><small>أفضل نتيجة</small></div><div class="ppct">' + (prog.exam || 0) + '%</div></div>' +
    '<h2 class="sec">ملاحظاتي</h2><p class="muted">اكتب ما تريد سؤال الأستاذ عنه في المحاضرة. تُحفظ على هذا الجهاز فقط.</p>' +
    CH.map(c => '<label class="wl">الفصل ' + c.id + ': ' + esc(c.title) + '</label><textarea class="note" data-n="' + c.id + '" placeholder="ملاحظاتك…" dir="auto">' + esc(prog.notes[c.id] || '') + '</textarea>').join('') +
    '<button class="btn ghost danger" id="rst">مسح تقدّمي</button>' + footer();
  $$('.note').forEach(t => t.oninput = () => { prog.notes[t.dataset.n] = t.value; saveProg(); });
  let armed = false; $('#rst').onclick = e => { if (!armed) { armed = true; e.target.textContent = 'اضغط مرة أخرى للتأكيد'; return; } prog = { quiz: {}, ran: {}, notes: {}, last: null, exam: 0 }; saveProg(); viewMe(); };
}

/* ---------- تصميمات ---------- */
const APPS = Object.values(EX).filter(e => e.ch === 'apps');
const APPICON = { app_calc: '🧮', app_bmi: '⚖️', app_temp: '🌡️', app_currency: '💱', app_invoice: '🧾', app_salary: '💰', app_guess: '🎯', app_rps: '✊', app_table: '✖️', app_traffic: '🚦', app_quiz: '❓' };
function viewApps(sel) {
  const done = CH.filter(c => chapterProg(c).pct >= 60).length;
  const cur = sel || (location.hash.split('/')[1]) || null;
  view.innerHTML = '<div class="pagehead"><h1>🎨 تصميمات</h1><p>تطبيقات صغيرة جميلة تستطيع تصميمها بنفسك في Visual Basic 6 بعد إنهاء المنهج. كل تطبيق يعمل هنا، ومعه جدول التصميم وخطوات البناء والشيفرة كاملة.</p></div>' +
    '<div class="callout ' + (done === CH.length ? 'tip' : 'note') + '"><span>' + (done === CH.length ? '🏆' : '📌') + '</span><div>' + (done === CH.length ? 'أنهيت الفصول كلها. أنت جاهز لتصميم هذه التطبيقات!' : 'أنهيت ' + done + ' من ' + CH.length + ' فصول. يمكنك تجربة التطبيقات الآن، لكن ستفهمها أفضل بعد إنهاء الفصول.') + '</div></div>' +
    '<div class="appgrid">' + APPS.map(e => '<a class="appcard' + (cur === e.id ? ' on' : '') + '" href="#apps/' + e.id + '"><span>' + (APPICON[e.id] || '🧩') + '</span><b>' + rt(e.title) + '</b>' + (prog.ran[e.id] ? '<i>✔</i>' : '') + '</a>').join('') + '</div>' +
    '<div class="callout tip"><span>💡</span><div>لكل تطبيق: اضغط «{ } الشيفرة» لترى <b>جدول التصميم</b> (الأدوات وخصائصها) ثم الشيفرة. انسخهما إلى VB6 وابنِ التطبيق بنفسك.</div></div>' +
    '<div id="appcards">' + APPS.filter(e => !cur || e.id === cur).map(e => exCard(e.id)).join('') + '</div>' +
    (cur ? '<div class="pager"><a class="btn ghost" href="#apps">← كل التطبيقات</a></div>' : '') + footer();
  bindEx(view);
}

/* ---------- router ---------- */
const NAV = [['home', '🏠', 'الرئيسية'], ['lab', '🧪', 'المختبر'], ['exam', '📝', 'الاختبار'], ['gloss', '📖', 'المسرد'], ['me', '📊', 'تقدّمي'], ['apps', '🎨', 'تصميمات']];
function route() {
  const h = (location.hash || '#home').slice(1);
  if (view.querySelector('.runner') ) $$('.runner', view).forEach(r => r._ctl && r._ctl.destroy());
  let tab = h;
  if (/^apps\//.test(h)) { tab = 'apps'; viewApps(h.split('/')[1]); } else if (/^ch\d$/.test(h)) { tab = 'home'; viewChapter(+h.slice(2)); } else if (h === 'lab') viewLab(); else if (h === 'apps') viewApps(); else if (h === 'exam') viewExam(); else if (h === 'gloss') viewGloss(); else if (h === 'me') viewMe(); else { tab = 'home'; viewHome(); }
  document.body.classList.toggle('home', tab === 'home' && !/^ch\d$/.test(h));
  $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.k === tab));
  if (!/^ch\d$/.test(h) || true) window.scrollTo(0, 0);
}
$('#nav').innerHTML = NAV.map(n => '<a href="#' + n[0] + '" data-k="' + n[0] + '"><span>' + n[1] + '</span>' + n[2] + '</a>').join('');
window.addEventListener('hashchange', route);
/* ---------- دعوة الطلبة ---------- */
const APPURL = 'https://alialsaffarmosuluniversity.github.io/VisulaBasic/';
const INVITE = 'حقيبة البرمجة المرئية — Visual Basic 6\nكلية الإدارة والاقتصاد · قسم نظم المعلومات الإدارية\nشرح وأمثلة تعمل واختبارات:\n' + APPURL;
window.shareApp = async () => {
  if (navigator.share) { try { await navigator.share({ title: 'حقيبة البرمجة المرئية', text: INVITE }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  window.open('https://wa.me/?text=' + encodeURIComponent(INVITE), '_blank');
};
window.copyApp = async btn => {
  try { await navigator.clipboard.writeText(APPURL); } catch (e) { const t = document.createElement('textarea'); t.value = APPURL; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); }
  const o = btn.textContent; btn.textContent = '✔ تم النسخ'; setTimeout(() => { btn.textContent = o; }, 1500);
};

/* ---------- التثبيت كتطبيق ---------- */
let deferredInstall = null;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
if ('serviceWorker' in navigator && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(() => {}); }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; });
window.addEventListener('appinstalled', () => { deferredInstall = null; if (/^#?(home)?$/.test(location.hash)) route(); });
window.installApp = async () => {
  if (deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const steps = ios
    ? ['افتح الرابط في متصفح Safari.', 'اضغط زر المشاركة ⬆️ في أسفل الشاشة.', 'اختر «إضافة إلى الشاشة الرئيسية».', 'اضغط «إضافة».']
    : ['افتح الرابط في Chrome أو Edge.', 'في الحاسوب: اضغط أيقونة التثبيت ⊕ في آخر شريط العنوان.', 'في الهاتف: اضغط القائمة ⋮ ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».'];
  const ov = document.createElement('div'); ov.className = 'instov';
  ov.innerHTML = '<div class="instbox"><b>📲 تثبيت التطبيق</b><ol>' + steps.map(s => '<li>' + s + '</li>').join('') + '</ol><p class="muted">بعد التثبيت يفتح التطبيق من أيقونته مثل أي تطبيق، ويعمل حتى بدون إنترنت.</p>' +
    '<p class="muted">الرابط: <bdi class="en">alialsaffarmosuluniversity.github.io/VisulaBasic</bdi></p><button class="btn">حسنًا</button></div>';
  ov.onclick = ev => { if (ev.target === ov || ev.target.tagName === 'BUTTON') ov.remove(); };
  document.body.appendChild(ov);
};
$('#themebtn').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('vbtheme', t); } catch (e) {}
};
route();
})();
