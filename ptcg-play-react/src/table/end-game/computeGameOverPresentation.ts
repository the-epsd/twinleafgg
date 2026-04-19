import type { Card } from 'ptcg-server';
import { GameWinner, SuperType } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import type { PlayerGameStats } from './playerGameStats';

export type PokemonDamageStats = {
  card: Card;
  damage: number;
  reason?: 'damage' | 'knockout';
};

export type GameOverResultClass = 'victory' | 'defeat' | 'draw';

export type GameOverViewModel = {
  winner: GameWinner;
  isWinner: boolean;
  resultClass: GameOverResultClass;
  playerUsername: string;
  opponentUsername: string;
  wentFirst: boolean;
  turnCount: number;
  prizeIndicators: number[];
  playerPrizesTaken: number;
  opponentPrizesTaken: number;
  playerDamageDealt: number;
  opponentDamageDealt: number;
  hasAccurateStatistics: boolean;
  hasAccurateDamageStats: boolean;
  playerDamageDisplay: string;
  opponentDamageDisplay: string;
  topPokemon: PokemonDamageStats | null;
  opponentTopPokemon: PokemonDamageStats | null;
  topPokemonBadgeText: string;
  opponentTopPokemonBadgeText: string;
  showYourTopPokemon: boolean;
  showOpponentTopPokemon: boolean;
};

function isValidPokemonCard(card: Card): boolean {
  return !!(
    card &&
    card.superType === SuperType.POKEMON &&
    card.name &&
    card.name.trim().length > 0
  );
}

function getCardHp(card: Card): number {
  const c = card as Card & { hp?: number | string };
  if (c.hp && typeof c.hp === 'number') {
    return c.hp;
  }
  if (c.hp && typeof c.hp === 'string') {
    const hpMatch = c.hp.match(/\d+/);
    if (hpMatch) {
      return parseInt(hpMatch[0], 10);
    }
  }
  return 0;
}

function getEvolutionStage(card: Card): number {
  const cardName = card.name.toLowerCase();
  if (cardName.includes('ex') || cardName.includes('gx') || cardName.includes('v')) {
    return 3;
  }
  const stage = (card as Card & { stage?: string }).stage;
  if (stage) {
    const s = stage.toLowerCase();
    if (s.includes('stage 2') || s.includes('stage2')) return 2;
    if (s.includes('stage 1') || s.includes('stage1')) return 1;
    if (s.includes('basic')) return 0;
  }
  const hp = getCardHp(card);
  if (hp >= 200) return 3;
  if (hp >= 150) return 2;
  if (hp >= 100) return 1;
  return 0;
}

function selectBestPokemonCandidate(candidates: Card[]): Card | null {
  if (candidates.length === 0) {
    return null;
  }
  if (candidates.length === 1) {
    return candidates[0];
  }
  const sortedCandidates = [...candidates].sort((a, b) => {
    const aStage = getEvolutionStage(a);
    const bStage = getEvolutionStage(b);
    if (aStage !== bStage) {
      return bStage - aStage;
    }
    const aHp = getCardHp(a);
    const bHp = getCardHp(b);
    if (aHp !== bHp) {
      return bHp - aHp;
    }
    return a.name.localeCompare(b.name);
  });
  return sortedCandidates[0];
}

function findBestPokemonWithEvolution(player: {
  active?: { cards: Card[] };
  bench?: { cards: Card[] }[];
  discard?: { cards: Card[] };
}): Card | null {
  const pokemonCandidates: Card[] = [];
  const isPokemonCard = (c: Card): boolean => c.superType === SuperType.POKEMON;
  const getTopCard = (cardList: { cards: Card[] } | undefined): Card | null => {
    if (cardList?.cards?.length) {
      const topCard = cardList.cards[cardList.cards.length - 1];
      return isPokemonCard(topCard) ? topCard : null;
    }
    return null;
  };
  if (player.active) {
    const activeCard = getTopCard(player.active);
    if (activeCard) {
      pokemonCandidates.push(activeCard);
    }
  }
  if (player.bench?.length) {
    for (const benchPokemon of player.bench) {
      const benchCard = getTopCard(benchPokemon);
      if (benchCard) {
        pokemonCandidates.push(benchCard);
      }
    }
  }
  if (player.discard?.cards) {
    try {
      for (const card of player.discard.cards) {
        if (isPokemonCard(card)) {
          pokemonCandidates.push(card);
        }
      }
    } catch {
      /* ignore */
    }
  }
  return selectBestPokemonCandidate(pokemonCandidates);
}

function getDamageDisplayText(damage: number, hasAccurateDamageStats: boolean): string {
  if (damage === undefined || damage === null) {
    return hasAccurateDamageStats ? '0' : 'Unknown';
  }
  return damage.toString();
}

