
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  existsSync,
  rmSync,
  statSync,
  readdirSync
} from 'node:fs';

const requiredFiles = [
  'index.html',
  'vocab/package.json',
  'resources/photosynthesis-worksheet.pdf',
  'resources/campbell-quang-hop-vietnamese.pdf',
  'resources/campbell-photosynthesis-english.pdf',
  'infographics/1.png',
  'infographics/2.png',
  'infographics/3.png'
];

function verifyFile(file) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    throw new Error(`Missing required file: ${file}`);
  }

  if (statSync(file).size === 0) {
    throw new Error(`Empty required file: ${file}`);
  }
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed with status ${result.status}`
    );
  }
}

for (const file of requiredFiles) {
  verifyFile(file);
}

rmSync('dist', { recursive: true, force: true });

run('npm', ['install', '--no-audit', '--no-fund'], 'vocab');
run('npm', ['run', 'build'], 'vocab');

verifyFile('vocab/dist/index.html');

mkdirSync('dist', { recursive: true });

cpSync('index.html', 'dist/index.html');
cpSync('vocab/dist', 'dist/vocab', { recursive: true });
cpSync('resources', 'dist/resources', { recursive: true });
cpSync('infographics', 'dist/infographics', { recursive: true });

for (const file of requiredFiles) {
  if (file === 'vocab/package.json') continue;
  verifyFile(`dist/${file}`);
}

verifyFile('dist/vocab/index.html');

if (readdirSync('dist/vocab').length === 0) {
  throw new Error('Vocabulary output is empty');
}

console.log('Build completed. Required resources are present.');
