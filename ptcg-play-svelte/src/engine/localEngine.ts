import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { resolveCardImageUrl } from '../lib/game/cardImages';
import {
  SlotType,
  targetFor,
  type CardView,
  type EngineResponse,
  type GameView,
  type PlayerView,
  type PokemonSlotView,
  type PromptView,
} from '../lib/game/types';

type Command = {
  type: string;
  payload?: any;
};

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
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
      const view = buildView(headless);
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
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            esModuleInterop: true,
            skipLibCheck: true,
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

function buildView(snapshot: any): GameView {
  const summary = snapshot.summary;
  const activePlayerIndex = summary?.activePlayer ?? 0;
  const players = Array.isArray(summary?.players)
    ? summary.players.map((player: any, index: number) => buildPlayerView(player, index, activePlayerIndex))
    : [];
  return {
    ready: true,
    phase: summary?.phase ?? 0,
    phaseLabel: phaseLabels[summary?.phase] ?? String(summary?.phase ?? 'Unknown'),
    turn: summary?.turn ?? 0,
    activePlayerIndex,
    activePlayerId: players[activePlayerIndex]?.id,
    winner: summary?.winner,
    players,
    prompts: Array.isArray(snapshot.prompts)
      ? snapshot.prompts.map((prompt: any) => ({
          ...prompt,
          playerIndex: players.findIndex((player: PlayerView) => player.id === prompt.playerId),
        })) satisfies PromptView[]
      : [],
    logs: Array.isArray(summary?.logs) ? summary.logs : [],
    events: Array.isArray(snapshot.events) ? snapshot.events : [],
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
  const pokemon = normalizeCard(slot?.pokemonCard ?? slot?.pokemon) ?? cards[0];
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
    energy: normalizeCards(slot?.energy),
    tools: normalizeCards(slot?.tools),
    specialConditions: Array.isArray(slot?.specialConditions) ? slot.specialConditions : [],
  };
}

function normalizeCards(cards: unknown): CardView[] {
  if (!Array.isArray(cards)) {
    return [];
  }
  return cards.map(normalizeCard).filter((card): card is CardView => card != null);
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
