"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = exports.SpecialCondition = exports.CardType = exports.Stage = exports.PokemonType = exports.TrainerType = exports.EnergyType = exports.SuperType = exports.CardTag = void 0;
var CardTag;
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
})(CardTag = exports.CardTag || (exports.CardTag = {}));
var SuperType;
(function (SuperType) {
    SuperType[SuperType["NONE"] = 0] = "NONE";
    SuperType[SuperType["POKEMON"] = 1] = "POKEMON";
    SuperType[SuperType["TRAINER"] = 2] = "TRAINER";
    SuperType[SuperType["ENERGY"] = 3] = "ENERGY";
    SuperType[SuperType["ANY"] = 4] = "ANY";
})(SuperType = exports.SuperType || (exports.SuperType = {}));
var EnergyType;
(function (EnergyType) {
    EnergyType[EnergyType["BASIC"] = 0] = "BASIC";
    EnergyType[EnergyType["SPECIAL"] = 1] = "SPECIAL";
})(EnergyType = exports.EnergyType || (exports.EnergyType = {}));
var TrainerType;
(function (TrainerType) {
    TrainerType[TrainerType["ITEM"] = 0] = "ITEM";
    TrainerType[TrainerType["SUPPORTER"] = 1] = "SUPPORTER";
    TrainerType[TrainerType["STADIUM"] = 2] = "STADIUM";
    TrainerType[TrainerType["TOOL"] = 3] = "TOOL";
})(TrainerType = exports.TrainerType || (exports.TrainerType = {}));
var PokemonType;
(function (PokemonType) {
    PokemonType[PokemonType["NORMAL"] = 0] = "NORMAL";
    PokemonType[PokemonType["EX"] = 1] = "EX";
    PokemonType[PokemonType["LEGEND"] = 2] = "LEGEND";
})(PokemonType = exports.PokemonType || (exports.PokemonType = {}));
var Stage;
(function (Stage) {
    Stage[Stage["NONE"] = 0] = "NONE";
    Stage[Stage["RESTORED"] = 1] = "RESTORED";
    Stage[Stage["BASIC"] = 2] = "BASIC";
    Stage[Stage["STAGE_1"] = 3] = "STAGE_1";
    Stage[Stage["STAGE_2"] = 4] = "STAGE_2";
    Stage[Stage["VMAX"] = 5] = "VMAX";
    Stage[Stage["VSTAR"] = 6] = "VSTAR";
})(Stage = exports.Stage || (exports.Stage = {}));
var CardType;
(function (CardType) {
    CardType[CardType["ANY"] = 0] = "ANY";
    CardType[CardType["NONE"] = 1] = "NONE";
    CardType[CardType["COLORLESS"] = 2] = "COLORLESS";
    CardType[CardType["GRASS"] = 3] = "GRASS";
    CardType[CardType["FIGHTING"] = 4] = "FIGHTING";
    CardType[CardType["PSYCHIC"] = 5] = "PSYCHIC";
    CardType[CardType["WATER"] = 6] = "WATER";
    CardType[CardType["LIGHTNING"] = 7] = "LIGHTNING";
    CardType[CardType["METAL"] = 8] = "METAL";
    CardType[CardType["DARK"] = 9] = "DARK";
    CardType[CardType["FIRE"] = 10] = "FIRE";
    CardType[CardType["DRAGON"] = 11] = "DRAGON";
    CardType[CardType["FAIRY"] = 12] = "FAIRY";
})(CardType = exports.CardType || (exports.CardType = {}));
var SpecialCondition;
(function (SpecialCondition) {
    SpecialCondition[SpecialCondition["PARALYZED"] = 0] = "PARALYZED";
    SpecialCondition[SpecialCondition["CONFUSED"] = 1] = "CONFUSED";
    SpecialCondition[SpecialCondition["ASLEEP"] = 2] = "ASLEEP";
    SpecialCondition[SpecialCondition["POISONED"] = 3] = "POISONED";
    SpecialCondition[SpecialCondition["BURNED"] = 4] = "BURNED";
})(SpecialCondition = exports.SpecialCondition || (exports.SpecialCondition = {}));
var Format;
(function (Format) {
    Format[Format["NONE"] = 0] = "NONE";
    Format[Format["STANDARD"] = 1] = "STANDARD";
    Format[Format["EXPANDED"] = 2] = "EXPANDED";
    Format[Format["UNLIMITED"] = 3] = "UNLIMITED";
    Format[Format["RETRO"] = 4] = "RETRO";
})(Format = exports.Format || (exports.Format = {}));
