import { HeadlessPromptJson } from './engine';
import { FailedAttempt, PlayableCard, SeatOpponentView, SeatSelfView, SeatView } from './types';

// Builds the per-seat view of a god-view snapshot summary. Fields are
// whitelisted (never spread) so new engine summary fields cannot leak hidden
// information by default. logs, events and serializedState never enter a view.

function publicZones(player: any) {
  return {
    id: player.id,
    name: player.name,
    deckCount: player.deckCount,
    discard: player.discard,
    lostZone: player.lostZone,
    stadium: player.stadium,
    playZone: player.playZone,
    prizesLeft: player.prizesLeft,
    active: player.active,
    bench: player.bench
  };
}

function buildPlayableCards(player: any): PlayableCard[] {
  const ids: number[] = player.playableCardIds ?? [];
  return ids
    .map(cardId => {
      const handIndex = player.hand.findIndex((card: any) => card.id === cardId);
      return { cardId, handIndex, name: player.hand[handIndex]?.fullName };
    })
    .filter(item => item.handIndex !== -1);
}

export function buildSeatView(
  summary: any,
  seatIndex: number,
  pendingPrompt: HeadlessPromptJson | undefined,
  failedAttempts: FailedAttempt[]
): SeatView {
  const self = summary.players[seatIndex];
  const other = summary.players[1 - seatIndex];

  const me: SeatSelfView = {
    ...publicZones(self),
    hand: self.hand,
    availableActions: self.availableActions
  };

  const opponent: SeatOpponentView = {
    ...publicZones(other),
    handCount: other.hand.length
  };

  return {
    seatIndex,
    phase: summary.phase,
    turn: summary.turn,
    isMyTurn: summary.activePlayer === seatIndex,
    me,
    opponent,
    playableCards: buildPlayableCards(self),
    pendingPrompt,
    failedAttempts
  };
}
