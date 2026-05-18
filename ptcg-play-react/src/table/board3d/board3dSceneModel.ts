import type { CardTarget } from 'ptcg-server';
import type { Board3dCard } from './board-3d-card';

/** Serializable transform for React-driven views (Three uses radians for Y rotation). */
export type Board3dTransformSnapshot = {
  position: { x: number; y: number; z: number };
  rotationY: number;
  scale: number;
};

/**
 * One board zone card in the scene model. Plain data for UI; {@link bridgeRef} remains until JSX meshes replace class-backed cards (Phase 4).
 */
export type Board3dBoardCardSnapshot = {
  meshId: string;
  transform: Board3dTransformSnapshot;
  cardTarget?: CardTarget;
  /** Main card id from game state (userData.cardData.id). */
  mainCardId: number | undefined;
  visibility: boolean;
  faceDown: boolean;
  isBoardCard: boolean;
  isStadium: boolean;
  isPrize: boolean;
  /** Imperative mesh + materials (bridge). */
  bridgeRef: Board3dCard;
};

/** Hand slot descriptor (Phase 5). */
export type Board3dHandSlotSnapshot = {
  handIndex: number;
  cardId: number | undefined;
  bridgeRef?: Board3dCard;
};

export type Board3dSceneModelSnapshot = {
  version: number;
  boardCards: Board3dBoardCardSnapshot[];
  /** Populated in Phase 5. */
  handSlots: Board3dHandSlotSnapshot[];
};

export function emptySceneModelSnapshot(): Board3dSceneModelSnapshot {
  return { version: 0, boardCards: [], handSlots: [] };
}

/** @deprecated Prefer {@link Board3dBoardCardSnapshot} from {@link Board3dSceneModelSnapshot}. */
export type Board3dBoardCardModelEntry = {
  meshId: string;
  card: Board3dCard;
  cardTarget?: CardTarget;
};

export function boardCardModelEntries(cardsMap: Map<string, Board3dCard>): Board3dBoardCardModelEntry[] {
  return Array.from(cardsMap.entries()).map(([meshId, card]) => ({
    meshId: String(meshId),
    card,
    cardTarget: card.getGroup().userData.cardTarget as CardTarget | undefined,
  }));
}
