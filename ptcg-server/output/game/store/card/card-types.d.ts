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
    PLAY_DURING_SETUP = "PLAY_DURING_SETUP",
    DELTA_SPECIES = "DELTA_SPECIES",
    LILLIES = "LILLIES",
    NS = "NS",
    IONOS = "IONOS",
    HOPS = "HOPS",
    MARNIES = "MARNIES",
    STEVENS = "STEVENS"
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
    PIKACHU = "Pikachu",
    RAGING_BOLT = "Raging Bolt",
    GIRATINA = "Giratina",
    PALKIA_ORIGIN = "Palikia",
    COMFEY = "Comfey",
    IRON_THORNS = "Iron Thorns",
    TERAPAGOS = "Terapagos",
    REGIDRAGO = "Regidrago",
    SNORLAX = "Snorlax",
    GARDEVOIR = "Gardevoir",
    ROARING_MOON = "Roaring Moon",
    LUGIA = "Lugia",
    CERULEDGE = "Ceruledge",
    DRAGAPULT = "Dragapult"
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
    CHARIZARD_EX = 13,
    PIDGEOT_EX = 14,
    GIRATINA_VSTAR = 15,
    ARCEUS_VSTAR = 16,
    COMFEY = 17,
    SABLEYE = 18,
    RAGING_BOLT_EX = 19,
    SOLROCK = 20,
    LUNATONE = 21,
    KYUREM_VMAX = 22,
    MURKROW = 23,
    FLAMIGO = 24,
    CHIEN_PAO_EX = 25,
    BAXCALIBUR = 26,
    SNORLAX_STALL = 27,
    LUGIA_VSTAR = 28,
    ABSOL_EX = 29,
    THWACKEY = 30,
    DIPPLIN = 31,
    PALKIA_VSTAR = 32,
    ROTOM_V = 33,
    BIBAREL = 34,
    GHOLDENGO_EX = 35,
    SANDY_SHOCKS_EX = 36,
    GARDEVOIR_EX = 37,
    XATU = 38,
    TEALMASK_OGERPON_EX = 39,
    LUXRAY_EX = 40,
    GRENINJA_EX = 41,
    BLISSEY_EX = 42,
    ROARING_MOON = 43,
    KORAIDON = 44,
    IRON_CROWN_EX = 45,
    CINCCINO = 46,
    ARCHEOPS = 47,
    MIRAIDON_EX = 48,
    IRON_HANDS_EX = 49,
    DRAGAPULT_EX = 50,
    DRIFLOON = 51,
    FROSLASS = 52,
    WLFM = 53,
    GRW = 54,
    LPM = 55,
    FDY = 56,
    GRPD = 57
}
export declare enum SpecialCondition {
    PARALYZED = 0,
    CONFUSED = 1,
    ASLEEP = 2,
    POISONED = 3,
    BURNED = 4,
    ABILITY_USED = 5,
    POWER_GLOW = 6
}
export declare enum BoardEffect {
    ABILITY_USED = 0,
    POWER_GLOW = 1,
    POWER_NEGATED_GLOW = 2,
    POWER_RETURN = 3,
    EVOLVE = 4,
    REVEAL_OPPONENT_HAND = 5
}
export declare enum Format {
    NONE = 0,
    STANDARD = 1,
    EXPANDED = 2,
    UNLIMITED = 3,
    RETRO = 4,
    GLC = 5,
    STANDARD_NIGHTLY = 6
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
