export type CardImageSource = 'scrydex' | 'pkmncards';

export type SetImageInfo = {
  id: string;
  source?: CardImageSource;
};

export type CardImageInput = {
  imageUrl?: string;
  set?: string;
  setNumber?: string;
  name?: string;
  fullName?: string;
};

export const setImageMap: Record<string, string | SetImageInfo> = {
  SIT: 'swsh12',
  ASR: 'swsh10',
  LOR: 'swsh11',
  SVI: 'sv1',
  SVE: 'sve',
  PAL: 'sv2',
  OBF: 'sv3',
  MEW: 'sv3pt5',
  PAR: 'sv4',
  PAF: 'sv4pt5',
  TEF: 'sv5',
  TWM: 'sv6',
  SFA: 'sv6pt5',
  SCR: 'sv7',
  SSP: 'sv8',
  PRE: 'sv8pt5',
  JTG: 'sv9',
  DRI: 'sv10',
  BLK: 'zsv10pt5',
  WHT: 'rsv10pt5',
  MEP: { id: 'mep', source: 'scrydex' },
  MEE: { id: 'mee', source: 'pkmncards' },
  MEG: 'me1',
  M1L: 'me1',
  M1S: 'me1',
  PFL: { id: 'me2', source: 'scrydex' },
  ASC: { id: 'me2pt5', source: 'scrydex' },
  POR: { id: 'me3', source: 'scrydex' },
  CRI: { id: 'me4', source: 'scrydex' },
};

export function resolveCardImageUrl(card: CardImageInput): string | undefined {
  if (card.imageUrl) {
    return card.imageUrl;
  }
  if (card.name === 'Unknown' || card.fullName === 'Unknown') {
    return undefined;
  }
  const setInfo = getSetImageInfo(card.set);
  if (!setInfo || !card.setNumber) {
    return undefined;
  }
  const rawSetNumber = String(card.setNumber);
  const setNumber = encodeURIComponent(rawSetNumber);
  if (setInfo.source === 'scrydex') {
    return `https://images.scrydex.com/pokemon/${setInfo.id}-${setNumber}/large`;
  }
  if (setInfo.source === 'pkmncards') {
    const paddedSetNumber = encodeURIComponent(rawSetNumber.padStart(3, '0'));
    return `https://pkmncards.com/wp-content/uploads/${setInfo.id}_en_${paddedSetNumber}_std.png`;
  }
  return `https://images.pokemontcg.io/${setInfo.id}/${setNumber}.png`;
}

export function getSetImageInfo(setCode: string | undefined): SetImageInfo | undefined {
  const info = setCode ? setImageMap[setCode] : undefined;
  if (!info) {
    return undefined;
  }
  return typeof info === 'string' ? { id: info } : info;
}
