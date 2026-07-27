import dotenv from 'dotenv';

dotenv.config({ quiet: true });

interface HealthTarget {
  name: string;
  url: string;
}

async function checkTarget(target: HealthTarget): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(target.url, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`${target.name} returned HTTP ${response.status}`);
    }

    console.log(`OK  ${target.name} -> ${target.url} (${response.status})`);
  } finally {
    clearTimeout(timer);
  }
}

async function main(): Promise<void> {
  const bookerBase = process.env.BOOKER_BASE_URL ?? 'https://restful-booker.herokuapp.com';
  const fakeBase = process.env.FAKE_API_BASE_URL ?? 'https://fakerestapi.azurewebsites.net';

  const targets: HealthTarget[] = [
    { name: 'Restful Booker', url: `${bookerBase.replace(/\/$/, '')}/booking` },
    { name: 'Fake REST API', url: `${fakeBase.replace(/\/$/, '')}/api/v1/Books` },
  ];

  const failures: string[] = [];

  for (const target of targets) {
    try {
      await checkTarget(target);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${target.name}: ${message}`);
      console.error(`FAIL ${target.name} -> ${target.url} (${message})`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Health check failed:\n${failures.join('\n')}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
