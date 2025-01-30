export var CardTag;
(function (CardTag) {
    CardTag["POKEMON_SP"] = "SP";
    CardTag["POKEMON_EX"] = "EX";
    CardTag["POKEMON_GX"] = "GX";
    CardTag["POKEMON_LV_X"] = "LV_X";
    CardTag["POKEMON_V"] = "V";
    CardTag["POKEMON_VMAX"] = "VMAX";
    CardTag["POKEMON_VSTAR"] = "VSTAR";
    CardTag["ACE_SPEC"] = "ACE_SPEC";
    CardTag["RADIANT"] = "RADIANT";
    CardTag["TEAM_PLASMA"] = "TEAM_PLASMA";
    CardTag["FUSION_STRIKE"] = "FUSION_STRIKE";
    CardTag["SINGLE_STRIKE"] = "SINGLE_STRIKE";
    CardTag["RAPID_STRIKE"] = "RAPID_STRIKE";
    CardTag["POKEMON_ex"] = "ex";
    CardTag["FUTURE"] = "Future";
    CardTag["ANCIENT"] = "Ancient";
    CardTag["POKEMON_TERA"] = "POKEMON_TERA";
    CardTag["ULTRA_BEAST"] = "ULTRA_BEAST";
    CardTag["TAG_TEAM"] = "TAG_TEAM";
    CardTag["TEAM_MAGMA"] = "TEAM_MAGMA";
    CardTag["PRISM_STAR"] = "PRISM_STAR";
    CardTag["BREAK"] = "BREAK";
    CardTag["PRIME"] = "PRIME";
    CardTag["HOLO"] = "HOLO";
    CardTag["LEGEND"] = "LEGEND";
    CardTag["TEAM_FLARE"] = "TEAM_FLARE";
    CardTag["MEGA"] = "MEGA";
    CardTag["PLAY_DURING_SETUP"] = "PLAY_DURING_SETUP";
    CardTag["DELTA_SPECIES"] = "DELTA_SPECIES";
    CardTag["LILLIES"] = "LILLIES";
    CardTag["NS"] = "NS";
    CardTag["IONOS"] = "IONOS";
    CardTag["HOPS"] = "HOPS";
    CardTag["MARNIES"] = "MARNIES";
    CardTag["STEVENS"] = "STEVENS";
})(CardTag || (CardTag = {}));
export var SuperType;
(function (SuperType) {
    SuperType[SuperType["NONE"] = 0] = "NONE";
    SuperType[SuperType["POKEMON"] = 1] = "POKEMON";
    SuperType[SuperType["TRAINER"] = 2] = "TRAINER";
    SuperType[SuperType["ENERGY"] = 3] = "ENERGY";
    SuperType[SuperType["ANY"] = 4] = "ANY";
})(SuperType || (SuperType = {}));
export var EnergyType;
(function (EnergyType) {
    EnergyType[EnergyType["BASIC"] = 0] = "BASIC";
    EnergyType[EnergyType["SPECIAL"] = 1] = "SPECIAL";
})(EnergyType || (EnergyType = {}));
export var TrainerType;
(function (TrainerType) {
    TrainerType[TrainerType["ITEM"] = 0] = "ITEM";
    TrainerType[TrainerType["SUPPORTER"] = 1] = "SUPPORTER";
    TrainerType[TrainerType["STADIUM"] = 2] = "STADIUM";
    TrainerType[TrainerType["TOOL"] = 3] = "TOOL";
})(TrainerType || (TrainerType = {}));
export var PokemonType;
(function (PokemonType) {
    PokemonType[PokemonType["NORMAL"] = 0] = "NORMAL";
    PokemonType[PokemonType["EX"] = 1] = "EX";
    PokemonType[PokemonType["LEGEND"] = 2] = "LEGEND";
})(PokemonType || (PokemonType = {}));
export var Stage;
(function (Stage) {
    Stage[Stage["NONE"] = 0] = "NONE";
    Stage[Stage["RESTORED"] = 1] = "RESTORED";
    Stage[Stage["BASIC"] = 2] = "BASIC";
    Stage[Stage["STAGE_1"] = 3] = "STAGE_1";
    Stage[Stage["STAGE_2"] = 4] = "STAGE_2";
    Stage[Stage["VMAX"] = 5] = "VMAX";
    Stage[Stage["VSTAR"] = 6] = "VSTAR";
    Stage[Stage["MEGA"] = 7] = "MEGA";
})(Stage || (Stage = {}));
export var Archetype;
(function (Archetype) {
    Archetype["UNOWN"] = "Unown";
    Archetype["ARCEUS"] = "Arceus";
    Archetype["CHARIZARD"] = "Charizard";
    Archetype["PIDGEOT"] = "Pidgeot";
    Archetype["MIRAIDON"] = "Miraidon";
    Archetype["PIKACHU"] = "Pikachu";
    Archetype["RAGING_BOLT"] = "Raging Bolt";
    Archetype["GIRATINA"] = "Giratina";
    Archetype["PALKIA_ORIGIN"] = "Palikia";
    Archetype["COMFEY"] = "Comfey";
    Archetype["IRON_THORNS"] = "Iron Thorns";
    Archetype["TERAPAGOS"] = "Terapagos";
    Archetype["REGIDRAGO"] = "Regidrago";
    Archetype["SNORLAX"] = "Snorlax";
    Archetype["GARDEVOIR"] = "Gardevoir";
    Archetype["ROARING_MOON"] = "Roaring Moon";
    Archetype["LUGIA"] = "Lugia";
    Archetype["CERULEDGE"] = "Ceruledge";
    Archetype["DRAGAPULT"] = "Dragapult";
})(Archetype || (Archetype = {}));
export var CardType;
(function (CardType) {
    CardType[CardType["ANY"] = 0] = "ANY";
    CardType[CardType["GRASS"] = 1] = "GRASS";
    CardType[CardType["FIRE"] = 2] = "FIRE";
    CardType[CardType["WATER"] = 3] = "WATER";
    CardType[CardType["LIGHTNING"] = 4] = "LIGHTNING";
    CardType[CardType["PSYCHIC"] = 5] = "PSYCHIC";
    CardType[CardType["FIGHTING"] = 6] = "FIGHTING";
    CardType[CardType["DARK"] = 7] = "DARK";
    CardType[CardType["METAL"] = 8] = "METAL";
    CardType[CardType["COLORLESS"] = 9] = "COLORLESS";
    CardType[CardType["FAIRY"] = 10] = "FAIRY";
    CardType[CardType["DRAGON"] = 11] = "DRAGON";
    CardType[CardType["NONE"] = 12] = "NONE";
    CardType[CardType["CHARIZARD_EX"] = 13] = "CHARIZARD_EX";
    CardType[CardType["PIDGEOT_EX"] = 14] = "PIDGEOT_EX";
    CardType[CardType["GIRATINA_VSTAR"] = 15] = "GIRATINA_VSTAR";
    CardType[CardType["ARCEUS_VSTAR"] = 16] = "ARCEUS_VSTAR";
    CardType[CardType["COMFEY"] = 17] = "COMFEY";
    CardType[CardType["SABLEYE"] = 18] = "SABLEYE";
    CardType[CardType["RAGING_BOLT_EX"] = 19] = "RAGING_BOLT_EX";
    CardType[CardType["SOLROCK"] = 20] = "SOLROCK";
    CardType[CardType["LUNATONE"] = 21] = "LUNATONE";
    CardType[CardType["KYUREM_VMAX"] = 22] = "KYUREM_VMAX";
    CardType[CardType["MURKROW"] = 23] = "MURKROW";
    CardType[CardType["FLAMIGO"] = 24] = "FLAMIGO";
    CardType[CardType["CHIEN_PAO_EX"] = 25] = "CHIEN_PAO_EX";
    CardType[CardType["BAXCALIBUR"] = 26] = "BAXCALIBUR";
    CardType[CardType["SNORLAX_STALL"] = 27] = "SNORLAX_STALL";
    CardType[CardType["LUGIA_VSTAR"] = 28] = "LUGIA_VSTAR";
    CardType[CardType["ABSOL_EX"] = 29] = "ABSOL_EX";
    CardType[CardType["THWACKEY"] = 30] = "THWACKEY";
    CardType[CardType["DIPPLIN"] = 31] = "DIPPLIN";
    CardType[CardType["PALKIA_VSTAR"] = 32] = "PALKIA_VSTAR";
    CardType[CardType["ROTOM_V"] = 33] = "ROTOM_V";
    CardType[CardType["BIBAREL"] = 34] = "BIBAREL";
    CardType[CardType["GHOLDENGO_EX"] = 35] = "GHOLDENGO_EX";
    CardType[CardType["SANDY_SHOCKS_EX"] = 36] = "SANDY_SHOCKS_EX";
    CardType[CardType["GARDEVOIR_EX"] = 37] = "GARDEVOIR_EX";
    CardType[CardType["XATU"] = 38] = "XATU";
    CardType[CardType["TEALMASK_OGERPON_EX"] = 39] = "TEALMASK_OGERPON_EX";
    CardType[CardType["LUXRAY_EX"] = 40] = "LUXRAY_EX";
    CardType[CardType["GRENINJA_EX"] = 41] = "GRENINJA_EX";
    CardType[CardType["BLISSEY_EX"] = 42] = "BLISSEY_EX";
    CardType[CardType["ROARING_MOON"] = 43] = "ROARING_MOON";
    CardType[CardType["KORAIDON"] = 44] = "KORAIDON";
    CardType[CardType["IRON_CROWN_EX"] = 45] = "IRON_CROWN_EX";
    CardType[CardType["CINCCINO"] = 46] = "CINCCINO";
    CardType[CardType["ARCHEOPS"] = 47] = "ARCHEOPS";
    CardType[CardType["MIRAIDON_EX"] = 48] = "MIRAIDON_EX";
    CardType[CardType["IRON_HANDS_EX"] = 49] = "IRON_HANDS_EX";
    CardType[CardType["DRAGAPULT_EX"] = 50] = "DRAGAPULT_EX";
    CardType[CardType["DRIFLOON"] = 51] = "DRIFLOON";
    CardType[CardType["FROSLASS"] = 52] = "FROSLASS";
    CardType[CardType["WLFM"] = 53] = "WLFM";
    CardType[CardType["GRW"] = 54] = "GRW";
    CardType[CardType["LPM"] = 55] = "LPM";
    CardType[CardType["FDY"] = 56] = "FDY";
    CardType[CardType["GRPD"] = 57] = "GRPD";
})(CardType || (CardType = {}));
export var SpecialCondition;
(function (SpecialCondition) {
    SpecialCondition[SpecialCondition["PARALYZED"] = 0] = "PARALYZED";
    SpecialCondition[SpecialCondition["CONFUSED"] = 1] = "CONFUSED";
    SpecialCondition[SpecialCondition["ASLEEP"] = 2] = "ASLEEP";
    SpecialCondition[SpecialCondition["POISONED"] = 3] = "POISONED";
    SpecialCondition[SpecialCondition["BURNED"] = 4] = "BURNED";
    SpecialCondition[SpecialCondition["ABILITY_USED"] = 5] = "ABILITY_USED";
    SpecialCondition[SpecialCondition["POWER_GLOW"] = 6] = "POWER_GLOW";
})(SpecialCondition || (SpecialCondition = {}));
export var BoardEffect;
(function (BoardEffect) {
    BoardEffect[BoardEffect["ABILITY_USED"] = 0] = "ABILITY_USED";
    BoardEffect[BoardEffect["POWER_GLOW"] = 1] = "POWER_GLOW";
    BoardEffect[BoardEffect["POWER_NEGATED_GLOW"] = 2] = "POWER_NEGATED_GLOW";
    BoardEffect[BoardEffect["POWER_RETURN"] = 3] = "POWER_RETURN";
    BoardEffect[BoardEffect["EVOLVE"] = 4] = "EVOLVE";
    BoardEffect[BoardEffect["REVEAL_OPPONENT_HAND"] = 5] = "REVEAL_OPPONENT_HAND";
})(BoardEffect || (BoardEffect = {}));
export var Format;
(function (Format) {
    Format[Format["NONE"] = 0] = "NONE";
    Format[Format["STANDARD"] = 1] = "STANDARD";
    Format[Format["EXPANDED"] = 2] = "EXPANDED";
    Format[Format["UNLIMITED"] = 3] = "UNLIMITED";
    Format[Format["RETRO"] = 4] = "RETRO";
    Format[Format["GLC"] = 5] = "GLC";
    Format[Format["STANDARD_NIGHTLY"] = 6] = "STANDARD_NIGHTLY";
})(Format || (Format = {}));
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
};
Object.entries(Energy).forEach(([key, value]) => {
    global[key] = value;
});