function getPokemonDamageDisplayText(
  pokemon: PokemonDamageStats | null,
  hasAccurateDamageStats: boolean,
): string {
  if (!pokemon) {
    return 'No Pokémon found';
  }
  if (pokemon.damage === undefined || pokemon.damage === null) {
    return hasAccurateDamageStats ? 'No damage dealt' : 'Damage unknown';
  }
  if (pokemon.damage === 0) {
    return 'No damage dealt';
  }
  return `${pokemon.damage} damage dealt`;
}

function prizeFallbackFromState(
  gameState: LocalGameState,
  playerIndex: number,
  opponentIndex: number,
): {
  playerStats: PlayerGameStats;
  opponentStats: PlayerGameStats;
  playerPrizesTaken: number;
  opponentPrizesTaken: number;
  playerDamageDealt: number;
  opponentDamageDealt: number;
} {
  const state = gameState.state;
  let playerPrizesTaken = 0;
  let opponentPrizesTaken = 0;
  if (state.players[playerIndex]?.prizes) {
    const totalPrizes = state.players[playerIndex].prizes.length;
    const remainingPrizes = state.players[playerIndex].prizes.filter((p) => p.cards.length > 0)
      .length;
    playerPrizesTaken = totalPrizes - remainingPrizes;
  }
  if (state.players[opponentIndex]?.prizes) {
    const totalPrizes = state.players[opponentIndex].prizes.length;
    const remainingPrizes = state.players[opponentIndex].prizes.filter((p) => p.cards.length > 0)
      .length;
    opponentPrizesTaken = totalPrizes - remainingPrizes;
  }
  const pTaken = state.players[playerIndex] as { prizesTaken?: number };
  const oTaken = state.players[opponentIndex] as { prizesTaken?: number };
  if (playerPrizesTaken === 0 && pTaken.prizesTaken !== undefined) {
    playerPrizesTaken = pTaken.prizesTaken;
  }
  if (opponentPrizesTaken === 0 && oTaken.prizesTaken !== undefined) {
    opponentPrizesTaken = oTaken.prizesTaken;
  }
  playerPrizesTaken = Number(playerPrizesTaken) || 0;
  opponentPrizesTaken = Number(opponentPrizesTaken) || 0;
  return {
    playerStats: {
      prizesTakenCount: playerPrizesTaken,
      totalDamageDealt: 0,
      topPokemon: null,
    },
    opponentStats: {
      prizesTakenCount: opponentPrizesTaken,
      totalDamageDealt: 0,
      topPokemon: null,
    },
    playerPrizesTaken,
    opponentPrizesTaken,
    playerDamageDealt: 0,
    opponentDamageDealt: 0,
  };
}

function loadAccurateStatistics(
  gameState: LocalGameState,
  playerIndex: number,
  opponentIndex: number,
): {
  playerStats: PlayerGameStats | null;
  opponentStats: PlayerGameStats | null;
  playerPrizesTaken: number;
  opponentPrizesTaken: number;
  playerDamageDealt: number;
  opponentDamageDealt: number;
} {
  let playerStats: PlayerGameStats | null = null;
  let opponentStats: PlayerGameStats | null = null;
  let playerPrizesTaken = 0;
  let opponentPrizesTaken = 0;
  let playerDamageDealt = 0;
  let opponentDamageDealt = 0;

  try {
    if (gameState.enhancedPlayerStats && gameState.enhancedPlayerStats.length >= 2) {
      playerStats = gameState.enhancedPlayerStats[playerIndex] ?? null;
      opponentStats = gameState.enhancedPlayerStats[opponentIndex] ?? null;
      if (playerStats) {
        playerPrizesTaken = playerStats.prizesTakenCount;
        playerDamageDealt = playerStats.totalDamageDealt;
      }
      if (opponentStats) {
        opponentPrizesTaken = opponentStats.prizesTakenCount;
        opponentDamageDealt = opponentStats.totalDamageDealt;
      }
      return {
        playerStats,
        opponentStats,
        playerPrizesTaken,
        opponentPrizesTaken,
        playerDamageDealt,
        opponentDamageDealt,
      };
    }

    const player = gameState.state.players[playerIndex];
    const opponent = gameState.state.players[opponentIndex];

    if (player && (player as unknown as { gameStats?: Record<string, unknown> }).gameStats) {
      const playerGameStats = (player as unknown as { gameStats: Record<string, unknown> }).gameStats;
      playerPrizesTaken = (playerGameStats.prizesTakenCount as number) || 0;
      playerDamageDealt = (playerGameStats.totalDamageDealt as number) || 0;
      playerStats = {
        prizesTakenCount: playerPrizesTaken,
        totalDamageDealt: playerDamageDealt,
        topPokemon: (playerGameStats.topPokemon as PlayerGameStats['topPokemon']) || null,
      };
    }

    if (opponent && (opponent as unknown as { gameStats?: Record<string, unknown> }).gameStats) {
      const opponentGameStats = (opponent as unknown as { gameStats: Record<string, unknown> }).gameStats;
      opponentPrizesTaken = (opponentGameStats.prizesTakenCount as number) || 0;
      opponentStats = {
        prizesTakenCount: opponentPrizesTaken,
        totalDamageDealt: (opponentGameStats.totalDamageDealt as number) || 0,
        topPokemon: (opponentGameStats.topPokemon as PlayerGameStats['topPokemon']) || null,
      };
      opponentDamageDealt = opponentStats.totalDamageDealt;
    }

    if (playerStats || opponentStats) {
      return {
        playerStats,
        opponentStats,
        playerPrizesTaken,
        opponentPrizesTaken,
        playerDamageDealt,
        opponentDamageDealt,
      };
    }

    const fb = prizeFallbackFromState(gameState, playerIndex, opponentIndex);
    return {
      playerStats: fb.playerStats,
      opponentStats: fb.opponentStats,
      playerPrizesTaken: fb.playerPrizesTaken,
      opponentPrizesTaken: fb.opponentPrizesTaken,
      playerDamageDealt: fb.playerDamageDealt,
      opponentDamageDealt: fb.opponentDamageDealt,
    };
  } catch {
    const fb = prizeFallbackFromState(gameState, playerIndex, opponentIndex);
    return {
      playerStats: fb.playerStats,
      opponentStats: fb.opponentStats,
      playerPrizesTaken: fb.playerPrizesTaken,
      opponentPrizesTaken: fb.opponentPrizesTaken,
      playerDamageDealt: fb.playerDamageDealt,
      opponentDamageDealt: fb.opponentDamageDealt,
    };
  }
}

