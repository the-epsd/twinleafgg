import * as fs from 'fs';
import * as path from 'path';

import { DecisionRecord, GameResult } from './types';

// One JSONL file per game:
//   {kind: 'header', ...}    game metadata
//   {kind: 'events', ...}    engine replay-action events outside any decision (setup)
//   {kind: 'decision', ...}  one per seat decision (view, command, retries, events)
//   {kind: 'outcome', ...}   final result
export class GameLog {
  private readonly lines: string[] = [];

  constructor(private readonly filePath: string) {}

  public header(meta: object): void {
    this.push({ kind: 'header', ...meta });
  }

  public events(events: any[]): void {
    if (events.length > 0) {
      this.push({ kind: 'events', events });
    }
  }

  public decision(record: DecisionRecord): void {
    this.push({ kind: 'decision', ...record });
  }

  public outcome(result: GameResult): void {
    this.push({ kind: 'outcome', ...result });
  }

  public write(): void {
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    fs.writeFileSync(this.filePath, this.lines.join('\n') + '\n');
  }

  private push(record: object): void {
    this.lines.push(JSON.stringify(record));
  }
}
