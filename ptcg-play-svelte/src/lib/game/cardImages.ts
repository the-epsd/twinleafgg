type SetImageInfo = {
  id: string;
  source?: 'scrydex';
};

const setImageMap: Record<string, string | SetImageInfo> = {
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
  DRI: 'sv10',
  MEG: 'me1',
  M1L: 'me1',
  M1S: 'me1',
  ASC: { id: 'me2pt5', source: 'scrydex' },
  POR: { id: 'me3', source: 'scrydex' },
};

export function resolveCardImageUrl(card: {
  imageUrl?: string;
  set?: string;
  setNumber?: string;
  name?: string;
  fullName?: string;
}): string | undefined {
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
  const setNumber = encodeURIComponent(card.setNumber);
  if (setInfo.source === 'scrydex') {
    return `https://images.scrydex.com/pokemon/${setInfo.id}-${setNumber}/large`;
  }
  return `https://images.pokemontcg.io/${setInfo.id}/${setNumber}.png`;
}

function getSetImageInfo(setCode: string | undefined): SetImageInfo | undefined {
  const info = setCode ? setImageMap[setCode] : undefined;
  if (!info) {
    return undefined;
  }
  return typeof info === 'string' ? { id: info } : info;
}
