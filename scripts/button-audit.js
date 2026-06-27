#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

const controls = [
  { name: 'Email Us link', ok: html.includes('href="mailto:sale@halalfoodistan.com"') },
  { name: 'Instagram link', ok: html.includes('https://www.instagram.com/halal_foodistan/') },
  { name: 'Next buttons', ok: (html.match(/class="btn btn-primary next"/g) || []).length === 3 },
  { name: 'Back buttons', ok: (html.match(/class="btn btn-secondary prev"/g) || []).length === 3 },
  { name: 'Submit button', ok: html.includes('<button type="submit" class="btn btn-primary">Submit</button>') },
  { name: 'Next handler', ok: js.includes("document.querySelectorAll('.next')") },
  { name: 'Prev handler', ok: js.includes("document.querySelectorAll('.prev')") },
  { name: 'Submit handler', ok: js.includes("form.addEventListener('submit'") },
  { name: 'Resume draft action', ok: js.includes('resumeBtn') },
];

console.log('BUTTON_AUDIT');
controls.forEach((control) => {
  console.log(`${control.name}: ${control.ok ? 'ok' : 'missing'}`);
});

const failed = controls.filter((control) => !control.ok);
if (failed.length) {
  console.error('');
  console.error('Missing controls: ' + failed.map((control) => control.name).join(', '));
  process.exit(1);
}

console.log('');
console.log('All audited buttons and handlers passed.');
