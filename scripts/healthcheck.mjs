const url = process.env.HEALTHCHECK_URL ?? 'http://127.0.0.1:3000/api/health';
const timeoutMs = Number(process.env.HEALTHCHECK_TIMEOUT_MS ?? 10_000);

const deadline = Date.now() + timeoutMs;
let lastError;

while (Date.now() < deadline) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
    if (!response.ok) throw new Error(`received HTTP ${response.status}`);

    const body = await response.json();
    if (body.status !== 'ok') throw new Error('received an invalid health response');

    console.log(`Health check passed: ${url}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

console.error(`Health check failed for ${url}: ${lastError?.message ?? 'timed out'}`);
process.exitCode = 1;
