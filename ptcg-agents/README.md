# ptcg-agents

Agent harness for headless Pokemon TCG games. Runs matches between pluggable
`Seat` implementations (random agent today; LLM and trained agents later)
against the `ptcg-server` engine in-process, with per-seat information hiding
and per-decision JSONL logs intended as future training data.

## Run

```bash
npm run games -- --games 100                 # random vs random, fixture decks
npm run games -- --deck1 lightning-fixture --deck2 path/to/deck.json
```

A deck file is a JSON array of 60 engine card fullNames. Logs land in
`data/games/<run-timestamp>/` (gitignored): one `.jsonl` per game plus
`summary.json` for the run.

## How it works

- `src/engine.ts` — the only file that imports from ptcg-server. The harness
  speaks the headless command surface (`HeadlessCommandRunner.handle`), which
  is the same protocol the stdio CLI and the Svelte local engine use, so seats
  written here can later drive games over any transport.
- `src/match-runner.ts` — drives one game in `promptMode: 'manual'`: routes
  pending prompts to the owning seat (by player id), otherwise asks the active
  seat for a board command. Engine rejections are fed back to the seat for a
  retry (`failedAttempts`) and counted; after 20 failures the runner forces an
  engine-default prompt resolution or a pass. Caps: 150 turns / 2000 commands.
- `src/redact.ts` — builds each seat's view of the god-view snapshot by field
  whitelist: opponent hand becomes a count; engine logs, events and serialized
  state never enter a view.
- `src/agents/random.ts` — uniform pick over plausible commands (playable
  cards x board targets, legal attacks/abilities/retreats, pass). Prompts are
  answered with the engine's default resolution (`resolvePrompt` +
  `useDefault: true`).

## Log schema (JSONL, one file per game)

| `kind`     | contents                                                          |
| ---------- | ----------------------------------------------------------------- |
| `header`   | decks, seats, start time                                          |
| `events`   | engine replay-action events outside any decision (game setup)     |
| `decision` | `seq`, `seatIndex`, `decisionType` (prompt/board), redacted `view`, `command`, `failedAttempts`, `forced`, resulting `events` |
| `outcome`  | `outcome` (finished/capped/error), `winnerSeat`, `turns`, `commands`, `illegalAttempts`, `durationMs` |

## Notes / future work

- The engine uses unseeded `Math.random` (shuffles, coin flips); runs are not
  reproducible yet.
- Replay-viewer export: decision `events` are replay-action records, but
  assembling a frontend-loadable replay blob is not wired up yet.
- LLM seat (milestone 2) and Svelte human-vs-agent mode (milestone 3) plug in
  as new `Seat` implementations.
