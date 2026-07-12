import { Card, SuperType } from '../../game';

export interface CardsInfo {
  cards: Card[];
  hash: string;
}

export interface CardsHash {
  cardsTotal: number;
  hash: string;
}

/** Runtime class-inheritance edge for reprint / parent-map tooling. */
export interface CardParentMapEntry {
  fullName: string;
  name: string;
  set: string;
  setNumber: string;
  className: string;
  /** Immediate parent constructor name (e.g. UltraBall, TrainerCard). */
  parentClassName: string | null;
  /** fullName of the registered card whose class is parentClassName, if any. */
  parentFullName: string | null;
  regulationMark?: string;
  superType: SuperType;
}

export interface CardParentMap {
  entries: CardParentMapEntry[];
}
