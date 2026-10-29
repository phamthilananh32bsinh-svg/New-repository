import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
const exec = (cmd, args, cwd) => {
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status || 1);
};
exec('npm', ['install', '--no-audit', '--no-fund'], 'vocab');
exec('npm', ['run', 'build'], 'vocab');
if (!existsSync('vocab/dist/index.html')) throw new Error('Vocabulary build missing');
mkdirSync('dist/vocab', { recursive: true });
copyFileSync('index.html', 'dist/index.html');
cpSync('vocab/dist', 'dist/vocab', { recursive: true });
