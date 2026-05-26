import type { GameCommandApi } from './gameApi';
import { buildHeadlessGameView } from './headlessView';
import { configuredServerUrl } from './serverConfig';
import type { CardTarget, EngineResponse, GameView } from './types';

type Command = {
  type: string;
  payload?: unknown;
};

async function send(command: Command): Promise<EngineResponse> {
  const serverUrl = configuredServerUrl();
  if (serverUrl) {
    return sendHostedHeadless(serverUrl, toHeadlessCommand(command));
  }

  const res = await fetch('/local-engine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = (await res.json()) as EngineResponse;
  return data;
}

let hostedLastView: GameView | undefined;

async function sendHostedHeadless(serverUrl: string, command: Command): Promise<EngineResponse> {
  const res = await fetch(`${serverUrl}/v1/headless`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...command,
      sessionId: getHeadlessSessionId(),
    }),
  });
  const data = await res.json();
  if (typeof data.sessionId === 'string') {
    setHeadlessSessionId(data.sessionId);
  }
  if (!res.ok || !data.ok) {
    return {
      ok: false,
      error: data.error || 'Headless engine request failed.',
      view: hostedLastView,
    };
  }
  const view = buildHeadlessGameView(data);
  hostedLastView = view;
  return { ok: true, view };
}

function toHeadlessCommand(command: Command): Command {
  if (command.type === 'startGame') {
    return {
      type: 'newGame',
      payload: {
        ...(command.payload as Record<string, unknown>),
        promptMode: 'manual',
      },
    };
  }
  return command;
}

function getHeadlessSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem('twinleaf.headlessSessionId');
    if (existing) {
      return existing;
    }
    const next = typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    setHeadlessSessionId(next);
    return next;
  } catch {
    return '';
  }
}

function setHeadlessSessionId(sessionId: string): void {
  try {
    window.sessionStorage.setItem('twinleaf.headlessSessionId', sessionId);
  } catch {
    // Session ids are only a convenience for separating in-memory engine sessions.
  }
}

export const localGameApi: GameCommandApi & {
  start(player1Deck: string[], player2Deck: string[]): Promise<EngineResponse>;
  state(): Promise<EngineResponse>;
} = {
  start(player1Deck: string[], player2Deck: string[]) {
    return send({
      type: 'startGame',
      payload: {
        player1: { name: 'Player 1', deck: player1Deck },
        player2: { name: 'Player 2', deck: player2Deck },
      },
    });
  },

  state() {
    return send({ type: 'state' });
  },

  playCard(playerIndex: number, handIndex: number, target: CardTarget) {
    return send({ type: 'playCard', payload: { playerIndex, handIndex, target } });
  },

  attack(playerIndex: number, attack: string) {
    return send({ type: 'attack', payload: { playerIndex, attack } });
  },

  useAbility(playerIndex: number, ability: string, target: CardTarget) {
    return send({ type: 'useAbility', payload: { playerIndex, ability, target } });
  },

  concede(playerIndex: number) {
    return send({ type: 'concede', payload: { playerIndex } });
  },

  retreat(playerIndex: number, to: number) {
    return send({ type: 'retreat', payload: { playerIndex, to } });
  },

  passTurn(playerIndex: number) {
    return send({ type: 'passTurn', payload: { playerIndex } });
  },

  resolvePrompt(id: number, result: unknown) {
    return send({ type: 'resolvePrompt', payload: { id, result } });
  },
};
