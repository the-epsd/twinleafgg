"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMessage = exports.GameLog = exports.GameCardMessage = exports.GameStoreMessage = exports.GameCoreError = void 0;
var GameCoreError;
(function (GameCoreError) {
    GameCoreError["ERROR_BOT_NOT_FOUND"] = "ERROR_BOT_NOT_FOUND";
    GameCoreError["ERROR_BOT_NOT_INITIALIZED"] = "ERROR_BOT_NOT_INITIALIZED";
    GameCoreError["ERROR_BOT_NO_DECK"] = "ERROR_BOT_NO_DECK";
    GameCoreError["ERROR_CLIENT_NOT_CONNECTED"] = "ERROR_CLIENT_NOT_CONNECTED";
    GameCoreError["ERROR_GAME_NOT_FOUND"] = "ERROR_GAME_NOT_FOUND";
    GameCoreError["ERROR_INVALID_STATE"] = "ERROR_INVALID_STATE";
    GameCoreError["ERROR_SERIALIZER"] = "ERROR_SERIALIZER";
    GameCoreError["ERROR_SIMULATOR_NOT_STABLE"] = "ERROR_SIMULATOR_NOT_STABLE";
    GameCoreError["MUST_BE_IN_ACTIVE_SPOT"] = "MUST_BE_IN_ACTIVE_SPOT";
})(GameCoreError = exports.GameCoreError || (exports.GameCoreError = {}));
var GameStoreMessage;
(function (GameStoreMessage) {
    GameStoreMessage["ACTION_IN_PROGRESS"] = "ACTION_IN_PROGRESS";
    GameStoreMessage["ALREADY_PLAYING"] = "ALREADY_PLAYING";
    GameStoreMessage["BLOCKED_BY_ABILITY"] = "BLOCKED_BY_ABILITY";
    GameStoreMessage["BLOCKED_BY_EFFECT"] = "BLOCKED_BY_EFFECT";
    GameStoreMessage["BLOCKED_BY_SPECIAL_CONDITION"] = "BLOCKED_BY_SPECIAL_CONDITION";
    GameStoreMessage["CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES"] = "CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES";
    GameStoreMessage["CANNOT_RETREAT"] = "CANNOT_RETREAT";
    GameStoreMessage["CANNOT_PLAY_THIS_CARD"] = "CANNOT_PLAY_THIS_CARD";
    GameStoreMessage["CANNOT_USE_POWER"] = "CANNOT_USE_POWER";
    GameStoreMessage["CANNOT_USE_ATTACK"] = "CANNOT_USE_ATTACK";
    GameStoreMessage["CANNOT_ATTACK_ON_FIRST_TURN"] = "CANNOT_ATTACK_ON_FIRST_TURN";
    GameStoreMessage["CANNOT_USE_STADIUM"] = "CANNOT_USE_STADIUM";
    GameStoreMessage["CHOOSE_NEW_ACTIVE_POKEMON"] = "CHOOSE_NEW_ACTIVE_POKEMON";
    GameStoreMessage["CHOOSE_PRIZE_CARD"] = "CHOOSE_PRIZE_CARD";
    GameStoreMessage["CHOOSE_STARTING_POKEMONS"] = "CHOOSE_STARTING_POKEMONS";
    GameStoreMessage["ENERGY_ALREADY_ATTACHED"] = "ENERGY_ALREADY_ATTACHED";
    GameStoreMessage["FLIP_ASLEEP"] = "FLIP_ASLEEP";
    GameStoreMessage["FLIP_BURNED"] = "FLIP_BURNED";
    GameStoreMessage["FLIP_CONFUSION"] = "FLIP_CONFUSION";
    GameStoreMessage["ILLEGAL_ACTION"] = "ILLEGAL_ACTION";
    GameStoreMessage["INVALID_DECK"] = "INVALID_DECK";
    GameStoreMessage["INVALID_GAME_STATE"] = "INVALID_GAME_STATE";
    GameStoreMessage["INVALID_PROMPT_RESULT"] = "INVALID_PROMPT_RESULT";
    GameStoreMessage["INVALID_TARGET"] = "INVALID_TARGET";
    GameStoreMessage["INVITATION_MESSAGE"] = "INVITATION_MESSAGE";
    GameStoreMessage["LEEK_SLAP_CANNOT_BE_USED_AGAIN"] = "LEEK_SLAP_CANNOT_BE_USED_AGAIN";
    GameStoreMessage["MAX_PLAYERS_REACHED"] = "MAX_PLAYERS_REACHED";
    GameStoreMessage["NOT_ENOUGH_ENERGY"] = "NOT_ENOUGH_ENERGY";
    GameStoreMessage["NOT_YOUR_TURN"] = "NOT_YOUR_TURN";
    GameStoreMessage["NO_STADIUM_IN_PLAY"] = "NO_STADIUM_IN_PLAY";
    GameStoreMessage["NO_CARDS_IN_DECK"] = "NO_CARDS_IN_DECK";
    GameStoreMessage["POKEMON_CANT_EVOLVE_THIS_TURN"] = "POKEMON_CANT_EVOLVE_THIS_TURN";
    GameStoreMessage["POKEMON_TOOL_ALREADY_ATTACHED"] = "POKEMON_TOOL_ALREADY_ATTACHED";
    GameStoreMessage["POWER_ALREADY_USED"] = "POWER_ALREADY_USED";
    GameStoreMessage["PROMPT_ALREADY_RESOLVED"] = "PROMPT_ALREADY_RESOLVED";
    GameStoreMessage["RETREAT_ALREADY_USED"] = "RETREAT_ALREADY_USED";
    GameStoreMessage["SAME_STADIUM_ALREADY_IN_PLAY"] = "SAME_STADIUM_ALREADY_IN_PLAY";
    GameStoreMessage["SETUP_OPPONENT_NO_BASIC"] = "SETUP_OPPONENT_NO_BASIC";
    GameStoreMessage["SETUP_PLAYER_NO_BASIC"] = "SETUP_PLAYER_NO_BASIC";
    GameStoreMessage["SETUP_WHO_BEGINS_FLIP"] = "SETUP_WHO_BEGINS_FLIP";
    GameStoreMessage["STADIUM_ALREADY_PLAYED"] = "STADIUM_ALREADY_PLAYED";
    GameStoreMessage["STADIUM_ALREADY_USED"] = "STADIUM_ALREADY_USED";
    GameStoreMessage["SUPPORTER_ALREADY_PLAYED"] = "SUPPORTER_ALREADY_PLAYED";
    GameStoreMessage["UNKNOWN_ATTACK"] = "UNKNOWN_ATTACK";
    GameStoreMessage["UNKNOWN_CARD"] = "UNKNOWN_CARD";
    GameStoreMessage["UNKNOWN_POWER"] = "UNKNOWN_POWER";
    GameStoreMessage["CAN_ONLY_ATTACH_TO_PSYCHIC"] = "CAN_ONLY_ATTACH_TO_PSYCHIC";
})(GameStoreMessage = exports.GameStoreMessage || (exports.GameStoreMessage = {}));
var GameCardMessage;
(function (GameCardMessage) {
    GameCardMessage["HEADS"] = "HEADS";
    GameCardMessage["TAILS"] = "TAILS";
    GameCardMessage["FLIP_COIN"] = "FLIP_COIN";
    GameCardMessage["GO_FIRST"] = "GO_FIRST";
    GameCardMessage["YES"] = "Yes";
    GameCardMessage["NO"] = "No";
    GameCardMessage["UP"] = "UP";
    GameCardMessage["DOWN"] = "DOWN";
    GameCardMessage["ITEMS"] = "ITEMS";
    GameCardMessage["SUPPORTERS"] = "SUPPORTERS";
    GameCardMessage["DISCARD_AND_DRAW"] = "DISCARD_AND_DRAW";
    GameCardMessage["SWITCH_POKEMON"] = "SWITCH_POKEMON";
    GameCardMessage["CHOOSE_OPTION"] = "CHOOSE_OPTION";
    GameCardMessage["CHOOSE_POKEMON"] = "CHOOSE_POKEMON";
    GameCardMessage["CHOOSE_TOOL"] = "CHOOSE_TOOL";
    GameCardMessage["CHOOSE_STADIUM"] = "CHOOSE_STADIUM";
    GameCardMessage["ALL_FIRE_ENERGIES"] = "ALL_FIRE_ENERGIES";
    GameCardMessage["ALL_LIGHTNING_ENERGIES"] = "ALL_LIGHTNING_ENERGIES";
    GameCardMessage["ALL_WATER_ENERGIES"] = "ALL_WATER_ENERGIES";
    GameCardMessage["ATTACH_ENERGY_CARDS"] = "ATTACH_ENERGY_CARDS";
    GameCardMessage["ATTACH_ENERGY_TO_ACTIVE"] = "ATTACH_ENERGY_TO_ACTIVE";
    GameCardMessage["ATTACH_ENERGY_TO_BENCH"] = "ATTACH_ENERGY_TO_BENCH";
    GameCardMessage["CARDS_SHOWED_BY_EFFECT"] = "CARDS_SHOWED_BY_EFFECT";
    GameCardMessage["CARDS_SHOWED_BY_THE_OPPONENT"] = "CARDS_SHOWED_BY_THE_OPPONENT";
    GameCardMessage["CHOOSE_ATTACK_TO_COPY"] = "CHOOSE_ATTACK_TO_COPY";
    GameCardMessage["CHOOSE_ATTACK_TO_DISABLE"] = "CHOOSE_ATTACK_TO_DISABLE";
    GameCardMessage["CHOOSE_CARDS_ORDER"] = "CHOOSE_CARDS_ORDER";
    GameCardMessage["CHOOSE_CARD_TO_ATTACH"] = "CHOOSE_CARD_TO_ATTACH";
    GameCardMessage["CHOOSE_CARD_TO_COPY_EFFECT"] = "CHOOSE_CARD_TO_COPY_EFFECT";
    GameCardMessage["CHOOSE_CARDS_TO_RETURN_TO_PRIZES"] = "CHOOSE_CARDS_TO_RETURN_TO_PRIZES";
    GameCardMessage["CHOOSE_BASIC_POKEMON_TO_BENCH"] = "CHOOSE_BASIC_POKEMON_TO_BENCH";
    GameCardMessage["CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH"] = "CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH";
    GameCardMessage["CHOOSE_CARD_TO_DECK"] = "CHOOSE_CARD_TO_DECK";
    GameCardMessage["CHOOSE_CARD_TO_DISCARD"] = "CHOOSE_CARD_TO_DISCARD";
    GameCardMessage["CHOOSE_CARD_TO_HAND"] = "CHOOSE_CARD_TO_HAND";
    GameCardMessage["CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK"] = "CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK";
    GameCardMessage["CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND"] = "CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND";
    GameCardMessage["CHOOSE_ONE_DARK_POKEMON_AND_ONE_ENERGY_TO_HAND"] = "CHOOSE_ONE_DARK_POKEMON_AND_ONE_ENERGY_TO_HAND";
    GameCardMessage["CHOOSE_ONE_ITEM_AND_ONE_LIGHTNING_ENERGY_TO_HAND"] = "CHOOSE_ONE_ITEM_AND_ONE_LIGHTNING_ENERGY_TO_HAND";
    GameCardMessage["CHOOSE_ONE_POKEMON_AND_ONE_SUPPORTER_TO_HAND"] = "CHOOSE_ONE_POKEMON_AND_ONE_SUPPORTER_TO_HAND";
    GameCardMessage["CHOOSE_CARD_TO_EVOLVE"] = "CHOOSE_CARD_TO_EVOLVE";
    GameCardMessage["CHOOSE_CARD_TO_PUT_ONTO_BENCH"] = "CHOOSE_CARD_TO_PUT_ONTO_BENCH";
    GameCardMessage["CHOOSE_ENERGIES_TO_DISCARD"] = "CHOOSE_ENERGIES_TO_DISCARD";
    GameCardMessage["CHOOSE_ENERGIES_TO_HAND"] = "CHOOSE_ENERGIES_TO_HAND";
    GameCardMessage["CHOOSE_ENERGY_TYPE"] = "CHOOSE_ENERGY_TYPE";
    GameCardMessage["CHOOSE_POKEMON_TO_ATTACH_CARDS"] = "CHOOSE_POKEMON_TO_ATTACH_CARDS";
    GameCardMessage["CHOOSE_POKEMON_TO_DAMAGE"] = "CHOOSE_POKEMON_TO_DAMAGE";
    GameCardMessage["CHOOSE_POKEMON_TO_DISCARD"] = "CHOOSE_POKEMON_TO_DISCARD";
    GameCardMessage["CHOOSE_POKEMON_TO_DISCARD_CARDS"] = "CHOOSE_POKEMON_TO_DISCARD_CARDS";
    GameCardMessage["CHOOSE_POKEMON_TO_EVOLVE"] = "CHOOSE_POKEMON_TO_EVOLVE";
    GameCardMessage["CHOOSE_POKEMON_TO_HEAL"] = "CHOOSE_POKEMON_TO_HEAL";
    GameCardMessage["CHOOSE_POKEMON_TO_PICK_UP"] = "CHOOSE_POKEMON_TO_PICK_UP";
    GameCardMessage["CHOOSE_POKEMON_TO_SWITCH"] = "CHOOSE_POKEMON_TO_SWITCH";
    GameCardMessage["CHOOSE_ENERGY_TO_DISCARD"] = "CHOOSE_ENERGY_TO_DISCARD";
    GameCardMessage["CHOOSE_SPECIAL_CONDITION"] = "CHOOSE_SPECIAL_CONDITION";
    GameCardMessage["COIN_FLIP"] = "COIN_FLIP";
    GameCardMessage["MOVE_DAMAGE"] = "MOVE_DAMAGE";
    GameCardMessage["MOVE_ENERGY_CARDS"] = "MOVE_ENERGY_CARDS";
    GameCardMessage["MOVE_GRASS_ENERGY"] = "MOVE_GRASS_ENERGY";
    GameCardMessage["MOVE_ENERGY_TO_ACTIVE"] = "MOVE_ENERGY_CARDS_TO_ACTIVE";
    GameCardMessage["MOVE_ENERGY_TO_BENCH"] = "MOVE_ENERGY_CARDS_TO_BENCH";
    GameCardMessage["NO_BENCH_SLOTS_AVAILABLE"] = "NO_BENCH_SLOTS_AVAILABLE";
    GameCardMessage["SHUFFLE_AND_DRAW_5_CARDS"] = "SHUFFLE_AND_DRAW_5_CARDS";
    GameCardMessage["SPECIAL_CONDITION_ASLEEP"] = "ASLEEP";
    GameCardMessage["SPECIAL_CONDITION_BURNED"] = "BURNED";
    GameCardMessage["SPECIAL_CONDITION_CONFUSED"] = "CONFUSED";
    GameCardMessage["SPECIAL_CONDITION_PARALYZED"] = "PARALYZED";
    GameCardMessage["SPECIAL_CONDITION_POISONED"] = "POISONED";
    GameCardMessage["WANT_TO_DISCARD_ENERGY"] = "WANT_TO_DISCARD_ENERGY";
    GameCardMessage["WANT_TO_DRAW_CARDS"] = "WANT_TO_DRAW_CARDS";
    GameCardMessage["WANT_TO_HEAL_POKEMON"] = "WANT_TO_HEAL_POKEMON";
    GameCardMessage["WANT_TO_PICK_UP_POKEMON"] = "WANT_TO_PICK_UP_POKEMON";
    GameCardMessage["WANT_TO_PLAY_BOTH_CARDS_AT_ONCE"] = "WANT_TO_PLAY_BOTH_CARDS_AT_ONCE";
    GameCardMessage["WANT_TO_SHUFFLE_POKEMON_INTO_DECK"] = "WANT_TO_SHUFFLE_POKEMON_INTO_DECK";
    GameCardMessage["WANT_TO_SWITCH_POKEMON"] = "WANT_TO_SWITCH_POKEMON";
    GameCardMessage["WANT_TO_USE_ABILITY"] = "WANT_TO_USE_ABILITY";
    GameCardMessage["WANT_TO_USE_BARRAGE"] = "WANT_TO_USE_BARRAGE";
    GameCardMessage["WHICH_DIRECTION_TO_PLACE_STADIUM"] = "WHICH_DIRECTION_TO_PLACE_STADIUM";
    GameCardMessage["CALAMITY_STORM"] = "CALAMITY_STORM";
    GameCardMessage["INCREASE_DAMAGE_BY_30_AGAINST_OPPONENTS_EX_AND_V_POKEMON"] = "INCREASE_DAMAGE_BY_30_AGAINST_OPPONENTS_EX_AND_V_POKEMON";
    GameCardMessage["DISCARD_STADIUM_OR_TOOL"] = "DISCARD_STADIUM_OR_TOOL";
    GameCardMessage["CHOICE_TOOL"] = "CHOICE_TOOL";
    GameCardMessage["CHOICE_SPECIAL_ENERGY"] = "CHOICE_SPECIAL_ENERGY";
    GameCardMessage["CHOICE_STADIUM"] = "CHOICE_STADIUM";
    GameCardMessage["WANT_TO_DISCARD_STADIUM"] = "WANT_TO_DISCARD_STADIUM";
    GameCardMessage["CHOOSE_ITEMS_OR_SUPPORTERS"] = "CHOOSE_ITEMS_OR_SUPPORTERS";
    GameCardMessage["WANT_TO_DRAW_UNTIL_6"] = "WANT_TO_DRAW_UNTIL_6";
    GameCardMessage["WANT_TO_USE_FESTIVAL_FEVER"] = "WANT_TO_USE_FESTIVAL_FEVER";
    GameCardMessage["CANNOT_EVOLVE_ON_YOUR_FIRST_TURN"] = "CANNOT_EVOLVE_ON_YOUR_FIRST_TURN";
    GameCardMessage["WANT_TO_USE_TORRENTIAL_PUMP"] = "WANT_TO_USE_TORRENTIAL_PUMP";
    GameCardMessage["WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY"] = "WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY";
    GameCardMessage["WANT_TO_ATTACH_ONLY_FIRE_ENERGY"] = "WANT_TO_ATTACH_ONLY_FIRE_ENERGY";
    GameCardMessage["WANT_TO_ATTACH_ONLY_WATER_ENERGY"] = "WANT_TO_ATTACH_ONLY_WATER_ENERGY";
    GameCardMessage["WANT_TO_ATTACH_ONE_OF_EACH"] = "WANT_TO_ATTACH_ONE_OF_EACH";
    GameCardMessage["WANT_TO_DISCARD_CARDS"] = "WANT_TO_DISCARD_CARDS";
    GameCardMessage["WANT_TO_ATTACK_AGAIN"] = "WANT_TO_ATTACK_AGAIN";
    GameCardMessage["MULLIGAN_CARDS"] = "MULLIGAN_CARDS";
    GameCardMessage["DRAW"] = "DRAW";
    GameCardMessage["CARD"] = "CARD";
    GameCardMessage["CARDS"] = "CARDS";
    GameCardMessage["TREKKING_SHOES"] = "TREKKING_SHOES";
    GameCardMessage["DISCARD_FROM_TOP_OF_DECK"] = "DISCARD_FROM_TOP_OF_DECK";
    GameCardMessage["CHOOSE_SUPPORTER_FROM_DECK"] = "CHOOSE_SUPPORTER_FROM_DECK";
    GameCardMessage["CHOOSE_SUPPORTER_FROM_DISCARD"] = "CHOOSE_SUPPORTER_FROM_DISCARD";
    GameCardMessage["SHUFFLE_OPPONENT_HAND"] = "SHUFFLE_OPPONENT_HAND";
    GameCardMessage["SHUFFLE_YOUR_HAND"] = "SHUFFLE_YOUR_HAND";
    GameCardMessage["CHOOSE_CARD_TO_SHUFFLE"] = "CHOOSE_CARD_TO_SHUFFLE";
    GameCardMessage["LABEL_GX_USED"] = "LABEL_GX_USED";
    GameCardMessage["LABEL_VSTAR_USED"] = "LABEL_VSTAR_USED";
    GameCardMessage["ORDER_OPPONENT_DECK"] = "ORDER_OPPONENT_DECK";
    GameCardMessage["ORDER_YOUR_DECK"] = "ORDER_YOUR_DECK";
    GameCardMessage["REVEAL_YOUR_TOP_DECK"] = "REVEAL_YOUR_TOP_DECK";
    GameCardMessage["REVEAL_OPPONENT_TOP_DECK"] = "REVEAL_OPPONENT_TOP_DECK";
    GameCardMessage["REVEAL_RANDOM_CARD_IN_OPPONENT_HAND"] = "REVEAL_RANDOM_CARD_IN_OPPONENT_HAND";
    GameCardMessage["REVEAL_AN_OPPONENT_PRIZES"] = "REVEAL_AN_OPPONENT_PRIZES";
    GameCardMessage["REVEAL_ONE_OF_YOUR_PRIZES"] = "REVEAL_ONE_OF_YOUR_PRIZES";
    GameCardMessage["SEARCH_DECK_FOR_CARD"] = "SEARCH_DECK_FOR_CARD";
    GameCardMessage["FAILED_IMPORTS"] = "FAILED_IMPORTS";
    GameCardMessage["CANNOT_MOVE_DAMAGE"] = "CANNOT_MOVE_DAMAGE";
    GameCardMessage["CANNOT_EVOLVE"] = "CANNOT_EVOLVE";
    GameCardMessage["ABILITY_BLOCKED"] = "ABILITY_BLOCKED";
    GameCardMessage["PLAYER_CARDS_REVEALED_BY_EFFECT"] = "PLAYER_CARDS_REVEALED_BY_EFFECT";
    GameCardMessage["CHOOSE_CARDS"] = "CHOOSE_CARDS";
    GameCardMessage["CHOOSE_ENERGY_FROM_DISCARD"] = "CHOOSE_ENERGY_FROM_DISCARD";
    GameCardMessage["CHOOSE_ENERGY_FROM_DECK"] = "CHOOSE_ENERGY_FROM_DECK";
    GameCardMessage["DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY"] = "DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY";
})(GameCardMessage = exports.GameCardMessage || (exports.GameCardMessage = {}));
var GameLog;
(function (GameLog) {
    GameLog["LOG_BANNED_BY_ARBITER"] = "LOG_BANNED_BY_ARBITER";
    GameLog["LOG_ABILITY_BLOCKS_DAMAGE"] = "LOG_ABILITY_BLOCKS_DAMAGE";
    GameLog["LOG_FLIP_ASLEEP"] = "LOG_FLIP_ASLEEP";
    GameLog["LOG_FLIP_CONFUSION"] = "LOG_FLIP_CONFUSION";
    GameLog["LOG_GAME_FINISHED"] = "LOG_GAME_FINISHED";
    GameLog["LOG_GAME_FINISHED_BEFORE_STARTED"] = "LOG_GAME_FINISHED_BEFORE_STARTED";
    GameLog["LOG_GAME_FINISHED_DRAW"] = "LOG_GAME_FINISHED_DRAW";
    GameLog["LOG_GAME_FINISHED_WINNER"] = "LOG_GAME_FINISHED_WINNER";
    GameLog["LOG_HURTS_ITSELF"] = "LOG_HURTS_ITSELF";
    GameLog["LOG_INVITATION_NOT_ACCEPTED"] = "LOG_INVITATION_NOT_ACCEPTED";
    GameLog["LOG_PLAYER_ATTACHES_CARD"] = "LOG_PLAYER_ATTACHES_CARD";
    GameLog["LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD"] = "LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD";
    GameLog["LOG_PLAYER_COPIES_ATTACK"] = "LOG_PLAYER_COPIES_ATTACK";
    GameLog["LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN"] = "LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN";
    GameLog["LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN"] = "LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN";
    GameLog["LOG_PLAYER_DISABLES_ATTACK"] = "LOG_PLAYER_DISABLES_ATTACK";
    GameLog["LOG_PLAYER_DRAWS_CARD"] = "LOG_PLAYER_DRAWS_CARD";
    GameLog["LOG_PLAYER_ENDS_TURN"] = "LOG_PLAYER_ENDS_TURN";
    GameLog["LOG_PLAYER_EVOLVES_POKEMON"] = "LOG_PLAYER_EVOLVES_POKEMON";
    GameLog["LOG_PLAYER_FLIPS_HEADS"] = "LOG_PLAYER_FLIPS_HEADS";
    GameLog["LOG_PLAYER_FLIPS_TAILS"] = "LOG_PLAYER_FLIPS_TAILS";
    GameLog["LOG_PLAYER_LEFT_THE_GAME"] = "LOG_PLAYER_LEFT_THE_GAME";
    GameLog["LOG_PLAYER_HEALS_POKEMON"] = "LOG_PLAYER_HEALS_POKEMON";
    GameLog["LOG_PLAYER_NO_ACTIVE_POKEMON"] = "LOG_PLAYER_NO_ACTIVE_POKEMON";
    GameLog["LOG_PLAYER_NO_CARDS_IN_DECK"] = "LOG_PLAYER_NO_CARDS_IN_DECK";
    GameLog["LOG_PLAYER_NO_PRIZE_CARD"] = "LOG_PLAYER_NO_PRIZE_CARD";
    GameLog["LOG_PLAYER_PLACES_DAMAGE_COUNTERS"] = "LOG_PLAYER_PLACES_DAMAGE_COUNTERS";
    GameLog["LOG_PLAYER_PLAYS_BASIC_POKEMON"] = "LOG_PLAYER_PLAYS_BASIC_POKEMON";
    GameLog["LOG_PLAYER_PLAYS_ITEM"] = "LOG_PLAYER_PLAYS_ITEM";
    GameLog["LOG_PLAYER_PLAYS_STADIUM"] = "LOG_PLAYER_PLAYS_STADIUM";
    GameLog["LOG_PLAYER_PLAYS_SUPPORTER"] = "LOG_PLAYER_PLAYS_SUPPORTER";
    GameLog["LOG_PLAYER_PLAYS_TOOL"] = "LOG_PLAYER_PLAYS_TOOL";
    GameLog["LOG_PLAYER_RETURNS_CARD_TO_HAND"] = "LOG_PLAYER_RETURNS_CARD_TO_HAND";
    GameLog["LOG_PLAYER_RETREATS"] = "LOG_PLAYER_RETREATS";
    GameLog["LOG_PLAYER_SWITCHES_POKEMON_WITH_POKEMON_FROM_DECK"] = "LOG_PLAYER_SWITCHES_POKEMON_WITH_POKEMON_FROM_DECK";
    GameLog["LOG_PLAYER_USES_ABILITY"] = "LOG_PLAYER_USES_ABILITY";
    GameLog["LOG_PLAYER_USES_ATTACK"] = "LOG_PLAYER_USES_ATTACK";
    GameLog["LOG_PLAYER_USES_STADIUM"] = "LOG_PLAYER_USES_STADIUM";
    GameLog["LOG_POKEMON_KO"] = "LOG_POKEMON_KO";
    GameLog["LOG_SETUP_NO_BASIC_POKEMON"] = "LOG_SETUP_NO_BASIC_POKEMON";
    GameLog["LOG_STARTS_BECAUSE_OF_ABILITY"] = "LOG_STARTS_BECAUSE_OF_ABILITY";
    GameLog["LOG_TEXT"] = "LOG_TEXT";
    GameLog["LOG_TIME_ELAPSED"] = "LOG_TIME_ELAPSED";
    GameLog["LOG_TURN"] = "LOG_TURN";
    GameLog["LOG_PLAYER_GUSTS_POKEMON_TO_ACTIVE"] = "LOG_PLAYER_GUSTS_POKEMON_TO_ACTIVE";
    GameLog["LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER"] = "LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER";
    GameLog["LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE"] = "LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE";
    GameLog["LOG_PLAYER_DISCARDS_CARD"] = "LOG_PLAYER_DISCARDS_CARD";
    GameLog["LOG_PLAYER_DISCARDS_CARD_FROM_HAND"] = "LOG_PLAYER_DISCARDS_CARD_FROM_HAND";
    GameLog["LOG_DISCARD_STADIUM_CHAOTIC_SWELL"] = "LOG_DISCARD_STADIUM_CHAOTIC_SWELL";
    GameLog["LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE"] = "LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE";
    GameLog["LOG_PLAYER_PUTS_CARD_IN_HAND"] = "LOG_PLAYER_PUTS_CARD_IN_HAND";
    GameLog["LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK"] = "LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK";
    GameLog["LOG_HISUIAN_HEAVY_BALL"] = "LOG_HISUIAN_HEAVY_BALL";
    GameLog["LOG_SUDDEN_DEATH"] = "LOG_SUDDEN_DEATH";
})(GameLog = exports.GameLog || (exports.GameLog = {}));
// tslint:disable-next-line
exports.GameMessage = Object.assign(Object.assign(Object.assign({}, GameCoreError), GameStoreMessage), GameCardMessage);
