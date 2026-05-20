import type { CardTarget, EngineResponse } from './types';

type Command = {
  type: string;
  payload?: unknown;
};

async function send(command: Command): Promise<EngineResponse> {
  const res = await fetch('/local-engine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = (await res.json()) as EngineResponse;
  return data;
}

export const localGameApi = {
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
