// Renderiza reel.html em MP4 (1080x1920, 30 fps) e nos slides do carrossel (1080x1350).
// Uso: node render.js [probe|video|carousel|all]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const dir = __dirname;
const mode = process.argv[2] || 'all';
const FPS = 30;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, 'reel.html'));
  await page.waitForFunction('window.READY === true');
  const T = await page.evaluate('window.T');
  const NS = await page.evaluate('window.NS');

  if (mode === 'probe') {
    const out = path.join(dir, 'probe'); fs.mkdirSync(out, { recursive: true });
    for (const t of (process.argv[3] || '1.8,3.6,5.8').split(',').map(Number)) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(out, `t${t}.jpg`), quality: 80 });
    }
  }
  if (mode === 'video' || mode === 'all') {
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100', '-shortest',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart', path.join(dir, 'dcl-reel-1080x1920.mp4')], { stdio: ['pipe', 'ignore', 'inherit'] });
    const n = Math.round(T * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.seek(t), i / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 300 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  if (mode === 'carousel' || mode === 'all') {
    const out = path.join(dir, 'carrossel'); fs.mkdirSync(out, { recursive: true });
    for (let i = 0; i < NS; i++) {
      await page.evaluate(i => window.still(i), i);
      await page.screenshot({ path: path.join(out, `dcl-${String(i + 1).padStart(2, '0')}.png`), clip: { x: 0, y: 285, width: 1080, height: 1350 } });
    }
  }
  await browser.close();
})();
