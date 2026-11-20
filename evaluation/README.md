# Evaluation scripts

Reproduces the technical evaluation reported in the paper
"A Browser-Based Visual Basic 6 Learning Environment for Event-Driven Programming: Design and Technical Evaluation".

| File | Method | Run |
| --- | --- | --- |
| `e2e.py` | E1 – scripted end-to-end tests of all 59 programs (Playwright + Chromium) | `python3 e2e.py` (expects the app at `file:///home/claude/app/index.html`; edit the path) |
| `conf.js` | E2 – 72-case VB6 conformance suite (Node.js) | `node conf.js` (edit the path to `src/interp.js`) |
| `timing.js` | E2 – parse and start-up timing | `node timing.js` |
| `content.js` | E5 – content inventory and rule-based Bloom coding | `node content.js` |
| `lh_*.json`, `lh2_*.json` | E3 – Lighthouse 12.8.2 reports (before / after the accessibility fixes) | open in https://googlechrome.github.io/lighthouse/viewer/ |
| `conformance.json`, `content.json` | Raw results | — |

The application source is in `../src`; `python3 build.py` produces `index.html`.
