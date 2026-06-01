import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { resolveCardImageUrl } from '../lib/game/cardImages';
import { buildHeadlessGameView } from '../lib/game/headlessView';
import {
  SlotType,
  targetFor,
  type CardView,
  type EngineResponse,
  type GameView,
  type LogView,
  type PlayerView,
  type PokemonSlotView,
} from '../lib/game/types';
import type { ReplayLoadResponse, ReplayStep } from '../lib/game/replay';

type Command = {
  type: string;
  payload?: any;
};

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
};

type ReplayActionRecord = {
  sequence: number;
  type: string;
  turn: number;
  phase: number;
  activePlayer: number;
  stateIndex: number;
  payload: unknown;
};

const phaseLabels: Record<number, string> = {
  0: 'Waiting',
  1: 'Setup',
  2: 'Player turn',
  3: 'Attack',
  4: 'After attack',
  5: 'Choose prizes',
  6: 'Between turns',
  7: 'Finished',
};

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(thisDir, '../../..');
const serverRoot = path.join(repoRoot, 'ptcg-server');
const require = createRequire(import.meta.url);
const tsNodeBin = require.resolve('ts-node/dist/bin.js');

const savedReplays = [
  {
    id: 'railway-match-1',
    name: 'Railway match 1',
    path: path.join(repoRoot, 'ptcg-play-svelte', 'prototypes', 'replays', 'railway-match-1.replay-response.json'),
  },
];

export class LocalEngineController {
  private child: ChildProcessWithoutNullStreams | null = null;
  private pending = new Map<string, PendingRequest>();
  private seq = 1;
  private lastView: GameView | undefined;
  private stderr = '';

