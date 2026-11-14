// Gera os 8 slides animados (MP4), os 8 quadros estáticos (PNG) e o vídeo completo.
// Uso: node render.mjs [stills|videos|all]
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';

const mode = process.argv[2] || 'all';
const chrome = process.env.CHROME || ['/opt/pw-browsers/chromium'].find(existsSync);
const extra = chrome ? [`--browser-executable=${chrome}`, '--chrome-mode=chrome-for-testing'] : [];
const run = (args) => execFileSync('npx', ['remotion', ...args, ...extra, '--log=error'], {stdio: 'inherit'});

for (let i = 1; i <= 8; i++) {
  const id = `PSP0${i}`;
  if (mode !== 'videos') run(['still', 'src/index.ts', id, `carrossel/psp-0${i}.png`, '--frame=204']);
  if (mode !== 'stills') run(['render', 'src/index.ts', id, `carrossel-animado/psp-0${i}.mp4`, '--crf=17']);
}
if (mode !== 'stills') run(['render', 'src/index.ts', 'PSPCompleto', 'psp-completo-1080x1350.mp4', '--crf=17']);