function findBestPokemon(
  gameState: LocalGameState,
  playerStats: PlayerGameStats | null,
  playerIndex: number,
): PokemonDamageStats | null {
  try {
    if (playerStats?.topPokemon) {
      const topPokemonCard = playerStats.topPokemon.card;
      if (topPokemonCard && isValidPokemonCard(topPokemonCard)) {
        return {
          card: topPokemonCard,
          damage: playerStats.topPokemon.totalDamage,
          reason: 'damage',
        };
      }
    }
    const player = gameState.state.players[playerIndex];
    if (!player) {
      return null;
    }
    const bestPokemon = findBestPokemonWithEvolution(player);
    if (bestPokemon) {
      return { card: bestPokemon, damage: 0, reason: 'damage' };
    }
  } catch {
    /* */
  }
  return null;
}

function findBestOpponentPokemon(
  gameState: LocalGameState,
  opponentStats: PlayerGameStats | null,
  opponentIndex: number,
): PokemonDamageStats | null {
  try {
    if (opponentStats?.topPokemon) {
      const topPokemonCard = opponentStats.topPokemon.card;
      if (topPokemonCard && isValidPokemonCard(topPokemonCard)) {
        return {
          card: topPokemonCard,
          damage: opponentStats.topPokemon.totalDamage,
          reason: 'damage',
        };
      }
    }
    const opponent = gameState.state.players[opponentIndex];
    if (!opponent) {
      return null;
    }
    const bestPokemon = findBestPokemonWithEvolution(opponent);
    if (bestPokemon) {
      return { card: bestPokemon, damage: 0, reason: 'damage' };
    }
  } catch {
    /* */
  }
  return null;
}

function validateDamageAndPrizes(
  maxPrizes: number,
  playerPrizesTaken: number,
  opponentPrizesTaken: number,
  playerDamageDealt: number,
  opponentDamageDealt: number,
): { playerDamageDealt: number; opponentDamageDealt: number } {
  let pd = playerDamageDealt;
  let od = opponentDamageDealt;
  try {
    if (playerPrizesTaken < 0 || playerPrizesTaken > maxPrizes) {
      /* noop — mirror Angular */
    }
    if (opponentPrizesTaken < 0 || opponentPrizesTaken > maxPrizes) {
      /* noop */
    }
    if (pd < 0) pd = 0;
    if (od < 0) od = 0;
  } catch {
    /* */
  }
  return { playerDamageDealt: pd, opponentDamageDealt: od };
}

export function computeMatchSplashState(
  gameState: LocalGameState,
  clientId: number,
): { displayText: string; resultClass: GameOverResultClass; isWinner: boolean } {
  const state = gameState.state;
  const winner = state.winner;
  if (winner === GameWinner.DRAW) {
    return { displayText: 'DRAW', resultClass: 'draw', isWinner: false };
  }
  const isPlayerA = winner === GameWinner.PLAYER_1 || (winner as unknown) === 'PLAYER_A';
  const winningPlayerId = isPlayerA ? state.players[0].id : state.players[1].id;
  const isWinner = String(clientId) === String(winningPlayerId);
  if (isWinner) {
    return { displayText: 'VICTORY', resultClass: 'victory', isWinner: true };
  }
  return { displayText: 'DEFEAT', resultClass: 'defeat', isWinner: false };
}

