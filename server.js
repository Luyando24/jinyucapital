// ============================================================
// server.js – Jinyu Capital Node.js Entry Point
// Used by Hostinger Node App Hosting (PM2 / Node runner)
// ============================================================
'use strict';

const path = require('path');
const { createServer } = require('http');

// ── Environment Setup ───────────────────────────────────────
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const port = parseInt(process.env.PORT || process.env.APP_PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`\n🚀  Starting Jinyu Capital...`);
console.log(`   NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`   Hostname : ${hostname}:${port}\n`);

// ── Load the Next.js Standalone Server ──────────────────────
// After `npm run build`, Next.js emits a self-contained server
// at .next/standalone/server.js. We load it here.
const standalonePath = path.join(__dirname, '.next', 'standalone', 'server.js');

try {
  require(standalonePath);
} catch (err) {
  console.error('❌  Could not load .next/standalone/server.js');
  console.error('   Run `npm run build` first, then deploy the whole project folder.');
  console.error(err);
  process.exit(1);
}