  async handle(command: Command): Promise<EngineResponse> {
    try {
      const headless = await this.send(toHeadlessCommand(command));
      if (!headless.ok) {
        return { ok: false, error: headless.error ?? 'Engine error', view: this.lastView };
      }
      const view = buildHeadlessGameView(headless);
      this.lastView = view;
      return { ok: true, view };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        view: this.lastView,
      };
    }
  }

  listReplays() {
    return {
      ok: true,
      replays: savedReplays.map((replay) => ({
        id: replay.id,
        name: replay.name,
        available: fs.existsSync(replay.path),
      })),
    };
  }

  loadReplay(id = savedReplays[0].id): ReplayLoadResponse {
    const replay = savedReplays.find((item) => item.id === id);
    if (!replay) {
      return { ok: false, error: `Replay not found: ${id}` };
    }
    if (!fs.existsSync(replay.path)) {
      return { ok: false, error: `Replay file not found: ${replay.path}` };
    }

    const response = JSON.parse(fs.readFileSync(replay.path, 'utf8'));
    return this.buildReplayResponse(replay.id, replay.name, response.replayData);
  }

  loadReplayData(replayData: string, name = 'Imported replay'): ReplayLoadResponse {
    return this.buildReplayResponse('imported', name, replayData);
  }

  close(): void {
    for (const pending of this.pending.values()) {
      pending.reject(new Error('Engine process closed'));
    }
    this.pending.clear();
    this.child?.kill();
    this.child = null;
  }

  private ensureChild(): ChildProcessWithoutNullStreams {
    if (this.child && !this.child.killed) {
      return this.child;
    }

    this.stderr = '';
    const child = spawn(
      process.execPath,
      [tsNodeBin, 'src/headless-cli.ts', '--stdio'],
      {
        cwd: serverRoot,
        env: {
          ...process.env,
          TS_NODE_SKIP_PROJECT: '1',
          TS_NODE_TRANSPILE_ONLY: '1',
          TS_NODE_PREFER_TS_EXTS: '1',
          TS_NODE_COMPILER_OPTIONS: JSON.stringify({
            module: 'commonjs',
            target: 'es2018',
            rootDir: 'src',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            esModuleInterop: true,
            skipLibCheck: true,
            ignoreDeprecations: '6.0',
          }),
        },
      },
    );
    this.child = child;

    child.stderr.on('data', (chunk) => {
      this.stderr += String(chunk);
    });

    const rl = readline.createInterface({ input: child.stdout });
    rl.on('line', (line) => {
      if (!line.trim().startsWith('{')) {
        return;
      }
      let response: any;
      try {
        response = JSON.parse(line);
      } catch {
        return;
      }
      const id = String(response.id ?? '');
      const pending = this.pending.get(id);
      if (!pending) {
        return;
      }
      this.pending.delete(id);
      pending.resolve(response);
    });

    child.on('exit', (code, signal) => {
      const message = `Engine process exited (${code ?? signal ?? 'unknown'}). ${this.stderr}`.trim();
      for (const pending of this.pending.values()) {
        pending.reject(new Error(message));
      }
      this.pending.clear();
      this.child = null;
    });

    return child;
  }

  private send(command: Command): Promise<any> {
    const child = this.ensureChild();
    const id = String(this.seq++);
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      child.stdin.write(`${JSON.stringify({ id, ...command })}\n`, (error) => {
        if (error) {
          this.pending.delete(id);
          reject(error);
        }
      });
    });
  }

  private buildReplayResponse(id: string, name: string, encodedReplayData: string): ReplayLoadResponse {
    try {
      const { Base64 } = require(path.join(serverRoot, 'output', 'utils', 'base64.js'));
      const {
        deserializeReplayWithRegisteredCards,
        extractReplayCardNames,
      } = require(path.join(serverRoot, 'output', 'sets', 'registry', 'replay-card-registration.js'));
      const replayData = new Base64().decode(encodedReplayData);
      const cardNames = extractReplayCardNames(replayData) as string[];
      const replay = deserializeReplayWithRegisteredCards(replayData, { indexEnabled: true });
      const actions = replay.getActions() as ReplayActionRecord[];
      const views: GameView[] = [];
      let logs: LogView[] = [];

      for (let index = 0; index < replay.getStateCount(); index += 1) {
        const view = buildReplayView(replay.getState(index), logs);
        logs = view.logs;
        views.push(view);
      }

      const steps: ReplayStep[] = [
        {
          index: 0,
          label: 'Initial state',
          stateIndex: 0,
          actionIndex: null,
          turn: views[0]?.turn ?? 0,
          phase: views[0]?.phase ?? 0,
          activePlayerIndex: views[0]?.activePlayerIndex ?? 0,
          type: 'INITIAL_STATE',
          payload: null,
        },
        ...actions.map((action, index) => ({
          index: index + 1,
          label: formatActionLabel(action.type),
          stateIndex: clampNumber(action.stateIndex, 0, Math.max(views.length - 1, 0)),
          actionIndex: index,
          sequence: action.sequence,
          turn: action.turn,
          phase: action.phase,
          activePlayerIndex: action.activePlayer,
          type: action.type,
          payload: action.payload,
        })),
      ];

      return {
        ok: true,
        replay: {
          id,
          name,
          created: replay.created,
          players: [replay.player1, replay.player2],
          winner: replay.winner,
          stateCount: replay.getStateCount(),
          actionCount: actions.length,
          turnCount: replay.getTurnCount(),
          cardNames,
          views,
          steps,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

function formatActionLabel(type: string): string {
  return type
    .toLowerCase()
    .split('_')
    .filter((part) => part !== 'action')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

function toHeadlessCommand(command: Command): Command {
  if (command.type === 'startGame') {
    return {
      type: 'newGame',
      payload: {
        ...command.payload,
        promptMode: 'manual',
      },
    };
  }
  return command;
}

function buildReplayView(state: any, previousLogs: LogView[] = []): GameView {
  const activePlayerIndex = Number(state?.activePlayer ?? 0);
  const players = Array.isArray(state?.players)
    ? state.players.map((player: any, index: number) => buildPlayerView(player, index, activePlayerIndex))
    : [];
  const incomingLogs = Array.isArray(state?.logs) ? state.logs.map(normalizeLog) : [];
  return {
    ready: true,
    phase: Number(state?.phase ?? 0),
    phaseLabel: phaseLabels[Number(state?.phase ?? 0)] ?? String(state?.phase ?? 'Unknown'),
    turn: Number(state?.turn ?? 0),
    activePlayerIndex,
    activePlayerId: players[activePlayerIndex]?.id,
    winner: state?.winner,
    players,
    prompts: [],
    logs: mergeLogs(previousLogs, incomingLogs),
    events: [],
  };
}

function buildPlayerView(player: any, index: number, activePlayerIndex: number): PlayerView {
  return {
    index,
    id: player.id,
    name: player.name,
    hand: normalizeCards(player.hand),
    deckCount: player.deckCount ?? 0,
    discard: normalizeCards(player.discard),
    lostZone: normalizeCards(player.lostZone),
    stadium: normalizeCards(player.stadium),
    playZone: normalizeCards(player.playZone),
    prizesLeft: player.prizesLeft ?? 0,
    active: buildPokemonSlot(player.active, index, 'active', 0, activePlayerIndex),
    bench: Array.isArray(player.bench)
      ? player.bench.map((slot: any, slotIndex: number) =>
          buildPokemonSlot(slot, index, 'bench', slotIndex, activePlayerIndex),
        )
      : [],
    playableCardIds: Array.isArray(player.playableCardIds) ? player.playableCardIds : [],
  };
}

function buildPokemonSlot(
  slot: any,
  ownerIndex: number,
  kind: 'active' | 'bench',
  index: number,
  activePlayerIndex: number,
): PokemonSlotView {
  const slotType = kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH;
  const cards = normalizeCards(slot?.cards);
  const pokemon = normalizeCard(callMaybe(slot, 'getPokemonCard') ?? slot?.pokemonCard ?? slot?.pokemon) ?? cards[0];
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(activePlayerIndex, ownerIndex, slotType, index),
    empty: cards.length === 0 && !pokemon,
    pokemon,
    cards,
    damage: slot?.damage ?? 0,
    hp: slot?.hp ?? 0,
    retreat: Array.isArray(slot?.retreat) ? slot.retreat : [],
    energy: normalizeCards(slot?.energies ?? slot?.energy),
    tools: normalizeCards(slot?.tools),
    specialConditions: Array.isArray(slot?.specialConditions) ? slot.specialConditions : [],
  };
}

function normalizeCards(cards: unknown): CardView[] {
  if (cards && typeof cards === 'object' && Array.isArray((cards as { cards?: unknown[] }).cards)) {
    return normalizeCards((cards as { cards: unknown[] }).cards);
  }
  if (!Array.isArray(cards)) {
    return [];
  }
  return cards.map(normalizeCard).filter((card): card is CardView => card != null);
}

function normalizeLog(log: any): LogView {
  return {
    id: Number(log?.id ?? 0),
    message: String(log?.message ?? ''),
    params: log?.params,
    client: log?.client,
  };
}

function mergeLogs(previousLogs: LogView[], incomingLogs: LogView[]): LogView[] {
  const seen = new Set(previousLogs.map((log) => log.id));
  return [...previousLogs, ...incomingLogs.filter((log) => !seen.has(log.id))];
}

function callMaybe(target: any, method: string): unknown {
  return typeof target?.[method] === 'function' ? target[method]() : undefined;
}

function normalizeCard(card: any): CardView | undefined {
  if (!card) {
    return undefined;
  }
  if (typeof card === 'string') {
    return {
      name: card.replace(/\s+[A-Z0-9-]{2,8}(?:\s+\d+)?$/, ''),
      fullName: card,
    };
  }
  return {
    id: card.id,
    name: card.name ?? card.fullName ?? 'Unknown',
    fullName: card.fullName ?? card.name ?? 'Unknown',
    set: card.set,
    setNumber: card.setNumber,
    cardImage: card.cardImage,
    imageUrl: resolveCardImageUrl(card),
    superType: card.superType,
    cardType: card.cardType,
    trainerType: card.trainerType,
    energyType: card.energyType,
    stage: card.stage,
    evolvesFrom: card.evolvesFrom,
    hp: typeof card.hp === 'number' ? card.hp : undefined,
    attacks: card.attacks,
    powers: card.powers,
  };
}
