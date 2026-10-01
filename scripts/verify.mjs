import { spawn } from 'node:child_process';

const checks = [
  ['typecheck', 60_000],
  ['lint', 60_000],
  ['test', 60_000],
  ['build', 120_000],
];

for (const [name, timeoutMs] of checks) {
  await new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', name], { stdio: 'inherit' });
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`${name} exceeded its ${timeoutMs / 1_000}-second limit`));
    }, timeoutMs);

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`${name} failed${signal ? ` (${signal})` : ` with exit code ${code}`}`));
    });
  });
}

console.log('Verification passed.');
