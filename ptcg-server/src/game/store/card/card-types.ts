
export enum CardTag {
  POKEMON_SP = 'SP',
  POKEMON_EX = 'EX',
  POKEMON_GX = 'GX',
  POKEMON_LV_X = 'LV_X',
  POKEMON_V = 'V',
  POKEMON_VMAX = 'VMAX',
  POKEMON_VSTAR = 'VSTAR',
  ACE_SPEC = 'ACE_SPEC',
  RADIANT = 'RADIANT',
  TEAM_PLASMA = 'TEAM_PLASMA',
  FUSION_STRIKE = 'FUSION_STRIKE',
  SINGLE_STRIKE = 'SINGLE_STRIKE',
  RAPID_STRIKE = 'RAPID_STRIKE',
  POKEMON_ex = 'ex',
  FUTURE = 'Future',
  ANCIENT = 'Ancient',
  POKEMON_TERA = 'POKEMON_TERA',
  ULTRA_BEAST = 'ULTRA_BEAST',
  TAG_TEAM = 'TAG_TEAM',
  TEAM_MAGMA = 'TEAM_MAGMA',
  PRISM_STAR = 'PRISM_STAR',
  BREAK = 'BREAK',
  PRIME = 'PRIME',
  HOLO = 'HOLO',
  LEGEND = 'LEGEND',
  TEAM_FLARE = 'TEAM_FLARE',
  MEGA = 'MEGA',
}

export enum SuperType {
  NONE,
  POKEMON,
  TRAINER,
  ENERGY,
  ANY
}

export enum EnergyType {
  BASIC,
  SPECIAL,
}

export enum TrainerType {
  ITEM,
  SUPPORTER,
  STADIUM,
  TOOL,
}

export enum PokemonType {
  NORMAL,
  EX,
  LEGEND,
}

export enum Stage {
  NONE,
  RESTORED,
  BASIC,
  STAGE_1,
  STAGE_2,
  VMAX,
  VSTAR,
  MEGA,
}

export enum CardType {
  ANY,
  GRASS,
  FIRE,
  WATER,
  LIGHTNING,
  PSYCHIC,
  FIGHTING,
  DARK,
  METAL,
  COLORLESS,
  FAIRY,
  DRAGON,
  NONE,
  CHARIZARD_EX,
  PIDGEOT_EX,
  GIRATINA_VSTAR,
  ARCEUS_VSTAR,
  COMFEY,
  SABLEYE,
  RAGING_BOLT_EX,
  SOLROCK,
  LUNATONE,
  KYUREM_VMAX,
  MURKROW,
  FLAMIGO,
  CHIEN_PAO_EX,
  BAXCALIBUR,
  SNORLAX_STALL,
  LUGIA_VSTAR,
  ABSOL_EX,
  THWACKEY,
  DIPPLIN,
  PALKIA_VSTAR,
  ROTOM_V,
  BIBAREL,
  GHOLDENGO_EX,
  SANDY_SHOCKS_EX,
  GARDEVOIR_EX,
  XATU,
  TEALMASK_OGERPON_EX,
  LUXRAY_EX,
  GRENINJA_EX,
  BLISSEY_EX,
  ROARING_MOON,
  KORAIDON,
  IRON_CROWN_EX,
  CINCCINO,
  ARCHEOPS,
  MIRAIDON_EX,
  IRON_HANDS_EX,
  DRAGAPULT_EX,
  DRIFLOON,
  FROSLASS,
  WLFM,
  GRW,
  LPM,
  FDY,
  GRPD
}

export enum SpecialCondition {
  PARALYZED,
  CONFUSED,
  ASLEEP,
  POISONED,
  BURNED,
  ABILITY_USED
}

export enum Format {
  NONE,
  STANDARD,
  EXPANDED,
  UNLIMITED,
  RETRO,
  GLC
}

export const Energy = {
  D: CardType.DARK,
  C: CardType.COLORLESS,
  F: CardType.FIGHTING,
  G: CardType.GRASS,
  L: CardType.LIGHTNING,
  M: CardType.METAL,
  P: CardType.PSYCHIC,
  R: CardType.FIRE,
  W: CardType.WATER,
  Y: CardType.FAIRY,
  N: CardType.DRAGON
} as const;

Object.entries(Energy).forEach(([key, value]) => {
  (global as any)[key] = value;
});

declare global {
  const D: typeof Energy.D;
  const C: typeof Energy.C;
  const F: typeof Energy.F;
  const G: typeof Energy.G;
  const L: typeof Energy.L;
  const M: typeof Energy.M;
  const P: typeof Energy.P;
  const R: typeof Energy.R;
  const W: typeof Energy.W;
  const Y: typeof Energy.Y;
  const N: typeof Energy.N;
}