#!/usr/bin/env node
'use strict';

/**
 * Prepares the Next.js standalone output for Hostinger deployment.
 * Run after `npm run build`.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const standaloneDir = path.join(root, '.next', 'standalone');
const staticSrc = path.join(root, '.next', 'static');
const staticDest = path.join(standaloneDir, '.next', 'static');
const publicSrc = path.join(root, 'public');
const publicDest = path.join(standaloneDir, 'public');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Missing: ${src}`);
    process.exit(1);
  }

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (!fs.existsSync(path.join(standaloneDir, 'server.js'))) {
  console.error('Run `npm run build` first — .next/standalone/server.js not found.');
  process.exit(1);
}

console.log('Copying .next/static → .next/standalone/.next/static');
copyRecursive(staticSrc, staticDest);

console.log('Copying public → .next/standalone/public');
copyRecursive(publicSrc, publicDest);

console.log('Standalone bundle ready. Deploy the project root and run `node server.js`.');
