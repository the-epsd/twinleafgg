/** Shared catalog types used by browse + draft mapping. */

export interface TcgDexSerieResume {
  id: string;
  name: string;
  logo?: string;
}

export interface TcgDexSetResume {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: { total: number; official: number };
}

export interface TcgDexSerie extends TcgDexSerieResume {
  sets: TcgDexSetResume[];
}

export interface TcgDexCardResume {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

export interface TcgDexSet extends TcgDexSetResume {
  serie: TcgDexSerieResume;
  tcgOnline?: string;
  releaseDate: string;
  cards: TcgDexCardResume[];
}

export interface TcgDexAttack {
  cost?: string[];
  name: string;
  effect?: string;
  damage?: string | number;
}

export interface TcgDexAbility {
  type: string;
  name: string;
  effect: string;
}

export interface TcgDexWeakRes {
  type: string;
  value?: string;
}

export interface TcgDexCard extends TcgDexCardResume {
  category: string;
  illustrator?: string;
  rarity: string;
  set: TcgDexSetResume & {
    abbreviations?: { official?: string };
    tcgOnline?: string;
  };
  hp?: number;
  types?: string[];
  evolveFrom?: string;
  stage?: string;
  suffix?: string;
  abilities?: TcgDexAbility[];
  attacks?: TcgDexAttack[];
  weaknesses?: TcgDexWeakRes[];
  resistances?: TcgDexWeakRes[];
  retreat?: number;
  effect?: string;
  trainerType?: string;
  energyType?: string;
  regulationMark?: string;
}

export class DataError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'DataError';
  }
}

/** @deprecated Use DataError — kept so existing imports keep working during rename. */
export const TcgDexApiError = DataError;
