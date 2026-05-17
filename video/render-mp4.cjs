/* Render orion-teaser-linkedin-1x1.html → MP4 (1080x1080, 15s, with drill audio). */
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const HTML = path.join(HERE, 'orion-teaser-linkedin-1x1.html');
const AUDIO = path.join(HERE, 'assets', 'orion-teaser-drill.mp3');
const WEBM_OUT = path.join(HERE, 'orion-teaser-linkedin-1x1.webm');
const MP4_OUT = path.join(HERE, 'orion-teaser-linkedin-1x1.mp4');
const DURATION_S = 15;
const RECORD_MS = 15400;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/root/.cache/puppeteer/chrome/linux-148.0.7778.167/chrome-linux64/chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-features=IsolateOrigins,site-per-process,BackForwardCache',
      '--enable-features=NetworkService',
      '--hide-scrollbars',
      '--mute-audio',
      `--window-size=1080,1080`,
    ],
    defaultViewport: { width: 1080, height: 1080, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await page.setBypassCSP(true);

  page.on('console', msg => console.log('[page]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[pageerror]', err.message));

  console.log('Loading', HTML);
  await page.goto('file://' + HTML + '?export=1', { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await new Promise(r => setTimeout(r, 800));

  // Dismiss splash, hide control buttons, mute audio (we'll add it via ffmpeg).
  await page.evaluate(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.style.display = 'none'; }
    document.querySelectorAll('.replay,.mute').forEach(el => el.style.display = 'none');
    const t = document.getElementById('track');
    if (t) { try { t.muted = true; t.pause(); } catch(e){} }
    document.getElementById('stage').classList.add('beat-on');
  });

  // Restart the timeline from t=0 via the replay handler (it resets startT
  // and clears cues in the script's closure scope).
  await page.evaluate(() => {
    const r = document.querySelector('.replay');
    if (r) r.click();
  });
  await new Promise(r => setTimeout(r, 150));

  console.log('Starting screencast →', WEBM_OUT);
  const recorder = await page.screencast({ path: WEBM_OUT });

  await new Promise(r => setTimeout(r, RECORD_MS));

  await recorder.stop();
  console.log('Screencast stopped');
  await browser.close();

  if (!fs.existsSync(WEBM_OUT)) {
    console.error('WebM not produced');
    process.exit(1);
  }

  console.log('Muxing audio + transcoding to MP4 →', MP4_OUT);
  const ff = spawnSync('ffmpeg', [
    '-y',
    '-i', WEBM_OUT,
    '-i', AUDIO,
    '-t', String(DURATION_S),
    '-map', '0:v:0',
    '-map', '1:a:0',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'slow',
    '-r', '30',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    '-shortest',
    MP4_OUT,
  ], { stdio: 'inherit' });

  if (ff.status !== 0) {
    console.error('ffmpeg failed with status', ff.status);
    process.exit(1);
  }

  const sz = fs.statSync(MP4_OUT).size;
  console.log(`✓ MP4 ready: ${MP4_OUT} (${(sz/1024/1024).toFixed(2)} MB)`);
})().catch(e => { console.error(e); process.exit(1); });
