import * as fs from 'fs';
import * as path from 'path';

import { RandomAgent } from './agents/random';
import { getDeck } from './decks';
import { GameLog } from './game-log';
import { runMatch } from './match-runner';
import { GameResult } from './types';

interface CliArgs {
  games: number;
  deck1: string;
  deck2: string;
  out: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { games: 10, deck1: 'lightning-fixture', deck2: 'lightning-fixture', out: 'data/games' };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    switch (key) {
      case '--games': args.games = parseInt(value, 10); break;
      case '--deck1': args.deck1 = value; break;
      case '--deck2': args.deck2 = value; break;
      case '--out': args.out = value; break;
      default: throw new Error(`Unknown argument: ${key}`);
    }
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const decks: [string[], string[]] = [getDeck(args.deck1), getDeck(args.deck2)];
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const runDir = path.join(args.out, runId);

  const results: GameResult[] = [];
  const errorCounts = new Map<string, number>();

  for (let i = 0; i < args.games; i++) {
    const log = new GameLog(path.join(runDir, `game-${String(i + 1).padStart(3, '0')}.jsonl`));
    log.header({
      game: i + 1,
      deck1: args.deck1,
      deck2: args.deck2,
      seats: ['random-1', 'random-2'],
      startedAt: new Date().toISOString()
    });

    const result = runMatch({
      seats: [new RandomAgent('random-1'), new RandomAgent('random-2')],
      decks,
      onDecision: record => {
        log.decision(record);
        for (const attempt of record.failedAttempts) {
          errorCounts.set(attempt.error, (errorCounts.get(attempt.error) ?? 0) + 1);
        }
      },
      onEvents: events => log.events(events)
    });

    log.outcome(result);
    log.write();
    results.push(result);

    const outcome = result.outcome === 'finished'
      ? `winner=${result.winnerSeat === null ? 'draw/none' : `seat${result.winnerSeat}`}`
      : `${result.outcome}${result.error ? `: ${result.error}` : ''}`;
    console.log(`game ${i + 1}/${args.games}: ${outcome} turns=${result.turns} commands=${result.commands} illegal=${result.illegalAttempts} ${result.durationMs}ms`);
  }

  const finished = results.filter(r => r.outcome === 'finished');
  const summary = {
    games: results.length,
    finished: finished.length,
    capped: results.filter(r => r.outcome === 'capped').length,
    errors: results.filter(r => r.outcome === 'error').length,
    seat0Wins: finished.filter(r => r.winnerSeat === 0).length,
    seat1Wins: finished.filter(r => r.winnerSeat === 1).length,
    draws: finished.filter(r => r.winnerSeat === null).length,
    avgTurns: results.length ? Math.round(results.reduce((sum, r) => sum + r.turns, 0) / results.length) : 0,
    avgCommands: results.length ? Math.round(results.reduce((sum, r) => sum + r.commands, 0) / results.length) : 0,
    totalIllegalAttempts: results.reduce((sum, r) => sum + r.illegalAttempts, 0),
    totalDurationMs: results.reduce((sum, r) => sum + r.durationMs, 0),
    topEngineErrors: [...errorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([error, count]) => ({ error, count }))
  };

  fs.writeFileSync(path.join(runDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log('\nrun summary:');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nlogs: ${runDir}`);
}

main();
