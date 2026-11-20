/* ===== VB6 mini interpreter (teaching subset) ===== */
(function (root) {
'use strict';
class VBError extends Error {
  constructor(num, desc, kind, line) { super(desc); this.num = num; this.desc = desc; this.kind = kind || 'run'; this.line = line; }
}
class EndSignal {}
class ExitSignal { constructor(k) { this.k = k; } }
class GotoSignal { constructor(l) { this.l = l; } }

const COLORS = { vbblack: 0, vbred: 255, vbgreen: 65280, vbyellow: 65535, vbblue: 16711680, vbmagenta: 16711935, vbcyan: 16776960, vbwhite: 16777215 };
const CONSTS = Object.assign({}, COLORS, {
  vbokonly: 0, vbokcancel: 1, vbabortretryignore: 2, vbyesnocancel: 3, vbyesno: 4, vbretrycancel: 5,
  vbcritical: 16, vbquestion: 32, vbexclamation: 48, vbinformation: 64,
  vbok: 1, vbcancel: 2, vbabort: 3, vbretry: 4, vbignore: 5, vbyes: 6, vbno: 7,
  vbcrlf: '\r\n', vbnewline: '\n', vbtab: '\t', true: true, false: false,
  vbleftbutton: 1, vbrightbutton: 2, vbmiddlebutton: 4, vbkeyreturn: 13, vbkeyescape: 27, vbkeyspace: 32
});
const TYPES = { integer: 'integer', long: 'long', single: 'single', double: 'double', currency: 'currency', string: 'string', boolean: 'boolean', date: 'date', variant: 'variant', byte: 'byte', object: 'variant', control: 'variant' };
const BOOLPROPS = { visible: 1, enabled: 1, locked: 1, multiline: 1, fontbold: 1, default: 1, cancel: 1 };
const STRPROPS = { text: 1, caption: 1, tag: 1 };
const NUMPROPS = { left: 1, top: 1, width: 1, height: 1, fontsize: 1, maxlength: 1, alignment: 1, borderstyle: 1, dragmode: 1, backcolor: 1, forecolor: 1, style: 1 };

/* ---------- value helpers ---------- */
const NUMRE = /^\s*[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?\s*$/;
function toNum(v) {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? -1 : 0;
  if (typeof v === 'string' && NUMRE.test(v)) return parseFloat(v);
  throw new VBError(13, 'Type mismatch');
}
function fmtNum(n) {
  if (Number.isInteger(n)) return String(n);
  let s = String(Number(n.toPrecision(15)));
  return s;
}
function toStr(v) {
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean') return v ? 'True' : 'False';
  if (typeof v === 'number') return fmtNum(v);
  return '';
}
function bankers(n) {
  const f = Math.floor(n), d = n - f;
  if (d < 0.5) return f; if (d > 0.5) return f + 1;
  return f % 2 === 0 ? f : f + 1;
}
function defaultOf(t) { return t === 'string' || t === 'date' ? '' : t === 'boolean' ? false : t === 'variant' ? 0 : 0; }
function coerce(t, v) {
  switch (t) {
    case 'integer': case 'long': case 'byte': {
      const r = bankers(toNum(v));
      const lim = t === 'integer' ? 32767 : t === 'byte' ? 255 : 2147483647;
      const lo = t === 'integer' ? -32768 : t === 'byte' ? 0 : -2147483648;
      if (r > lim || r < lo) throw new VBError(6, 'Overflow');
      return r;
    }
    case 'single': return Number(Math.fround(toNum(v)).toPrecision(7));
    case 'double': case 'currency': return toNum(v);
    case 'string': case 'date': return toStr(v);
    case 'boolean':
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string' && /^true$/i.test(v)) return true;
      if (typeof v === 'string' && /^false$/i.test(v)) return false;
      return toNum(v) !== 0;
    default: return v;
  }
}
function valFn(s) {
  s = toStr(s).replace(/\s+/g, '');
  const m = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?/.exec(s);
  return m ? parseFloat(m[0]) : 0;
}

/* ---------- lexer ---------- */
function tokenize(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t' || c === '\r') { i++; continue; }
    if (c === "'") break;
    if (c === '"') {
      let j = i + 1, str = '';
      for (; ;) {
        if (j >= s.length) throw new VBError(0, 'Compile error: Expected: end of string', 'compile');
        if (s[j] === '"') { if (s[j + 1] === '"') { str += '"'; j += 2; continue; } break; }
        str += s[j++];
      }
      t.push({ k: 'str', v: str }); i = j + 1; continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
      const m = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/.exec(s.slice(i));
      t.push({ k: 'num', v: parseFloat(m[0]) }); i += m[0].length; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));
      t.push({ k: 'id', v: m[0] }); i += m[0].length; continue;
    }
    const two = s.substr(i, 2);
    if (two === '<>' || two === '<=' || two === '>=') { t.push({ k: 'op', v: two }); i += 2; continue; }
    if ('+-*/\\^&=<>(),;:.'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
    throw new VBError(0, 'Compile error: Invalid character "' + c + '"', 'compile');
  }
  return t;
}

/* ---------- token stream ---------- */
class TS {
  constructor(t, line) { this.t = t; this.p = 0; this.line = line; }
  peek(o = 0) { return this.t[this.p + o]; }
  next() { return this.t[this.p++]; }
  eof() { return this.p >= this.t.length; }
  isKw(w, o = 0) { const x = this.t[this.p + o]; return !!x && x.k === 'id' && x.v.toLowerCase() === w; }
  isOp(v, o = 0) { const x = this.t[this.p + o]; return !!x && x.k === 'op' && x.v === v; }
  err(m) { return new VBError(0, 'Compile error: ' + m, 'compile', this.line); }
  expectKw(w) { if (!this.isKw(w)) throw this.err('Expected: ' + w); this.p++; }
  expectOp(v) { if (!this.isOp(v)) throw this.err('Expected: ' + v); this.p++; }
  id() { const x = this.next(); if (!x || x.k !== 'id') throw this.err('Expected: identifier'); return x.v; }
}

/* ---------- expression parser ---------- */
function parseExpr(ts) { return pOr(ts); }
function binLevel(ts, next, ops) {
  let a = next(ts);
  for (; ;) {
    const x = ts.peek(); if (!x) break;
    let op = null;
    if (x.k === 'op' && ops.includes(x.v)) op = x.v;
    else if (x.k === 'id' && ops.includes(x.v.toLowerCase())) op = x.v.toLowerCase();
    if (!op) break;
    ts.p++; const b = next(ts); a = { t: 'bin', op, a, b, line: ts.line };
  }
  return a;
}
const pOr = ts => binLevel(ts, pAnd, ['or', 'xor']);
const pAnd = ts => binLevel(ts, pNot, ['and']);
function pNot(ts) { if (ts.isKw('not')) { ts.p++; return { t: 'un', op: 'not', a: pNot(ts) }; } return pCmp(ts); }
const pCmp = ts => binLevel(ts, pCat, ['=', '<>', '<', '>', '<=', '>=']);
const pCat = ts => binLevel(ts, pAdd, ['&']);
const pAdd = ts => binLevel(ts, pMod, ['+', '-']);
const pMod = ts => binLevel(ts, pIdiv, ['mod']);
const pIdiv = ts => binLevel(ts, pMul, ['\\']);
const pMul = ts => binLevel(ts, pUn, ['*', '/']);
function pUn(ts) {
  if (ts.isOp('-')) { ts.p++; return { t: 'un', op: 'neg', a: pUn(ts) }; }
  if (ts.isOp('+')) { ts.p++; return pUn(ts); }
  return pPow(ts);
}
function pPow(ts) {
  let a = pPrim(ts);
  while (ts.isOp('^')) {
    ts.p++;
    let b;
    if (ts.isOp('-')) { ts.p++; b = { t: 'un', op: 'neg', a: pPrim(ts) }; } else b = pPrim(ts);
    a = { t: 'bin', op: '^', a, b };
  }
  return a;
}
function pArgs(ts) {
  const args = [];
  ts.expectOp('(');
  if (ts.isOp(')')) { ts.p++; return args; }
  for (; ;) { args.push(parseExpr(ts)); if (ts.isOp(',')) { ts.p++; continue; } break; }
  ts.expectOp(')');
  return args;
}
function pPrim(ts) {
  const x = ts.next();
  if (!x) throw ts.err('Expected: expression');
  if (x.k === 'num') return { t: 'num', v: x.v };
  if (x.k === 'str') return { t: 'str', v: x.v };
  if (x.k === 'op' && x.v === '(') { const e = parseExpr(ts); ts.expectOp(')'); return e; }
  if (x.k === 'id') {
    if (ts.isOp('.') && ts.peek(1) && ts.peek(1).k === 'id') {
      ts.p++; const prop = ts.next().v;
      return { t: 'member', obj: x.v, prop, line: ts.line };
    }
    if (ts.isOp('(')) return { t: 'call', name: x.v, args: pArgs(ts), line: ts.line };
    return { t: 'id', name: x.v, line: ts.line };
  }
  throw ts.err('Syntax error');
}

/* ---------- program parser ---------- */
const lc = s => s.toLowerCase();
class Parser {
  constructor(code) {
    this.lines = [];
    const raw = code.replace(/\r/g, '').split('\n');
    for (let n = 0; n < raw.length; n++) {
      let l = raw[n];
      while (/\s_\s*$/.test(l) && n + 1 < raw.length) { l = l.replace(/\s_\s*$/, ' ') + raw[++n]; }
      let toks;
      try { toks = tokenize(l); } catch (e) { e.line = n + 1; throw e; }
      if (!toks.length) continue;
      if (toks[0].k === 'id' && lc(toks[0].v) === 'rem') continue;
      // split on ':' except label lines
      if (toks.length === 2 && toks[0].k === 'id' && toks[1].k === 'op' && toks[1].v === ':') { this.lines.push({ t: toks, n: n + 1 }); continue; }
      let cur = [];
      for (const tk of toks) {
        if (tk.k === 'op' && tk.v === ':') { this.pushLine(cur, n + 1); cur = []; } else cur.push(tk);
      }
      this.pushLine(cur, n + 1);
    }
    this.i = 0;
  }
  pushLine(t, n) {
    if (!t.length) return;
    if (t[0].k === 'num') { this.lines.push({ t: [t[0]], n }); t = t.slice(1); if (!t.length) return; }
    this.lines.push({ t, n });
  }
  startsWith(line, ...ws) {
    const t = line.t;
    for (let k = 0; k < ws.length; k++) { const x = t[k]; if (!x || x.k !== 'id' || lc(x.v) !== ws[k]) return false; }
    return true;
  }
  parseModule() {
    const mod = { decls: [], procs: new Map(), optionExplicit: false };
    while (this.i < this.lines.length) {
      const ln = this.lines[this.i];
      const ts = new TS(ln.t, ln.n);
      if (this.startsWith(ln, 'option')) { if (ts.isKw('explicit', 1)) mod.optionExplicit = true; this.i++; continue; }
      let k = 0; const f = lc(ln.t[0].v || '');
      if (ln.t[0].k === 'id' && (f === 'private' || f === 'public' || f === 'friend' || f === 'static')) k = 1;
      const kw = ln.t[k] && ln.t[k].k === 'id' ? lc(ln.t[k].v) : '';
      if (kw === 'sub' || kw === 'function') { this.parseProc(mod, kw, k); continue; }
      if (ln.t[0].k === 'id' && (f === 'dim' || f === 'public' || f === 'private' || f === 'const')) {
        const st = this.parseStatement(ts, true); mod.decls.push(st); this.i++; continue;
      }
      throw new VBError(0, 'Compile error: Statement invalid outside Sub or Function', 'compile', ln.n);
    }
    return mod;
  }
  parseProc(mod, kind, k) {
    const ln = this.lines[this.i]; const ts = new TS(ln.t, ln.n); ts.p = k + 1;
    const name = ts.id(); const params = [];
    if (ts.isOp('(')) {
      ts.p++;
      while (!ts.isOp(')')) {
        if (ts.isKw('byval') || ts.isKw('byref') || ts.isKw('optional')) ts.p++;
        const pn = ts.id(); let type = 'variant';
        if (ts.isOp('(')) { ts.p++; ts.expectOp(')'); }
        if (ts.isKw('as')) { ts.p++; const tn = lc(ts.id()); type = TYPES[tn] || 'variant'; }
        params.push({ name: pn, type });
        if (ts.isOp(',')) ts.p++;
        if (ts.eof()) throw ts.err('Expected: )');
      }
      ts.p++;
    }
    let rtype = 'variant';
    if (ts.isKw('as')) { ts.p++; rtype = TYPES[lc(ts.id())] || 'variant'; }
    if (!ts.eof()) throw ts.err('Expected: end of statement');
    this.i++;
    const body = this.parseBlock(l => this.startsWith(l, 'end', kind));
    if (this.i >= this.lines.length) throw new VBError(0, 'Compile error: Expected: End ' + (kind === 'sub' ? 'Sub' : 'Function'), 'compile', ln.n);
    this.i++;
    mod.procs.set(lc(name), { name, kind, params, rtype, body, line: ln.n });
  }
  parseBlock(isEnd) {
    const out = [];
    while (this.i < this.lines.length) {
      const ln = this.lines[this.i];
      if (isEnd(ln)) break;
      const ts = new TS(ln.t, ln.n);
      // labels
      if ((ts.peek().k === 'num' && ts.t.length === 1) || (ts.peek().k === 'id' && ts.isOp(':', 1) && ts.t.length === 2)) {
        const lab = ts.peek().k === 'num' ? String(ts.peek().v) : lc(ts.peek().v);
        out.push({ t: 'label', name: lab, line: ln.n });
        this.i++; continue;
      }
      this.i++;
      const st = this.parseStatement(ts, false);
      if (st) out.push(st);
    }
    return out;
  }
  parseStatement(ts, modLevel, noAdvance) {
    // NOTE: this.i already points to the NEXT line when called from parseBlock
    const t = ts.peek(); const line = ts.line;
    if (t.k !== 'id') throw ts.err('Syntax error');
    const w = lc(t.v);
    switch (w) {
      case 'dim': case 'static': case 'private': case 'public': {
        ts.p++;
        const items = [];
        for (; ;) {
          const name = ts.id(); let type = 'variant';
          if (ts.isOp('(')) { ts.p++; while (!ts.isOp(')')) { if (ts.eof()) throw ts.err('Expected: )'); ts.p++; } ts.p++; }
          if (ts.isKw('as')) { ts.p++; const tn = lc(ts.id()); if (!(tn in TYPES)) throw ts.err('User-defined type not defined'); type = TYPES[tn]; }
          items.push({ name, type });
          if (ts.isOp(',')) { ts.p++; continue; }
          break;
        }
        if (!ts.eof()) throw ts.err('Expected: end of statement');
        return { t: 'dim', items, line };
      }
      case 'const': {
        ts.p++; const items = [];
        for (; ;) {
          const name = ts.id(); let type = 'variant';
          if (ts.isKw('as')) { ts.p++; type = TYPES[lc(ts.id())] || 'variant'; }
          ts.expectOp('='); const e = parseExpr(ts);
          items.push({ name, type, e });
          if (ts.isOp(',')) { ts.p++; continue; }
          break;
        }
        return { t: 'const', items, line };
      }
      case 'if': return this.parseIf(ts);
      case 'select': {
        ts.p++; ts.expectKw('case'); const e = parseExpr(ts);
        const cases = []; let els = null;
        while (this.i < this.lines.length) {
          const ln = this.lines[this.i];
          if (this.startsWith(ln, 'end', 'select')) break;
          if (!this.startsWith(ln, 'case')) throw new VBError(0, 'Compile error: Expected: Case', 'compile', ln.n);
          const cts = new TS(ln.t, ln.n); cts.p = 1; this.i++;
          if (cts.isKw('else')) { els = this.parseBlock(l => this.startsWith(l, 'case') || this.startsWith(l, 'end', 'select')); continue; }
          const tests = [];
          for (; ;) {
            if (cts.isKw('is')) { cts.p++; const op = cts.next().v; tests.push({ k: 'is', op, e: parseExpr(cts) }); } else {
              const a = parseExpr(cts);
              if (cts.isKw('to')) { cts.p++; tests.push({ k: 'range', a, b: parseExpr(cts) }); } else tests.push({ k: 'eq', e: a });
            }
            if (cts.isOp(',')) { cts.p++; continue; } break;
          }
          const body = this.parseBlock(l => this.startsWith(l, 'case') || this.startsWith(l, 'end', 'select'));
          cases.push({ tests, body });
        }
        if (this.i >= this.lines.length) throw new VBError(0, 'Compile error: Expected: End Select', 'compile', line);
        this.i++;
        return { t: 'select', e, cases, els, line };
      }
      case 'for': {
        ts.p++; const v = ts.id(); ts.expectOp('='); const from = parseExpr(ts); ts.expectKw('to'); const to = parseExpr(ts);
        let step = null; if (ts.isKw('step')) { ts.p++; step = parseExpr(ts); }
        const body = this.parseBlock(l => this.startsWith(l, 'next'));
        if (this.i >= this.lines.length) throw new VBError(0, 'Compile error: For without Next', 'compile', line);
        this.i++;
        return { t: 'for', v, from, to, step, body, line };
      }
      case 'do': case 'while': {
        ts.p++; let pre = null, preUntil = false;
        if (w === 'do' && (ts.isKw('while') || ts.isKw('until'))) { preUntil = ts.isKw('until'); ts.p++; pre = parseExpr(ts); }
        if (w === 'while') pre = parseExpr(ts);
        const endp = l => (w === 'while' ? this.startsWith(l, 'wend') : this.startsWith(l, 'loop'));
        const body = this.parseBlock(endp);
        if (this.i >= this.lines.length) throw new VBError(0, 'Compile error: Do without Loop', 'compile', line);
        const lts = new TS(this.lines[this.i].t, this.lines[this.i].n); lts.p = 1; this.i++;
        let post = null, postUntil = false;
        if (w === 'do' && (lts.isKw('while') || lts.isKw('until'))) { postUntil = lts.isKw('until'); lts.p++; post = parseExpr(lts); }
        return { t: 'do', pre, preUntil, post, postUntil, body, line };
      }
      case 'goto': { ts.p++; const x = ts.next(); return { t: 'goto', name: x.k === 'num' ? String(x.v) : lc(x.v), line }; }
      case 'print': { ts.p++; return this.parsePrint(ts, line); }
      case 'msgbox': { ts.p++; return { t: 'msgbox', args: this.parseArgList(ts), line }; }
      case 'exit': { ts.p++; return { t: 'exit', kind: lc(ts.id()), line }; }
      case 'end': { ts.p++; if (!ts.eof()) throw ts.err('Syntax error'); return { t: 'end', line }; }
      case 'unload': return { t: 'end', line };
      case 'randomize': return { t: 'nop', line };
      case 'cls': return { t: 'method', obj: null, name: 'cls', args: [], line };
      case 'call': { ts.p++; const nm = ts.id(); const args = ts.isOp('(') ? pArgs(ts) : []; return { t: 'callsub', name: nm, args, line }; }
    }
    // assignment / call
    if (ts.isOp('=', 1)) { ts.p += 2; return { t: 'assign', name: t.v, prop: null, e: parseExpr(ts), line }; }
    if (ts.isOp('.', 1) && ts.peek(2) && ts.peek(2).k === 'id') {
      const obj = t.v, prop = ts.peek(2).v; ts.p += 3;
      if (ts.isOp('=')) { ts.p++; return { t: 'assign', name: obj, prop, e: parseExpr(ts), line }; }
      if (lc(prop) === 'print') return this.parsePrint(ts, line);
      return { t: 'method', obj, name: lc(prop), args: this.parseArgList(ts), line };
    }
    ts.p++;
    return { t: 'callsub', name: t.v, args: this.parseArgList(ts), line };
  }
  parseArgList(ts) {
    const args = [];
    if (ts.eof()) return args;
    if (ts.isOp('(') && ts.t[ts.t.length - 1].k === 'op' && ts.t[ts.t.length - 1].v === ')') {
      // whole-list parens? check matching of first '('
      let d = 0, ok = true;
      for (let k = ts.p; k < ts.t.length; k++) { const x = ts.t[k]; if (x.k === 'op' && x.v === '(') d++; if (x.k === 'op' && x.v === ')') { d--; if (d === 0 && k < ts.t.length - 1) { ok = false; break; } } }
      if (ok) { return pArgs(ts); }
    }
    for (; ;) { args.push(parseExpr(ts)); if (ts.isOp(',')) { ts.p++; continue; } break; }
    if (!ts.eof()) throw ts.err('Expected: end of statement');
    return args;
  }
  parsePrint(ts, line) {
    const items = [];
    while (!ts.eof()) {
      const e = parseExpr(ts); let sep = null;
      if (ts.isOp(';')) { sep = ';'; ts.p++; } else if (ts.isOp(',')) { sep = ','; ts.p++; }
      items.push({ e, sep });
      if (!sep && !ts.eof()) throw ts.err('Expected: end of statement');
    }
    return { t: 'print', items, line };
  }
  parseIf(ts) {
    const line = ts.line; ts.p++;
    const cond = parseExpr(ts); ts.expectKw('then');
    if (!ts.eof()) { // single line
      const rest = ts.t.slice(ts.p); let depth = 0, ei = -1;
      for (let k = 0; k < rest.length; k++) { const x = rest[k]; if (x.k === 'op' && x.v === '(') depth++; else if (x.k === 'op' && x.v === ')') depth--; else if (depth === 0 && x.k === 'id' && lc(x.v) === 'else') { ei = k; break; } }
      const thenT = ei < 0 ? rest : rest.slice(0, ei), elseT = ei < 0 ? null : rest.slice(ei + 1);
      const body = [this.parseStatement(new TS(thenT, line))];
      return { t: 'if', branches: [{ cond, body }], els: elseT && elseT.length ? [this.parseStatement(new TS(elseT, line))] : null, line };
    }
    const branches = []; let els = null;
    let body = this.parseBlock(l => this.startsWith(l, 'elseif') || this.startsWith(l, 'else') || this.startsWith(l, 'end', 'if'));
    branches.push({ cond, body });
    for (; ;) {
      if (this.i >= this.lines.length) throw new VBError(0, 'Compile error: Block If without End If', 'compile', line);
      const ln = this.lines[this.i]; const lts = new TS(ln.t, ln.n);
      if (this.startsWith(ln, 'end', 'if')) { this.i++; break; }
      const isElseIf = this.startsWith(ln, 'elseif') || (this.startsWith(ln, 'else', 'if'));
      if (isElseIf) {
        lts.p = this.startsWith(ln, 'elseif') ? 1 : 2; const c = parseExpr(lts); lts.expectKw('then'); this.i++;
        const b = this.parseBlock(l => this.startsWith(l, 'elseif') || this.startsWith(l, 'else') || this.startsWith(l, 'end', 'if'));
        branches.push({ cond: c, body: b }); continue;
      }
      if (this.startsWith(ln, 'else')) {
        this.i++; els = this.parseBlock(l => this.startsWith(l, 'end', 'if')); continue;
      }
    }
    return { t: 'if', branches, els, line };
  }
}

/* ---------- builtins ---------- */
const rnd = () => Math.random();
const B = {
  val: a => valFn(a[0]),
  int: a => Math.floor(toNum(a[0])),
  fix: a => Math.trunc(toNum(a[0])),
  abs: a => Math.abs(toNum(a[0])),
  sgn: a => Math.sign(toNum(a[0])),
  sqr: a => { const n = toNum(a[0]); if (n < 0) throw new VBError(5, 'Invalid procedure call or argument'); return Math.sqrt(n); },
  sin: a => Math.sin(toNum(a[0])), cos: a => Math.cos(toNum(a[0])), tan: a => Math.tan(toNum(a[0])), atn: a => Math.atan(toNum(a[0])),
  log: a => { const n = toNum(a[0]); if (n <= 0) throw new VBError(5, 'Invalid procedure call or argument'); return Math.log(n); },
  exp: a => Math.exp(toNum(a[0])),
  rnd: () => rnd(),
  round: a => { const d = a[1] === undefined ? 0 : toNum(a[1]); const f = Math.pow(10, d); return bankers(toNum(a[0]) * f) / f; },
  len: a => toStr(a[0]).length,
  ucase: a => toStr(a[0]).toUpperCase(), lcase: a => toStr(a[0]).toLowerCase(),
  left: a => toStr(a[0]).slice(0, toNum(a[1])), right: a => { const s = toStr(a[0]), n = toNum(a[1]); return n <= 0 ? '' : s.slice(-n); },
  mid: a => { const s = toStr(a[0]), st = toNum(a[1]) - 1; return a[2] === undefined ? s.slice(st) : s.substr(st, toNum(a[2])); },
  trim: a => toStr(a[0]).trim(),
  instr: a => toStr(a[0]).indexOf(toStr(a[1])) + 1,
  str: a => { const n = toNum(a[0]); return (n >= 0 ? ' ' : '') + fmtNum(n); },
  cstr: a => toStr(a[0]),
  cint: a => coerce('integer', a[0]), clng: a => coerce('long', a[0]), cdbl: a => toNum(a[0]), csng: a => coerce('single', a[0]),
  chr: a => String.fromCharCode(toNum(a[0])), asc: a => toStr(a[0]).charCodeAt(0) || 0,
  space: a => ' '.repeat(Math.max(0, toNum(a[0]))),
  isnumeric: a => typeof a[0] === 'number' || (typeof a[0] === 'string' && NUMRE.test(a[0])),
  rgb: a => toNum(a[0]) + toNum(a[1]) * 256 + toNum(a[2]) * 65536,
  loadpicture: a => { const k = toStr(a[0]).toLowerCase(); const m = { dog: '🐶', cat: '🐱', happy: '😀', sad: '😢', card: '🎓', star: '⭐', heart: '❤️', cold: '🥶', warm: '😊', hot: '🥵', think: '🤔', rock: '✊', paper: '✋', scissors: '✌️' }; return m[k] || toStr(a[0]); },
  format: a => { const n = toNum(a[0]); const f = toStr(a[1] || ''); const m = /\.(0+)/.exec(f); const d = m ? m[1].length : 0; let s = n.toFixed(d); if (f.includes(',')) { const p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = p.join('.'); } return s; },
  now: () => new Date().toLocaleString('en-GB'), date: () => new Date().toLocaleDateString('en-GB'), time: () => new Date().toLocaleTimeString('en-GB'),
  timer: () => (Date.now() % 86400000) / 1000
};
const ZERO = { rnd: 1, now: 1, date: 1, time: 1, timer: 1 };

/* ---------- interpreter ---------- */
class Interp {
  constructor(opts) {
    this.code = opts.code; this.spec = opts.form; this.host = opts.host;
    this.ctrls = new Map(); this.mod = new Map(); this.consts = new Set(); this.steps = 0; this.depth = 0;
    this.ended = false; this.printCol = 0; this.queue = Promise.resolve();
    const f = this.spec;
    this.form = { name: f.name || 'Form1', type: 'Form', props: { caption: f.caption || 'Form1', backcolor: f.backColor !== undefined ? f.backColor : 13160660 } };
    this.ctrls.set('me', this.form); this.ctrls.set(lc(this.form.name), this.form); this.ctrls.set('form', this.form);
    for (const c of (f.controls || [])) {
      const props = {};
      for (const k in c) if (k !== 'name' && k !== 'type') props[lc(k)] = c[k];
      const o = { name: c.name, type: c.type, props };
      const t = c.type;
      const d = { visible: true, enabled: true, locked: false, multiline: false, fontbold: false, fontsize: 8, forecolor: 0, backcolor: t === 'TextBox' ? 16777215 : 13160660, alignment: 0, dragmode: 0, borderstyle: 0, maxlength: 0, default: false, cancel: false, width: 100, height: 25, left: 0, top: 0 };
      for (const k in d) if (!(k in o.props)) o.props[k] = d[k];
      for (const k of ['left', 'top', 'width', 'height']) o.props[k] = Number(o.props[k]) * 15; // px -> twips
      if (t === 'TextBox') o.props.text = toStr(o.props.text === undefined ? '' : o.props.text);
      if (t === 'Label' || t === 'CommandButton') o.props.caption = toStr(o.props.caption === undefined ? '' : o.props.caption);
      this.ctrls.set(lc(c.name), o);
    }
  }
  compile() {
    const p = new Parser(this.code);
    this.prog = p.parseModule();
    this.explicit = this.prog.optionExplicit;
    this.procs = this.prog.procs;
    // module-level decls
    for (const d of this.prog.decls) {
      if (d.t === 'dim') for (const it of d.items) this.mod.set(lc(it.name), { type: it.type, val: defaultOf(it.type) });
    }
    this.modConstsPending = this.prog.decls.filter(d => d.t === 'const');
    return this;
  }
  async init() {
    const fr = { vars: new Map(), proc: null };
    for (const d of this.modConstsPending) await this.exec(d, fr);
  }
  async start() { await this.init(); await this.runEvent('form', 'Load', []); }
  fire(ctrl, evt, args) {
    // queued user-originated event
    this.queue = this.queue.then(() => this.runEvent(lc(ctrl), evt, args || [])).catch(() => { });
    return this.queue;
  }
  async runEvent(ctrlKey, evt, args) {
    if (this.ended) return;
    let nm = ctrlKey === 'form' ? 'form_' + lc(evt) : ctrlKey + '_' + lc(evt);
    let proc = this.procs.get(nm);
    if (!proc && ctrlKey === lc(this.form.name)) proc = this.procs.get('form_' + lc(evt));
    if (!proc) return;
    if (this.depth > 25) return;
    this.depth++;
    try { await this.callProc(proc, args); } catch (e) {
      if (e instanceof EndSignal) { this.ended = true; this.host.ended && this.host.ended(); } else if (e instanceof VBError) { this.host.error && this.host.error(e); } else if (e instanceof ExitSignal || e instanceof GotoSignal) { /* ignore */ } else throw e;
    } finally { this.depth--; }
  }
  async callProc(proc, args) {
    const fr = { vars: new Map(), proc };
    proc.params.forEach((p, i) => {
      const v = args[i];
      fr.vars.set(lc(p.name), { type: p.type, val: v === undefined ? defaultOf(p.type) : (p.type === 'variant' ? v : (typeof v === 'object' ? v : coerce(p.type, v))) });
    });
    if (proc.kind === 'function') fr.vars.set(lc(proc.name), { type: proc.rtype, val: defaultOf(proc.rtype), ret: true });
    this.hoist(proc.body, fr);
    const labels = new Map(); proc.body.forEach((s, i) => { if (s.t === 'label') labels.set(s.name, i); });
    let i = 0;
    while (i < proc.body.length) {
      try { await this.exec(proc.body[i], fr); i++; } catch (e) {
        if (e instanceof GotoSignal) { if (labels.has(e.l)) { i = labels.get(e.l); continue; } throw new VBError(0, 'Label not defined: ' + e.l, 'compile'); }
        if (e instanceof ExitSignal && (e.k === 'sub' || e.k === 'function')) break;
        throw e;
      }
    }
    return proc.kind === 'function' ? fr.vars.get(lc(proc.name)).val : undefined;
  }
  hoist(stmts, fr) {
    for (const s of stmts) {
      if (s.t === 'dim') for (const it of s.items) fr.vars.set(lc(it.name), { type: it.type, val: defaultOf(it.type) });
      else if (s.t === 'if') { s.branches.forEach(b => this.hoist(b.body, fr)); if (s.els) this.hoist(s.els, fr); } else if (s.t === 'select') { s.cases.forEach(c => this.hoist(c.body, fr)); if (s.els) this.hoist(s.els, fr); } else if (s.body) this.hoist(s.body, fr);
    }
  }
  findVar(name, fr) { const k = lc(name); return fr.vars.get(k) || this.mod.get(k); }
  resolveObj(name, fr) {
    const v = this.findVar(name, fr);
    if (v && v.val && typeof v.val === 'object') return v.val;
    return this.ctrls.get(lc(name));
  }
  tick() { if (++this.steps > 300000) { this.steps = 0; throw new VBError(28, 'Out of stack space / program seems stuck in an endless loop'); } }

  async execBlock(b, fr) { for (const s of b) await this.exec(s, fr); }
  async exec(s, fr) {
    this.tick();
    try { return await this.exec2(s, fr); } catch (e) { if (e instanceof VBError && e.line === undefined) e.line = s.line; throw e; }
  }
  async exec2(s, fr) {
    switch (s.t) {
      case 'nop': case 'label': case 'dim': return;
      case 'const':
        for (const it of s.items) { const v = coerce(it.type, await this.ev(it.e, fr)); const rec = { type: it.type, val: v, isConst: true }; (fr.proc ? fr.vars : this.mod).set(lc(it.name), rec); }
        return;
      case 'assign': {
        const val = await this.ev(s.e, fr);
        if (s.prop) { const o = this.resolveObj(s.name, fr); if (!o) throw new VBError(424, 'Object required'); await this.setProp(o, s.prop, val); return; }
        const v = this.findVar(s.name, fr);
        if (v) { if (v.isConst) throw new VBError(0, 'Compile error: Assignment to constant not permitted', 'compile'); v.val = (v.type === 'variant') ? val : coerce(v.type, val); return; }
        const c = this.ctrls.get(lc(s.name));
        if (c) { await this.setProp(c, c.type === 'TextBox' ? 'text' : 'caption', val); return; }
        if (this.explicit) throw new VBError(0, 'Compile error: Variable not defined: ' + s.name, 'compile');
        (fr.proc ? fr.vars : this.mod).set(lc(s.name), { type: 'variant', val }); return;
      }
      case 'if':
        for (const b of s.branches) { if (this.truthy(await this.ev(b.cond, fr))) { await this.execBlock(b.body, fr); return; } }
        if (s.els) await this.execBlock(s.els, fr);
        return;
      case 'select': {
        const x = await this.ev(s.e, fr);
        for (const c of s.cases) {
          for (const t of c.tests) {
            let ok = false;
            if (t.k === 'eq') ok = this.cmp('=', x, await this.ev(t.e, fr));
            else if (t.k === 'is') ok = this.cmp(t.op, x, await this.ev(t.e, fr));
            else ok = this.cmp('>=', x, await this.ev(t.a, fr)) && this.cmp('<=', x, await this.ev(t.b, fr));
            if (ok) { await this.execBlock(c.body, fr); return; }
          }
        }
        if (s.els) await this.execBlock(s.els, fr);
        return;
      }
      case 'for': {
        const from = toNum(await this.ev(s.from, fr)), to = toNum(await this.ev(s.to, fr)), step = s.step ? toNum(await this.ev(s.step, fr)) : 1;
        if (step === 0) throw new VBError(5, 'Invalid procedure call or argument');
        const setv = v => { const r = this.findVar(s.v, fr); if (r) r.val = r.type === 'variant' ? v : coerce(r.type, v); else if (this.explicit) throw new VBError(0, 'Compile error: Variable not defined: ' + s.v, 'compile'); else (fr.proc ? fr.vars : this.mod).set(lc(s.v), { type: 'variant', val: v }); };
        try {
          for (let i = from; step > 0 ? i <= to : i >= to; i += step) { setv(i); this.tick(); try { await this.execBlock(s.body, fr); } catch (e) { if (e instanceof ExitSignal && e.k === 'for') break; throw e; } }
        } finally { }
        return;
      }
      case 'do': {
        for (; ;) {
          this.tick();
          if (s.pre) { const c = this.truthy(await this.ev(s.pre, fr)); if (s.preUntil ? c : !c) break; }
          try { await this.execBlock(s.body, fr); } catch (e) { if (e instanceof ExitSignal && e.k === 'do') break; throw e; }
          if (s.post) { const c = this.truthy(await this.ev(s.post, fr)); if (s.postUntil ? c : !c) break; }
          if (!s.pre && !s.post) { /* infinite Do..Loop, relies on Exit Do */ }
        }
        return;
      }
      case 'goto': throw new GotoSignal(s.name);
      case 'exit': throw new ExitSignal(s.kind);
      case 'end': throw new EndSignal();
      case 'print': {
        let out = ''; let nl = true;
        for (const it of s.items) {
          const v = await this.ev(it.e, fr);
          let str = typeof v === 'number' ? (v >= 0 ? ' ' : '-') + fmtNum(Math.abs(v)) + ' ' : toStr(v);
          if (typeof v === 'boolean') str = toStr(v);
          out += str; this.printCol += str.length;
          if (it.sep === ',') { const pad = 14 - (this.printCol % 14); out += ' '.repeat(pad); this.printCol += pad; }
          nl = !it.sep;
        }
        if (nl) { this.printCol = 0; }
        this.host.print(out, nl);
        return;
      }
      case 'msgbox': {
        const a = []; for (const e of s.args) a.push(await this.ev(e, fr));
        await this.msgbox(a); return;
      }
      case 'method': {
        if (s.name === 'cls') { this.printCol = 0; this.host.cls(); return; }
        const o = s.obj ? this.resolveObj(s.obj, fr) : this.form;
        if (!o) throw new VBError(424, 'Object required');
        const a = []; for (const e of s.args) a.push(await this.ev(e, fr));
        if (s.name === 'setfocus') { this.host.focus(o); return; }
        if (s.name === 'cls') { this.host.cls(); return; }
        if (s.name === 'move') { if (a[0] !== undefined) await this.setProp(o, 'left', a[0]); if (a[1] !== undefined) await this.setProp(o, 'top', a[1]); return; }
        if (s.name === 'hide' || s.name === 'show') return;
        throw new VBError(438, "Object doesn't support this property or method");
      }
      case 'callsub': {
        const p = this.procs.get(lc(s.name));
        if (p) { const a = []; for (const e of s.args) a.push(await this.ev(e, fr)); await this.callProc(p, a); return; }
        const c = this.ctrls.get(lc(s.name));
        if (c) throw new VBError(0, 'Compile error: Expected: =', 'compile');
        throw new VBError(35, 'Sub or Function not defined: ' + s.name);
      }
    }
  }
  truthy(v) { if (typeof v === 'boolean') return v; return toNum(v) !== 0; }
  async msgbox(a) {
    const prompt = toStr(a[0]); const sym = a[1] === undefined ? 0 : toNum(a[1]); const title = a[2] === undefined ? this.form.props.caption : toStr(a[2]);
    return await this.host.msgbox(prompt, sym, title);
  }
  async setProp(o, prop, val) {
    const k = lc(prop);
    if (k === 'name') throw new VBError(383, "Can't assign to read-only property");
    const known = (k in BOOLPROPS) || (k in STRPROPS) || (k in NUMPROPS) || k === 'picture' || k === 'value';
    if (!known) throw new VBError(438, "Object doesn't support this property or method");
    let v;
    if (k in BOOLPROPS) v = coerce('boolean', val); else if (k in STRPROPS) v = toStr(val); else if (k in NUMPROPS) v = toNum(val); else v = val;
    const old = o.props[k]; o.props[k] = v;
    this.host.refresh(o);
    if (k === 'text' && o.type === 'TextBox' && old !== v) await this.runEvent(lc(o.name), 'Change', []);
  }
  getProp(o, prop) {
    const k = lc(prop);
    if (k === 'name') return o.name;
    if (!(k in o.props)) {
      if ((k in BOOLPROPS) || (k in STRPROPS) || (k in NUMPROPS) || k === 'value') return (k in BOOLPROPS) ? false : (k in STRPROPS) ? '' : 0;
      throw new VBError(438, "Object doesn't support this property or method");
    }
    return o.props[k];
  }
  cmp(op, a, b) {
    let x = a, y = b;
    if (typeof a === 'string' && typeof b === 'string') { /* text compare */ } else {
      if (typeof a === 'string' && !NUMRE.test(a)) throw new VBError(13, 'Type mismatch');
      if (typeof b === 'string' && !NUMRE.test(b)) throw new VBError(13, 'Type mismatch');
      x = toNum(a); y = toNum(b);
    }
    switch (op) { case '=': return x === y; case '<>': return x !== y; case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y; }
  }
  async ev(n, fr) {
    switch (n.t) {
      case 'num': case 'str': return n.v;
      case 'id': {
        const v = this.findVar(n.name, fr); if (v) return v.val;
        const k = lc(n.name);
        if (k in CONSTS) return CONSTS[k];
        const c = this.ctrls.get(k); if (c) return c.type === 'TextBox' ? c.props.text : (c.props.caption !== undefined ? c.props.caption : '');
        if (ZERO[k]) return B[k]([]);
        const p = this.procs.get(k); if (p && p.kind === 'function') return await this.callProc(p, []);
        if (this.explicit) throw new VBError(0, 'Compile error: Variable not defined: ' + n.name, 'compile', n.line);
        const rec = { type: 'variant', val: 0 }; (fr.proc ? fr.vars : this.mod).set(k, rec); return 0;
      }
      case 'member': {
        const o = this.resolveObj(n.obj, fr); if (!o) throw new VBError(424, 'Object required');
        return this.getProp(o, n.prop);
      }
      case 'call': {
        const k = lc(n.name);
        const a = []; for (const e of n.args) a.push(await this.ev(e, fr));
        if (k === 'inputbox') return await this.host.inputbox(toStr(a[0]), a[1] === undefined ? this.form.props.caption : toStr(a[1]), a[2] === undefined ? '' : toStr(a[2]));
        if (k === 'msgbox') return await this.msgbox(a);
        const p = this.procs.get(k); if (p) return await this.callProc(p, a);
        if (B[k]) return B[k](a);
        throw new VBError(35, 'Sub or Function not defined: ' + n.name);
      }
      case 'un': { const v = await this.ev(n.a, fr); if (n.op === 'neg') return -toNum(v); return typeof v === 'boolean' ? !v : ~toNum(v); }
      case 'bin': {
        const a = await this.ev(n.a, fr), b = await this.ev(n.b, fr);
        switch (n.op) {
          case '+': if (typeof a === 'string' && typeof b === 'string') return a + b; return toNum(a) + toNum(b);
          case '-': return toNum(a) - toNum(b);
          case '*': return toNum(a) * toNum(b);
          case '/': { const d = toNum(b); if (d === 0) throw new VBError(11, 'Division by zero'); return toNum(a) / d; }
          case '\\': { const d = bankers(toNum(b)); if (d === 0) throw new VBError(11, 'Division by zero'); return Math.trunc(bankers(toNum(a)) / d); }
          case 'mod': { const d = bankers(toNum(b)); if (d === 0) throw new VBError(11, 'Division by zero'); return bankers(toNum(a)) % d; }
          case '^': { const r = Math.pow(toNum(a), toNum(b)); if (!isFinite(r)) throw new VBError(11, 'Division by zero'); return r; }
          case '&': return toStr(a) + toStr(b);
          case '=': case '<>': case '<': case '>': case '<=': case '>=': return this.cmp(n.op, a, b);
          case 'and': if (typeof a === 'boolean' && typeof b === 'boolean') return a && b; return toNum(a) & toNum(b);
          case 'or': if (typeof a === 'boolean' && typeof b === 'boolean') return a || b; return toNum(a) | toNum(b);
          case 'xor': if (typeof a === 'boolean' && typeof b === 'boolean') return a !== b; return toNum(a) ^ toNum(b);
        }
      }
    }
    throw new VBError(0, 'Internal error');
  }
}

root.VB = { Interp, VBError, toStr, toNum, fmtNum, CONSTS, coerce, valFn };
if (typeof module !== 'undefined') module.exports = root.VB;
})(typeof window !== 'undefined' ? window : globalThis);
