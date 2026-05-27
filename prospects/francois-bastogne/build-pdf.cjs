/* Markdown → HTML stylisé → PDF via Chromium headless. */
const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const puppeteer = require('puppeteer-core');

const HERE = __dirname;
const MD = fs.readFileSync(path.join(HERE, 'proposition.md'), 'utf8');
const body = marked.parse(MD);

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Proposition Odoo — François</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  html, body { font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; color:#1a1a1a; line-height:1.55; font-size:11pt; }
  h1 { font-size:22pt; border-bottom:3px solid #5b3df5; padding-bottom:8px; margin-top:0; color:#1a1a1a; }
  h2 { font-size:14pt; margin-top:22px; color:#5b3df5; }
  h3 { font-size:12pt; margin-top:16px; color:#1a1a1a; }
  p, li { font-size:11pt; }
  table { border-collapse:collapse; width:100%; margin:10px 0; font-size:10pt; }
  th, td { border:1px solid #d0d0d0; padding:6px 8px; text-align:left; vertical-align:top; }
  th { background:#f4f1ff; color:#5b3df5; font-weight:700; }
  code { background:#f4f4f4; padding:1px 5px; border-radius:3px; font-size:10pt; }
  hr { border:none; border-top:1px solid #e0e0e0; margin:20px 0; }
  strong { color:#1a1a1a; }
  blockquote { border-left:3px solid #5b3df5; padding:4px 12px; background:#f8f6ff; margin:10px 0; }
</style>
</head>
<body>${body}</body>
</html>`;

const htmlPath = path.join(HERE, '.proposition.html');
fs.writeFileSync(htmlPath, html);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/root/.cache/puppeteer/chrome/linux-148.0.7778.167/chrome-linux64/chrome',
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
  const pdfPath = path.join(HERE, 'Proposition-Odoo-Francois.pdf');
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();
  fs.unlinkSync(htmlPath);
  console.log('PDF :', pdfPath, fs.statSync(pdfPath).size, 'bytes');
})().catch(e => { console.error(e); process.exit(1); });
