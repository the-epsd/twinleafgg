import { GamePhase, GameWinner, HeadlessCommandRequest, HeadlessCommandRunner, HeadlessPromptJson } from './engine';
import { buildSeatView } from './redact';
import { DecisionRecord, FailedAttempt, GameResult, Seat } from './types';

export interface MatchConfig {
  seats: [Seat, Seat];
  decks: [string[], string[]];
  maxTurns?: number;
  maxCommands?: number;
  maxRetries?: number;
  onDecision?: (record: DecisionRecord) => void;
  // Engine events not attributable to a decision (e.g. game setup).
  onEvents?: (events: any[]) => void;
}

const DEFAULT_MAX_TURNS = 150;
const DEFAULT_MAX_COMMANDS = 2000;
const DEFAULT_MAX_RETRIES = 20;

export function runMatch(config: MatchConfig): GameResult {
  const startedAt = Date.now();
  const maxTurns = config.maxTurns ?? DEFAULT_MAX_TURNS;
  const maxCommands = config.maxCommands ?? DEFAULT_MAX_COMMANDS;
  const maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;

  const runner = new HeadlessCommandRunner();
  let commands = 0;
  let illegalAttempts = 0;
  let seq = 0;

  const result = (outcome: GameResult['outcome'], summary: any, error?: string): GameResult => {
    const rawWinner = summary.winner ?? GameWinner.NONE;
    const winnerSeat = rawWinner === GameWinner.PLAYER_1 ? 0 : rawWinner === GameWinner.PLAYER_2 ? 1 : null;
    return {
      outcome,
      winnerSeat,
      rawWinner,
      turns: summary.turn,
      commands,
      illegalAttempts,
      durationMs: Date.now() - startedAt,
      error
    };
  };

  let response = runner.handle({
    type: 'newGame',
    payload: {
      player1: { id: 1, name: config.seats[0].name, deck: config.decks[0] },
      player2: { id: 2, name: config.seats[1].name, deck: config.decks[1] },
      promptMode: 'manual'
    }
  });
  config.onEvents?.(response.events);

  // An invalid deck does not throw; the engine silently finishes the game
  // with no winner before it starts.
  if (response.summary.phase === GamePhase.FINISHED) {
    return result('error', response.summary, 'game finished during setup (invalid deck?)');
  }

  while (response.summary.phase !== GamePhase.FINISHED) {
    if (response.summary.turn > maxTurns || commands >= maxCommands) {
      return result('capped', response.summary);
    }

    const summary = response.summary;
    const prompt: HeadlessPromptJson | undefined = response.prompts[0];

    let seatIndex: number;
    if (prompt) {
      seatIndex = summary.players.findIndex((p: any) => p.id === prompt.playerId);
      if (seatIndex === -1) {
        return result('error', summary, `prompt ${prompt.id} for unknown player id ${prompt.playerId}`);
      }
    } else if (summary.phase === GamePhase.PLAYER_TURN) {
      seatIndex = summary.activePlayer;
    } else {
      return result('error', summary, `no prompts pending in phase ${GamePhase[summary.phase]}`);
    }

    const seat = config.seats[seatIndex];
    const failedAttempts: FailedAttempt[] = [];
    let resolved = false;

    while (!resolved) {
      const forced = failedAttempts.length >= maxRetries;
      const view = buildSeatView(summary, seatIndex, prompt, failedAttempts);
      const command: HeadlessCommandRequest = forced
        ? forcedCommand(prompt, seatIndex)
        : seat.act(view);

      enforceSeat(command, seatIndex, prompt);

      try {
        const next = runner.handle(command);
        commands++;
        config.onDecision?.({
          seq: seq++,
          seatIndex,
          decisionType: prompt ? 'prompt' : 'board',
          view,
          command,
          failedAttempts,
          forced,
          events: next.events
        });
        response = next;
        resolved = true;
      } catch (error: any) {
        illegalAttempts++;
        failedAttempts.push({ command, error: error?.message ?? String(error) });
        if (forced) {
          return result('error', summary, `forced fallback rejected: ${error?.message ?? error}`);
        }
      }
    }
  }

  return result('finished', response.summary);
}

// Last-resort command after a seat exhausted its retries: engine-default the
// prompt, or pass the turn.
function forcedCommand(prompt: HeadlessPromptJson | undefined, seatIndex: number): HeadlessCommandRequest {
  if (prompt) {
    return { type: 'resolvePrompt', payload: { id: prompt.id, useDefault: true } };
  }
  return { type: 'passTurn', payload: { player: seatIndex } };
}

// A seat may only resolve its own pending prompt or act as itself. passTurn
// without an explicit player would default to the active player, so the
// runner stamps the seat index on every board command.
function enforceSeat(command: HeadlessCommandRequest, seatIndex: number, prompt: HeadlessPromptJson | undefined): void {
  if (command.type === 'resolvePrompt') {
    if (!prompt || command.payload?.id !== prompt.id) {
      throw new Error(`[runner] seat ${seatIndex} tried to resolve prompt ${command.payload?.id}, pending is ${prompt?.id}`);
    }
    return;
  }
  if (prompt) {
    throw new Error(`[runner] seat ${seatIndex} must resolve prompt ${prompt.id} before board actions`);
  }
  command.payload = { ...command.payload, player: seatIndex };
}