export function computeGameOverPresentation(
  gameState: LocalGameState,
  clientId: number,
): GameOverViewModel | null {
  if (!gameState?.state) {
    return null;
  }
  const state = gameState.state;
  const winner = state.winner;

  const maxPrizes =
    state.players?.length > 0 && state.players[0].prizes
      ? state.players[0].prizes.length
      : 6;
  const prizeIndicators = Array.from({ length: maxPrizes }, (_, i) => i + 1);

  let isWinner = false;
  if (winner !== GameWinner.DRAW) {
    const isPlayerA = winner === GameWinner.PLAYER_1 || (winner as unknown) === 'PLAYER_A';
    const winningPlayerId = isPlayerA ? state.players[0].id : state.players[1].id;
    isWinner = String(clientId) === String(winningPlayerId);
  }

  const playerIndex = state.players.findIndex((p) => String(p.id) === String(clientId));
  const opponentIndex = playerIndex === 0 ? 1 : 0;

  const playerUsername =
    state.players[playerIndex]?.name || `Player ${playerIndex + 1}`;
  const opponentUsername =
    state.players[opponentIndex]?.name || `Player ${opponentIndex + 1}`;

  const wentFirst = playerIndex !== 0;

  const loaded = loadAccurateStatistics(gameState, playerIndex, opponentIndex);
  let {
    playerStats,
    opponentStats,
    playerPrizesTaken,
    opponentPrizesTaken,
    playerDamageDealt,
    opponentDamageDealt,
  } = loaded;

  const validated = validateDamageAndPrizes(
    maxPrizes,
    playerPrizesTaken,
    opponentPrizesTaken,
    playerDamageDealt,
    opponentDamageDealt,
  );
  playerDamageDealt = validated.playerDamageDealt;
  opponentDamageDealt = validated.opponentDamageDealt;

  const topPokemon = findBestPokemon(gameState, playerStats, playerIndex);
  const opponentTopPokemon = findBestOpponentPokemon(
    gameState,
    opponentStats,
    opponentIndex,
  );

  const hasAccurateStatistics = !!(
    gameState.enhancedPlayerStats ||
    (state.players[0] as { gameStats?: unknown })?.gameStats ||
    (state.players[1] as { gameStats?: unknown })?.gameStats
  );

  const hasAccurateDamageStats = !!(
    hasAccurateStatistics &&
    ((playerStats != null && playerStats.totalDamageDealt !== undefined) ||
      (opponentStats != null && opponentStats.totalDamageDealt !== undefined))
  );

  const resultClass: GameOverResultClass =
    winner === GameWinner.DRAW ? 'draw' : isWinner ? 'victory' : 'defeat';

  const showYourTopPokemon = isWinner && winner !== GameWinner.DRAW;
  const showOpponentTopPokemon = !isWinner && winner !== GameWinner.DRAW;

  return {
    winner,
    isWinner,
    resultClass,
    playerUsername,
    opponentUsername,
    wentFirst,
    turnCount: state.turn,
    prizeIndicators,
    playerPrizesTaken,
    opponentPrizesTaken,
    playerDamageDealt,
    opponentDamageDealt,
    hasAccurateStatistics,
    hasAccurateDamageStats,
    playerDamageDisplay: getDamageDisplayText(playerDamageDealt, hasAccurateDamageStats),
    opponentDamageDisplay: getDamageDisplayText(opponentDamageDealt, hasAccurateDamageStats),
    topPokemon,
    opponentTopPokemon,
    topPokemonBadgeText: getPokemonDamageDisplayText(topPokemon, hasAccurateDamageStats),
    opponentTopPokemonBadgeText: getPokemonDamageDisplayText(
      opponentTopPokemon,
      hasAccurateDamageStats,
    ),
    showYourTopPokemon,
    showOpponentTopPokemon,
  };
}

export function getSafePokemonName(pokemon: PokemonDamageStats | null): string {
  if (!pokemon?.card) {
    return 'Unknown Pokémon';
  }
  if (!pokemon.card.name || pokemon.card.name.trim().length === 0) {
    return 'Unnamed Pokémon';
  }
  return pokemon.card.name;
}

export function hasValidCardImage(pokemon: PokemonDamageStats | null): boolean {
  if (!pokemon?.card) {
    return false;
  }
  return (
    isValidPokemonCard(pokemon.card) &&
    !!pokemon.card.name &&
    pokemon.card.name.trim().length > 0
  );
}
