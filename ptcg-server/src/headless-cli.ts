import * as readline from 'readline';

import { HeadlessCommandRequest, HeadlessCommandRunner } from './game/headless/command-handler';

const runner = new HeadlessCommandRunner();

function writeResponse(request: HeadlessCommandRequest, body: any): void {
  process.stdout.write(JSON.stringify({
    id: request.id,
    ok: true,
    ...body
  }) + '\n');
}

function writeError(request: Partial<HeadlessCommandRequest>, error: any): void {
  process.stdout.write(JSON.stringify({
    id: request.id,
    ok: false,
    error: error?.message ?? String(error)
  }) + '\n');
}

function startStdio(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    terminal: false
  });

  rl.on('line', line => {
    if (line.trim().length === 0) {
      return;
    }
    let request: HeadlessCommandRequest | undefined;
    try {
      const parsed = JSON.parse(line) as HeadlessCommandRequest;
      request = parsed;
      const response = runner.handle(parsed);
      writeResponse(parsed, response);
    } catch (error) {
      writeError(request ?? {}, error);
    }
  });
}

if (process.argv.includes('--stdio')) {
  startStdio();
} else {
  process.stdout.write('Usage: npm run headless -- --stdio\n');
}
