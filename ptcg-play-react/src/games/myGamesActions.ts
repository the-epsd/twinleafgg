import type { GameState } from 'ptcg-server';
import { getSocketManager } from '../socket/socketManager';
import { decodeStateData } from '../table/gameSessionUtils';

/** Decline an incoming invite by resolving the Invite player prompt with null. */
export async function declineGameInvite(gameId: number): Promise<void> {
  const socket = getSocketManager();
  const gs = await socket.emit<number, GameState>('game:join', gameId);
  const decoded = decodeStateData(gs.stateData);
  if (!decoded) {
    throw new Error('Failed to read invite state');
  }
  const prompt = decoded.state.prompts.find(
    (p) => p.type === 'Invite player' && p.result === undefined,
  );
  if (!prompt) {
    throw new Error('Invite prompt not found');
  }
  await socket.emit('game:action:resolvePrompt', {
    gameId,
    id: prompt.id,
    result: null,
  });
}
