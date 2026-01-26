import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const backendDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(backendDir, '..');
const frontendDir = path.resolve(repoRoot, 'frontend');
const srcDist = path.resolve(frontendDir, 'dist');
const dstDist = path.resolve(backendDir, 'dist');

function run(cmd, cwd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

const hasIndexHtml = (dir) => fs.existsSync(path.join(dir, 'index.html'));

const syncDist = () => {
  if (!fs.existsSync(srcDist)) {
    console.warn(`Frontend dist not found at ${srcDist}. Skipping sync.`);
    return;
  }

  fs.rmSync(dstDist, { recursive: true, force: true });
  fs.mkdirSync(dstDist, { recursive: true });
  fs.cpSync(srcDist, dstDist, { recursive: true });

  if (!hasIndexHtml(dstDist)) {
    console.warn(`Sync completed but ${path.join(dstDist, 'index.html')} not found.`);
  } else {
    console.log('Frontend build synced to backend/dist');
  }
};

const shouldBuild =
  process.env.SKIP_FRONTEND_BUILD !== '1' && process.env.BYPASS_FRONTEND_BUILD !== '1';

if (!shouldBuild) {
  console.log('Skipping frontend build due to SKIP_FRONTEND_BUILD/BYPASS_FRONTEND_BUILD.');
  syncDist();
} else {
  try {
    if (!process.env.BYPASS_FRONTEND_INSTALL) {
      try {
        run('npm ci', frontendDir);
      } catch (err) {
        console.warn('npm ci failed, falling back to npm install.');
        run('npm install', frontendDir);
      }
    } else {
      console.log('Skipping frontend install due to BYPASS_FRONTEND_INSTALL=1');
    }

    run('npm run build', frontendDir);
    syncDist();
  } catch (err) {
    console.error(err?.message || err);
    const hasFrontendDist = hasIndexHtml(srcDist);
    const hasBackendDist = hasIndexHtml(dstDist);
    if (!hasFrontendDist && !hasBackendDist) {
      console.warn('Frontend build failed and no existing dist found. Continuing without build.');
    } else {
      console.warn('Frontend build failed. Continuing with existing dist.');
      if (hasFrontendDist && !hasBackendDist) {
        syncDist();
      }
    }
  }
}
