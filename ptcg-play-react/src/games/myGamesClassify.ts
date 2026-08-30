import { GamePhase, type GameInfo } from 'ptcg-server';

export type MyGameBucket = 'incoming' | 'outgoing' | 'active';

export function isPlayerInGame(
  game: GameInfo,
  clientId: number,
  userId: number,
): boolean {
  if (game.players.some((p) => p.clientId === clientId)) {
    return true;
  }
  if (userId > 0 && game.playerUserIds?.includes(userId)) {
    return true;
  }
  return false;
}

export function classifyMyGame(
  game: GameInfo,
  clientId: number,
  userId: number,
): MyGameBucket | null {
  if (!isPlayerInGame(game, clientId, userId)) {
    return null;
  }
  if (game.pendingInvite) {
    if (game.inviteeClientId === clientId) {
      return 'incoming';
    }
    return 'outgoing';
  }
  if (game.phase === GamePhase.WAITING_FOR_PLAYERS) {
    // Waiting without invite metadata — treat as outgoing if we are not the invitee.
    return 'outgoing';
  }
  return 'active';
}

export function partitionMyGames(
  games: GameInfo[],
  clientId: number,
  userId: number,
): { incoming: GameInfo[]; outgoing: GameInfo[]; active: GameInfo[] } {
  const incoming: GameInfo[] = [];
  const outgoing: GameInfo[] = [];
  const active: GameInfo[] = [];
  for (const game of games) {
    const bucket = classifyMyGame(game, clientId, userId);
    if (bucket === 'incoming') {
      incoming.push(game);
    } else if (bucket === 'outgoing') {
      outgoing.push(game);
    } else if (bucket === 'active') {
      active.push(game);
    }
  }
  return { incoming, outgoing, active };
}

export function opponentPlayerIndex(game: GameInfo, clientId: number, userId: number): number {
  const byClient = game.players.findIndex((p) => p.clientId === clientId);
  if (byClient !== -1) {
    return byClient === 0 ? 1 : 0;
  }
  const byUser = game.playerUserIds?.findIndex((id) => id === userId) ?? -1;
  if (byUser !== -1) {
    return byUser === 0 ? 1 : 0;
  }
  return 0;
}

export function statusChipForGame(
  game: GameInfo,
  clientId: number,
): 'invite' | 'setup' | 'your_turn' | 'opponent_turn' | 'active' {
  if (game.pendingInvite || game.phase === GamePhase.WAITING_FOR_PLAYERS) {
    return 'invite';
  }
  if (game.phase === GamePhase.SETUP) {
    return 'setup';
  }
  if (
    game.phase === GamePhase.PLAYER_TURN ||
    game.phase === GamePhase.ATTACK ||
    game.phase === GamePhase.AFTER_ATTACK ||
    game.phase === GamePhase.CHOOSE_PRIZES ||
    game.phase === GamePhase.BETWEEN_TURNS
  ) {
    const myIndex = game.players.findIndex((p) => p.clientId === clientId);
    if (myIndex !== -1) {
      return game.activePlayer === myIndex ? 'your_turn' : 'opponent_turn';
    }
  }
  return 'active';
}
