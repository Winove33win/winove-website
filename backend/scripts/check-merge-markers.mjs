import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const ignoredEntries = new Set([
  '.git',
  'node_modules',
  'dist',
  'dist-for-deploy.zip',
  'tmp',
  'httpdocs',
  '.next',
]);

const conflictPatterns = [
  /^<{7}/, // git conflict start
  /^>{7}/, // git conflict end
  /^={7}$/,
  /^<<<\s/, // custom markers explicitly starting a line
  /^>>>\s/,
];

async function walk(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    if (ignoredEntries.has(dirent.name)) continue;
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (dirent.isFile()) {
      await checkFile(fullPath);
    }
  }
}

async function checkFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const hits = [];
  lines.forEach((line, index) => {
    if (conflictPatterns.some((pattern) => pattern.test(line))) {
      hits.push(index + 1);
    }
  });
  if (hits.length > 0) {
    conflicts.push({ filePath: path.relative(repoRoot, filePath), lines: hits });
  }
}

const conflicts = [];

await walk(repoRoot);

if (conflicts.length > 0) {
  console.error('Conflict markers found in the following files:');
  conflicts.forEach(({ filePath, lines }) => {
    console.error(`- ${filePath}: lines ${lines.join(', ')}`);
  });
  process.exitCode = 1;
} else {
  console.log('No conflict markers (<<< >>> or Git merge markers) were found.');
}
