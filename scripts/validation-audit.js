#!/usr/bin/env node

function isValidPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function isValidEmail(email) {
  const value = String(email || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !value.includes('..');
}

const cases = [
  ['123123', false, isValidPhone('123123')],
  ['2145550123', true, isValidPhone('2145550123')],
  ['bad-email', false, isValidEmail('bad-email')],
  ['sale@halalfoodistan.com', true, isValidEmail('sale@halalfoodistan.com')],
];

console.log('VALIDATION_AUDIT');
let failed = false;
cases.forEach(([input, expected, actual]) => {
  const ok = expected === actual;
  failed = failed || !ok;
  console.log(`${input}: ${ok ? 'ok' : `expected ${expected} got ${actual}`}`);
});

if (failed) {
  process.exit(1);
}

console.log('');
console.log('Phone and email validation checks passed.');
