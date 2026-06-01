import type { CardView, GameView } from '../lib/game/types';

export type ZoneName = 'discard' | 'lostZone' | 'stadium' | 'playZone';

type OpenZone = {
  playerIndex: number;
  zone: ZoneName;
  title: string;
  faceDown?: boolean;
};

class ZoneViewerStore {
  openZone = $state<OpenZone | null>(null);

  get open() {
    return !!this.openZone;
  }

  get title() {
    return this.openZone?.title ?? '';
  }

  get faceDown() {
    return this.openZone?.faceDown ?? false;
  }

  get zone() {
    return this.openZone?.zone;
  }

  show(playerIndex: number, zone: ZoneName, title: string, faceDown = false) {
    this.openZone = { playerIndex, zone, title, faceDown };
  }

  close() {
    this.openZone = null;
  }

  cardsFor(game: GameView | null | undefined): CardView[] {
    return this.openZone && game
      ? (game.players[this.openZone.playerIndex]?.[this.openZone.zone] ?? [])
      : [];
  }
}

export const zoneViewerStore = new ZoneViewerStore();
