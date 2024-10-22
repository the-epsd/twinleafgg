export declare enum CardTag {
    POKEMON_SP = "SP",
    POKEMON_EX = "EX",
    POKEMON_GX = "GX",
    POKEMON_LV_X = "LV_X",
    POKEMON_V = "V",
    POKEMON_VMAX = "VMAX",
    POKEMON_VSTAR = "VSTAR",
    ACE_SPEC = "ACE_SPEC",
    RADIANT = "RADIANT",
    TEAM_PLASMA = "TEAM_PLASMA",
    FUSION_STRIKE = "FUSION_STRIKE",
    SINGLE_STRIKE = "SINGLE_STRIKE",
    RAPID_STRIKE = "RAPID_STRIKE",
    POKEMON_ex = "ex",
    FUTURE = "Future",
    ANCIENT = "Ancient",
    POKEMON_TERA = "POKEMON_TERA",
    ULTRA_BEAST = "ULTRA_BEAST",
    TAG_TEAM = "TAG_TEAM",
    TEAM_MAGMA = "TEAM_MAGMA",
    PRISM_STAR = "PRISM_STAR",
    BREAK = "BREAK",
    PRIME = "PRIME",
    HOLO = "HOLO",
    LEGEND = "LEGEND",
    TEAM_FLARE = "TEAM_FLARE",
    MEGA = "MEGA",
    PLAY_DURING_SETUP = "PLAY_DURING_SETUP"
}
export declare enum SuperType {
    NONE = 0,
    POKEMON = 1,
    TRAINER = 2,
    ENERGY = 3,
    ANY = 4
}
export declare enum EnergyType {
    BASIC = 0,
    SPECIAL = 1
}
export declare enum TrainerType {
    ITEM = 0,
    SUPPORTER = 1,
    STADIUM = 2,
    TOOL = 3
}
export declare enum PokemonType {
    NORMAL = 0,
    EX = 1,
    LEGEND = 2
}
export declare enum Stage {
    NONE = 0,
    RESTORED = 1,
    BASIC = 2,
    STAGE_1 = 3,
    STAGE_2 = 4,
    VMAX = 5,
    VSTAR = 6,
    MEGA = 7
}
export declare enum Archetype {
    UNOWN = "Unown",
    ARCEUS = "Arceus",
    CHARIZARD = "Charizard",
    PIDGEOT = "Pidgeot",
    MIRAIDON = "Miraidon",
    PIKACHU = "Pikachu"
}
export declare enum CardType {
    ANY = 0,
    GRASS = 1,
    FIRE = 2,
    WATER = 3,
    LIGHTNING = 4,
    PSYCHIC = 5,
    FIGHTING = 6,
    DARK = 7,
    METAL = 8,
    COLORLESS = 9,
    FAIRY = 10,
    DRAGON = 11,
    NONE = 12,
    WLFM = 13,
    GRW = 14,
    LPM = 15,
    FDY = 16,
    GRPD = 17
}
export declare enum SpecialCondition {
    PARALYZED = 0,
    CONFUSED = 1,
    ASLEEP = 2,
    POISONED = 3,
    BURNED = 4,
    ABILITY_USED = 5
}
export declare enum Format {
    NONE = 0,
    STANDARD = 1,
    EXPANDED = 2,
    UNLIMITED = 3,
    RETRO = 4,
    GLC = 5
}
export declare const Energy: {
    readonly D: CardType.DARK;
    readonly C: CardType.COLORLESS;
    readonly F: CardType.FIGHTING;
    readonly G: CardType.GRASS;
    readonly L: CardType.LIGHTNING;
    readonly M: CardType.METAL;
    readonly P: CardType.PSYCHIC;
    readonly R: CardType.FIRE;
    readonly W: CardType.WATER;
    readonly Y: CardType.FAIRY;
    readonly N: CardType.DRAGON;
};
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
