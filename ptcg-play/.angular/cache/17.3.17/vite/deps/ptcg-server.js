import "./chunk-BT6DLQRC.js";

// ../ptcg-server/dist/backend/common/errors.js
var ApiErrorEnum;
(function(ApiErrorEnum2) {
  ApiErrorEnum2["AVATAR_INVALID"] = "ERROR_AVATAR_INVALID";
  ApiErrorEnum2["AUTH_TOKEN_INVALID"] = "ERROR_INVALID_TOKEN";
  ApiErrorEnum2["AUTH_INVALID_PERMISSIONS"] = "ERROR_INVALID_PERMISSIONS";
  ApiErrorEnum2["VALIDATION_INVALID_PARAM"] = "ERROR_INVALID_PARAM";
  ApiErrorEnum2["REGISTER_NAME_EXISTS"] = "ERROR_NAME_EXISTS";
  ApiErrorEnum2["REGISTER_EMAIL_EXISTS"] = "ERROR_EMAIL_EXISTS";
  ApiErrorEnum2["REGISTER_DISABLED"] = "ERROR_REGISTER_DISABLED";
  ApiErrorEnum2["REGISTER_INVALID_SERVER_PASSWORD"] = "ERROR_REGISTER_INVALID_SERVER_PASSWORD";
  ApiErrorEnum2["REQUESTS_LIMIT_REACHED"] = "ERROR_REQUESTS_LIMIT_REACHED";
  ApiErrorEnum2["LOGIN_INVALID"] = "ERROR_LOGIN_INVALID";
  ApiErrorEnum2["GAME_INVALID_ID"] = "ERROR_GAME_INVALID_ID";
  ApiErrorEnum2["PROFILE_INVALID"] = "ERROR_PROFILE_INVALID";
  ApiErrorEnum2["DECK_INVALID"] = "ERROR_DECK_INVALID";
  ApiErrorEnum2["NAME_DUPLICATE"] = "ERROR_NAME_DUPLICATE";
  ApiErrorEnum2["PROMPT_INVALID_ID"] = "PROMPT_INVALID_ID";
  ApiErrorEnum2["PROMPT_INVALID_RESULT"] = "PROMPT_INVALID_RESULT";
  ApiErrorEnum2["REPLAY_INVALID"] = "ERROR_REPLAY_INVALID";
  ApiErrorEnum2["CANNOT_SEND_MESSAGE"] = "CANNOT_SEND_MESSAGE";
  ApiErrorEnum2["CANNOT_READ_MESSAGE"] = "CANNOT_READ_MESSAGE";
  ApiErrorEnum2["CONVERSATION_INVALID"] = "CONVERSATION_INVALID";
  ApiErrorEnum2["UNSUPPORTED_VERSION"] = "UNSUPPORTED_VERSION";
  ApiErrorEnum2["SOCKET_ERROR"] = "SOCKET_ERROR";
  ApiErrorEnum2["INVALID_FORMAT"] = "INVALID_FORMAT";
  ApiErrorEnum2["INVALID_USER"] = "INVALID_USER";
  ApiErrorEnum2["USER_BANNED"] = "USER_BANNED";
  ApiErrorEnum2["SERVER_ERROR"] = "SERVER_ERROR";
})(ApiErrorEnum || (ApiErrorEnum = {}));

// ../ptcg-server/dist/backend/interfaces/rank.enum.js
var Rank;
(function(Rank2) {
  Rank2["JUNIOR"] = "JUNIOR";
  Rank2["SENIOR"] = "SENIOR";
  Rank2["ULTRA"] = "ULTRA";
  Rank2["MASTER"] = "MASTER";
  Rank2["ADMIN"] = "ADMIN";
  Rank2["BANNED"] = "BANNED";
  Rank2["POKE"] = "POKE";
  Rank2["GREAT"] = "GREAT";
})(Rank || (Rank = {}));
var rankLevels = [
  { points: -1, rank: Rank.BANNED },
  { points: 0, rank: Rank.POKE },
  { points: 250, rank: Rank.GREAT },
  { points: 1e3, rank: Rank.ULTRA },
  { points: 2500, rank: Rank.MASTER }
];

// ../ptcg-server/dist/utils/utils.js
function deepCompare(x, y) {
  if (x === y) {
    return true;
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (const p in x) {
    if (!Object.prototype.hasOwnProperty.call(x, p)) {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(y, p)) {
      return false;
    }
    if (x[p] === y[p]) {
      continue;
    }
    if (typeof x[p] !== "object") {
      return false;
    }
    if (!deepCompare(x[p], y[p])) {
      return false;
    }
  }
  for (const p in y) {
    if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) {
      return false;
    }
  }
  return true;
}
function deepIterate(source, callback) {
  if (source === null) {
    return;
  }
  if (source instanceof Array) {
    source.forEach((item) => deepIterate(item, callback));
  }
  if (source instanceof Object) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        deepIterate(source[key], callback);
        callback(source, key, source[key]);
      }
    }
  }
}
function deepClone(source, ignores = [], refMap = []) {
  if (source === null) {
    return null;
  }
  if (source instanceof Array) {
    return source.map((item) => deepClone(item, ignores, refMap));
  }
  if (source instanceof Object) {
    if (ignores.some((ignore) => source instanceof ignore)) {
      return source;
    }
    const ref = refMap.find((item) => item.s === source);
    if (ref !== void 0) {
      return ref.d;
    }
    const dest = Object.create(source);
    refMap.push({ s: source, d: dest });
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        dest[key] = deepClone(source[key], ignores, refMap);
      }
    }
    return dest;
  }
  return source;
}
function generateId(array) {
  if (array.length === 0) {
    return 1;
  }
  const last = array[array.length - 1];
  let id = last.id + 1;
  while (array.find((g) => g.id === id)) {
    if (id === Number.MAX_VALUE) {
      id = 0;
    }
    id = id + 1;
  }
  return id;
}

// ../ptcg-server/dist/game/cards/card-manager.js
var CardManager = class _CardManager {
  constructor() {
    this.cards = [];
  }
  static getInstance() {
    if (!_CardManager.instance) {
      _CardManager.instance = new _CardManager();
    }
    return _CardManager.instance;
  }
  defineSet(cards) {
    this.cards.push(...cards);
  }
  defineCard(card) {
    this.cards.push(card);
  }
  getCardByName(name) {
    let card = this.cards.find((c) => c.fullName === name);
    if (card !== void 0) {
      card = deepClone(card);
    }
    return card;
  }
  isCardDefined(name) {
    return this.cards.find((c) => c.fullName === name) !== void 0;
  }
  getAllCards() {
    return this.cards;
  }
};

// ../ptcg-server/dist/game/game-error.js
var GameError = class {
  constructor(code, message) {
    this.message = message || code;
  }
};

// ../ptcg-server/dist/game/game-message.js
var GameCoreError;
(function(GameCoreError2) {
  GameCoreError2["ERROR_BOT_NOT_FOUND"] = "ERROR_BOT_NOT_FOUND";
  GameCoreError2["ERROR_BOT_NOT_INITIALIZED"] = "ERROR_BOT_NOT_INITIALIZED";
  GameCoreError2["ERROR_BOT_NO_DECK"] = "ERROR_BOT_NO_DECK";
  GameCoreError2["ERROR_CLIENT_NOT_CONNECTED"] = "ERROR_CLIENT_NOT_CONNECTED";
  GameCoreError2["ERROR_GAME_NOT_FOUND"] = "ERROR_GAME_NOT_FOUND";
  GameCoreError2["ERROR_INVALID_STATE"] = "ERROR_INVALID_STATE";
  GameCoreError2["ERROR_SERIALIZER"] = "ERROR_SERIALIZER";
  GameCoreError2["ERROR_SIMULATOR_NOT_STABLE"] = "ERROR_SIMULATOR_NOT_STABLE";
  GameCoreError2["MUST_BE_IN_ACTIVE_SPOT"] = "MUST_BE_IN_ACTIVE_SPOT";
})(GameCoreError || (GameCoreError = {}));
var GameStoreMessage;
(function(GameStoreMessage2) {
  GameStoreMessage2["ACTION_IN_PROGRESS"] = "ACTION_IN_PROGRESS";
  GameStoreMessage2["ALREADY_PLAYING"] = "ALREADY_PLAYING";
  GameStoreMessage2["BLOCKED_BY_ABILITY"] = "BLOCKED_BY_ABILITY";
  GameStoreMessage2["BLOCKED_BY_EFFECT"] = "BLOCKED_BY_EFFECT";
  GameStoreMessage2["BLOCKED_BY_SPECIAL_CONDITION"] = "BLOCKED_BY_SPECIAL_CONDITION";
  GameStoreMessage2["CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES"] = "CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES";
  GameStoreMessage2["CANNOT_RETREAT"] = "CANNOT_RETREAT";
  GameStoreMessage2["CANNOT_PLAY_THIS_CARD"] = "CANNOT_PLAY_THIS_CARD";
  GameStoreMessage2["CANNOT_USE_POWER"] = "CANNOT_USE_POWER";
  GameStoreMessage2["CANNOT_USE_ATTACK"] = "CANNOT_USE_ATTACK";
  GameStoreMessage2["CANNOT_ATTACK_ON_FIRST_TURN"] = "CANNOT_ATTACK_ON_FIRST_TURN";
  GameStoreMessage2["CANNOT_USE_STADIUM"] = "CANNOT_USE_STADIUM";
  GameStoreMessage2["CHOOSE_NEW_ACTIVE_POKEMON"] = "CHOOSE_NEW_ACTIVE_POKEMON";
  GameStoreMessage2["CHOOSE_PRIZE_CARD"] = "CHOOSE_PRIZE_CARD";
  GameStoreMessage2["CHOOSE_PRIZE_CARD_TO_DISCARD"] = "CHOOSE_PRIZE_CARD_TO_DISCARD";
  GameStoreMessage2["CHOOSE_STARTING_POKEMONS"] = "CHOOSE_STARTING_POKEMONS";
  GameStoreMessage2["ENERGY_ALREADY_ATTACHED"] = "ENERGY_ALREADY_ATTACHED";
  GameStoreMessage2["FLIP_ASLEEP"] = "FLIP_ASLEEP";
  GameStoreMessage2["FLIP_BURNED"] = "FLIP_BURNED";
  GameStoreMessage2["FLIP_CONFUSION"] = "FLIP_CONFUSION";
  GameStoreMessage2["ILLEGAL_ACTION"] = "ILLEGAL_ACTION";
  GameStoreMessage2["INVALID_DECK"] = "INVALID_DECK";
  GameStoreMessage2["INVALID_GAME_STATE"] = "INVALID_GAME_STATE";
  GameStoreMessage2["INVALID_PROMPT_RESULT"] = "INVALID_PROMPT_RESULT";
  GameStoreMessage2["INVALID_TARGET"] = "INVALID_TARGET";
  GameStoreMessage2["INVITATION_MESSAGE"] = "INVITATION_MESSAGE";
  GameStoreMessage2["LEEK_SLAP_CANNOT_BE_USED_AGAIN"] = "LEEK_SLAP_CANNOT_BE_USED_AGAIN";
  GameStoreMessage2["MAX_PLAYERS_REACHED"] = "MAX_PLAYERS_REACHED";
  GameStoreMessage2["NOT_ENOUGH_ENERGY"] = "NOT_ENOUGH_ENERGY";
  GameStoreMessage2["NOT_YOUR_TURN"] = "NOT_YOUR_TURN";
  GameStoreMessage2["NO_STADIUM_IN_PLAY"] = "NO_STADIUM_IN_PLAY";
  GameStoreMessage2["NO_CARDS_IN_DECK"] = "NO_CARDS_IN_DECK";
  GameStoreMessage2["NO_CARDS_IN_DISCARD"] = "NO_CARDS_IN_DISCARD";
  GameStoreMessage2["POKEMON_CANT_EVOLVE_THIS_TURN"] = "POKEMON_CANT_EVOLVE_THIS_TURN";
  GameStoreMessage2["POKEMON_TOOL_ALREADY_ATTACHED"] = "POKEMON_TOOL_ALREADY_ATTACHED";
  GameStoreMessage2["POWER_ALREADY_USED"] = "POWER_ALREADY_USED";
  GameStoreMessage2["PROMPT_ALREADY_RESOLVED"] = "PROMPT_ALREADY_RESOLVED";
  GameStoreMessage2["RETREAT_ALREADY_USED"] = "RETREAT_ALREADY_USED";
  GameStoreMessage2["SAME_STADIUM_ALREADY_IN_PLAY"] = "SAME_STADIUM_ALREADY_IN_PLAY";
  GameStoreMessage2["SETUP_OPPONENT_NO_BASIC"] = "SETUP_OPPONENT_NO_BASIC";
  GameStoreMessage2["SETUP_PLAYER_NO_BASIC"] = "SETUP_PLAYER_NO_BASIC";
  GameStoreMessage2["SETUP_WHO_BEGINS_FLIP"] = "SETUP_WHO_BEGINS_FLIP";
  GameStoreMessage2["STADIUM_ALREADY_PLAYED"] = "STADIUM_ALREADY_PLAYED";
  GameStoreMessage2["STADIUM_ALREADY_USED"] = "STADIUM_ALREADY_USED";
  GameStoreMessage2["SUPPORTER_ALREADY_PLAYED"] = "SUPPORTER_ALREADY_PLAYED";
  GameStoreMessage2["UNKNOWN_ATTACK"] = "UNKNOWN_ATTACK";
  GameStoreMessage2["UNKNOWN_CARD"] = "UNKNOWN_CARD";
  GameStoreMessage2["UNKNOWN_POWER"] = "UNKNOWN_POWER";
  GameStoreMessage2["CAN_ONLY_ATTACH_TO_PSYCHIC"] = "CAN_ONLY_ATTACH_TO_PSYCHIC";
  GameStoreMessage2["SETUP_CARDS_AVAILABLE"] = "SETUP_CARDS_AVAILABLE";
  GameStoreMessage2["USE_SETUP_CARDS"] = "USE_SETUP_CARDS";
  GameStoreMessage2["MULLIGAN"] = "MULLIGAN";
})(GameStoreMessage || (GameStoreMessage = {}));
var GameCardMessage;
(function(GameCardMessage2) {
  GameCardMessage2["HEADS"] = "HEADS";
  GameCardMessage2["TAILS"] = "TAILS";
  GameCardMessage2["FLIP_COIN"] = "FLIP_COIN";
  GameCardMessage2["GO_FIRST"] = "GO_FIRST";
  GameCardMessage2["YES"] = "Yes";
  GameCardMessage2["NO"] = "No";
  GameCardMessage2["UP"] = "UP";
  GameCardMessage2["DOWN"] = "DOWN";
  GameCardMessage2["ITEMS"] = "ITEMS";
  GameCardMessage2["SUPPORTERS"] = "SUPPORTERS";
  GameCardMessage2["DISCARD_AND_DRAW"] = "DISCARD_AND_DRAW";
  GameCardMessage2["SWITCH_POKEMON"] = "SWITCH_POKEMON";
  GameCardMessage2["CHOOSE_OPTION"] = "CHOOSE_OPTION";
  GameCardMessage2["CHOOSE_POKEMON"] = "CHOOSE_POKEMON";
  GameCardMessage2["CHOOSE_TOOL"] = "CHOOSE_TOOL";
  GameCardMessage2["CHOOSE_STADIUM"] = "CHOOSE_STADIUM";
  GameCardMessage2["ALL_FIRE_ENERGIES"] = "ALL_FIRE_ENERGIES";
  GameCardMessage2["ALL_LIGHTNING_ENERGIES"] = "ALL_LIGHTNING_ENERGIES";
  GameCardMessage2["ALL_WATER_ENERGIES"] = "ALL_WATER_ENERGIES";
  GameCardMessage2["ATTACH_ENERGY_CARDS"] = "ATTACH_ENERGY_CARDS";
  GameCardMessage2["ATTACH_ENERGY_TO_ACTIVE"] = "ATTACH_ENERGY_TO_ACTIVE";
  GameCardMessage2["ATTACH_ENERGY_TO_BENCH"] = "ATTACH_ENERGY_TO_BENCH";
  GameCardMessage2["CARDS_SHOWED_BY_EFFECT"] = "CARDS_SHOWED_BY_EFFECT";
  GameCardMessage2["CARDS_SHOWED_BY_THE_OPPONENT"] = "CARDS_SHOWED_BY_THE_OPPONENT";
  GameCardMessage2["CHOOSE_ATTACK_TO_COPY"] = "CHOOSE_ATTACK_TO_COPY";
  GameCardMessage2["CHOOSE_ATTACK_TO_DISABLE"] = "CHOOSE_ATTACK_TO_DISABLE";
  GameCardMessage2["CHOOSE_CARDS_ORDER"] = "CHOOSE_CARDS_ORDER";
  GameCardMessage2["CHOOSE_CARD_TO_ATTACH"] = "CHOOSE_CARD_TO_ATTACH";
  GameCardMessage2["CHOOSE_CARD_TO_COPY_EFFECT"] = "CHOOSE_CARD_TO_COPY_EFFECT";
  GameCardMessage2["CHOOSE_CARDS_TO_RETURN_TO_PRIZES"] = "CHOOSE_CARDS_TO_RETURN_TO_PRIZES";
  GameCardMessage2["CHOOSE_BASIC_POKEMON_TO_BENCH"] = "CHOOSE_BASIC_POKEMON_TO_BENCH";
  GameCardMessage2["CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH"] = "CHOOSE_OPPONENTS_BASIC_POKEMON_TO_BENCH";
  GameCardMessage2["CHOOSE_CARD_TO_DECK"] = "CHOOSE_CARD_TO_DECK";
  GameCardMessage2["CHOOSE_CARD_TO_DISCARD"] = "CHOOSE_CARD_TO_DISCARD";
  GameCardMessage2["CHOOSE_CARD_TO_HAND"] = "CHOOSE_CARD_TO_HAND";
  GameCardMessage2["CHOOSE_CARD_FROM_DISCARD"] = "CHOOSE_CARD_FROM_DISCARD";
  GameCardMessage2["CHOOSE_CARD_FROM_DECK"] = "CHOOSE_CARD_FROM_DECK";
  GameCardMessage2["CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK"] = "CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK";
  GameCardMessage2["CHOOSE_CARDS_TO_PUT_ON_BOTTOM_OF_THE_DECK"] = "CHOOSE_CARDS_TO_PUT_ON_BOTTOM_OF_THE_DECK";
  GameCardMessage2["CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND"] = "CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND";
  GameCardMessage2["CHOOSE_ONE_DARK_POKEMON_AND_ONE_ENERGY_TO_HAND"] = "CHOOSE_ONE_DARK_POKEMON_AND_ONE_ENERGY_TO_HAND";
  GameCardMessage2["CHOOSE_ONE_ITEM_AND_ONE_LIGHTNING_ENERGY_TO_HAND"] = "CHOOSE_ONE_ITEM_AND_ONE_LIGHTNING_ENERGY_TO_HAND";
  GameCardMessage2["CHOOSE_ONE_POKEMON_AND_ONE_SUPPORTER_TO_HAND"] = "CHOOSE_ONE_POKEMON_AND_ONE_SUPPORTER_TO_HAND";
  GameCardMessage2["CHOOSE_CARD_TO_EVOLVE"] = "CHOOSE_CARD_TO_EVOLVE";
  GameCardMessage2["CHOOSE_CARD_TO_PUT_ONTO_BENCH"] = "CHOOSE_CARD_TO_PUT_ONTO_BENCH";
  GameCardMessage2["CHOOSE_ENERGIES_TO_DISCARD"] = "CHOOSE_ENERGIES_TO_DISCARD";
  GameCardMessage2["CHOOSE_ENERGIES_TO_HAND"] = "CHOOSE_ENERGIES_TO_HAND";
  GameCardMessage2["CHOOSE_ENERGY_TYPE"] = "CHOOSE_ENERGY_TYPE";
  GameCardMessage2["CHOOSE_POKEMON_TO_ATTACH_CARDS"] = "CHOOSE_POKEMON_TO_ATTACH_CARDS";
  GameCardMessage2["CHOOSE_POKEMON_TO_DAMAGE"] = "CHOOSE_POKEMON_TO_DAMAGE";
  GameCardMessage2["CHOOSE_POKEMON_TO_DISCARD"] = "CHOOSE_POKEMON_TO_DISCARD";
  GameCardMessage2["CHOOSE_POKEMON_TO_DISCARD_CARDS"] = "CHOOSE_POKEMON_TO_DISCARD_CARDS";
  GameCardMessage2["CHOOSE_POKEMON_TO_EVOLVE"] = "CHOOSE_POKEMON_TO_EVOLVE";
  GameCardMessage2["CHOOSE_POKEMON_TO_HEAL"] = "CHOOSE_POKEMON_TO_HEAL";
  GameCardMessage2["CHOOSE_POKEMON_TO_PICK_UP"] = "CHOOSE_POKEMON_TO_PICK_UP";
  GameCardMessage2["CHOOSE_POKEMON_TO_SWITCH"] = "CHOOSE_POKEMON_TO_SWITCH";
  GameCardMessage2["CHOOSE_POKEMON_TO_SHUFFLE"] = "CHOOSE_POKEMON_TO_SHUFFLE";
  GameCardMessage2["CHOOSE_ENERGY_TO_DISCARD"] = "CHOOSE_ENERGY_TO_DISCARD";
  GameCardMessage2["CHOOSE_ENERGY_TO_PAY_RETREAT_COST"] = "CHOOSE_ENERGY_TO_PAY_RETREAT_COST";
  GameCardMessage2["CHOOSE_SPECIAL_CONDITION"] = "CHOOSE_SPECIAL_CONDITION";
  GameCardMessage2["COIN_FLIP"] = "COIN_FLIP";
  GameCardMessage2["MOVE_DAMAGE"] = "MOVE_DAMAGE";
  GameCardMessage2["MOVE_ENERGY_CARDS"] = "MOVE_ENERGY_CARDS";
  GameCardMessage2["MOVE_GRASS_ENERGY"] = "MOVE_GRASS_ENERGY";
  GameCardMessage2["MOVE_ENERGY_TO_ACTIVE"] = "MOVE_ENERGY_CARDS_TO_ACTIVE";
  GameCardMessage2["MOVE_ENERGY_TO_BENCH"] = "MOVE_ENERGY_CARDS_TO_BENCH";
  GameCardMessage2["NO_BENCH_SLOTS_AVAILABLE"] = "NO_BENCH_SLOTS_AVAILABLE";
  GameCardMessage2["SPECIAL_CONDITION_ASLEEP"] = "ASLEEP";
  GameCardMessage2["SPECIAL_CONDITION_BURNED"] = "BURNED";
  GameCardMessage2["SPECIAL_CONDITION_CONFUSED"] = "CONFUSED";
  GameCardMessage2["SPECIAL_CONDITION_PARALYZED"] = "PARALYZED";
  GameCardMessage2["SPECIAL_CONDITION_POISONED"] = "POISONED";
  GameCardMessage2["WANT_TO_DISCARD_ENERGY"] = "WANT_TO_DISCARD_ENERGY";
  GameCardMessage2["WANT_TO_DRAW_CARDS"] = "WANT_TO_DRAW_CARDS";
  GameCardMessage2["WANT_TO_DEAL_MORE_DAMAGE"] = "WANT_TO_DEAL_MORE_DAMAGE";
  GameCardMessage2["WANT_TO_HEAL_POKEMON"] = "WANT_TO_HEAL_POKEMON";
  GameCardMessage2["WANT_TO_PICK_UP_POKEMON"] = "WANT_TO_PICK_UP_POKEMON";
  GameCardMessage2["WANT_TO_PLAY_BOTH_CARDS_AT_ONCE"] = "WANT_TO_PLAY_BOTH_CARDS_AT_ONCE";
  GameCardMessage2["WANT_TO_SHUFFLE_POKEMON_INTO_DECK"] = "WANT_TO_SHUFFLE_POKEMON_INTO_DECK";
  GameCardMessage2["SHUFFLE_POKEMON_INTO_DECK"] = "SHUFFLE_POKEMON_INTO_DECK";
  GameCardMessage2["WANT_TO_SWITCH_POKEMON"] = "WANT_TO_SWITCH_POKEMON";
  GameCardMessage2["WANT_TO_USE_ABILITY"] = "WANT_TO_USE_ABILITY";
  GameCardMessage2["WANT_TO_USE_ABILITY_FROM_PRIZES"] = "WANT_TO_USE_ABILITY_FROM_PRIZES";
  GameCardMessage2["WANT_TO_USE_ITEM_FROM_PRIZES"] = "WANT_TO_USE_ITEM_FROM_PRIZES";
  GameCardMessage2["WANT_TO_USE_BARRAGE"] = "WANT_TO_USE_BARRAGE";
  GameCardMessage2["WHICH_DIRECTION_TO_PLACE_STADIUM"] = "WHICH_DIRECTION_TO_PLACE_STADIUM";
  GameCardMessage2["CALAMITY_STORM"] = "CALAMITY_STORM";
  GameCardMessage2["INCREASE_DAMAGE_BY_30_AGAINST_OPPONENTS_EX_AND_V_POKEMON"] = "INCREASE_DAMAGE_BY_30_AGAINST_OPPONENTS_EX_AND_V_POKEMON";
  GameCardMessage2["DISCARD_STADIUM_OR_TOOL"] = "DISCARD_STADIUM_OR_TOOL";
  GameCardMessage2["CHOICE_TOOL"] = "CHOICE_TOOL";
  GameCardMessage2["CHOICE_SPECIAL_ENERGY"] = "CHOICE_SPECIAL_ENERGY";
  GameCardMessage2["CHOICE_STADIUM"] = "CHOICE_STADIUM";
  GameCardMessage2["WANT_TO_DISCARD_STADIUM"] = "WANT_TO_DISCARD_STADIUM";
  GameCardMessage2["CHOOSE_ITEMS_OR_SUPPORTERS"] = "CHOOSE_ITEMS_OR_SUPPORTERS";
  GameCardMessage2["WANT_TO_DRAW_UNTIL_6"] = "WANT_TO_DRAW_UNTIL_6";
  GameCardMessage2["WANT_TO_USE_FESTIVAL_FEVER"] = "WANT_TO_USE_FESTIVAL_FEVER";
  GameCardMessage2["CANNOT_EVOLVE_ON_YOUR_FIRST_TURN"] = "CANNOT_EVOLVE_ON_YOUR_FIRST_TURN";
  GameCardMessage2["WANT_TO_USE_TORRENTIAL_PUMP"] = "WANT_TO_USE_TORRENTIAL_PUMP";
  GameCardMessage2["WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY"] = "WANT_TO_ATTACH_ONLY_FIGHTING_ENERGY";
  GameCardMessage2["WANT_TO_ATTACH_ONLY_FIRE_ENERGY"] = "WANT_TO_ATTACH_ONLY_FIRE_ENERGY";
  GameCardMessage2["WANT_TO_ATTACH_ONLY_WATER_ENERGY"] = "WANT_TO_ATTACH_ONLY_WATER_ENERGY";
  GameCardMessage2["WANT_TO_ATTACH_ONE_OF_EACH"] = "WANT_TO_ATTACH_ONE_OF_EACH";
  GameCardMessage2["WANT_TO_DISCARD_CARDS"] = "WANT_TO_DISCARD_CARDS";
  GameCardMessage2["WANT_TO_ATTACK_AGAIN"] = "WANT_TO_ATTACK_AGAIN";
  GameCardMessage2["MULLIGAN_CARDS"] = "MULLIGAN_CARDS";
  GameCardMessage2["DRAW"] = "DRAW";
  GameCardMessage2["CARD"] = "CARD";
  GameCardMessage2["CARDS"] = "CARDS";
  GameCardMessage2["TREKKING_SHOES"] = "TREKKING_SHOES";
  GameCardMessage2["DISCARD_FROM_TOP_OF_DECK"] = "DISCARD_FROM_TOP_OF_DECK";
  GameCardMessage2["RETURN_TO_TOP_OF_DECK"] = "RETURN_TO_TOP_OF_DECK";
  GameCardMessage2["CHOOSE_SUPPORTER_FROM_DECK"] = "CHOOSE_SUPPORTER_FROM_DECK";
  GameCardMessage2["CHOOSE_SUPPORTER_FROM_DISCARD"] = "CHOOSE_SUPPORTER_FROM_DISCARD";
  GameCardMessage2["SHUFFLE_OPPONENT_HAND"] = "SHUFFLE_OPPONENT_HAND";
  GameCardMessage2["SHUFFLE_YOUR_HAND"] = "SHUFFLE_YOUR_HAND";
  GameCardMessage2["CHOOSE_CARD_TO_SHUFFLE"] = "CHOOSE_CARD_TO_SHUFFLE";
  GameCardMessage2["LABEL_GX_USED"] = "LABEL_GX_USED";
  GameCardMessage2["LABEL_VSTAR_USED"] = "LABEL_VSTAR_USED";
  GameCardMessage2["ORDER_OPPONENT_DECK"] = "ORDER_OPPONENT_DECK";
  GameCardMessage2["ORDER_YOUR_DECK"] = "ORDER_YOUR_DECK";
  GameCardMessage2["REVEAL_YOUR_TOP_DECK"] = "REVEAL_YOUR_TOP_DECK";
  GameCardMessage2["REVEAL_OPPONENT_TOP_DECK"] = "REVEAL_OPPONENT_TOP_DECK";
  GameCardMessage2["REVEAL_RANDOM_CARD_IN_OPPONENT_HAND"] = "REVEAL_RANDOM_CARD_IN_OPPONENT_HAND";
  GameCardMessage2["REVEAL_AN_OPPONENT_PRIZES"] = "REVEAL_AN_OPPONENT_PRIZES";
  GameCardMessage2["REVEAL_ONE_OF_YOUR_PRIZES"] = "REVEAL_ONE_OF_YOUR_PRIZES";
  GameCardMessage2["SEARCH_DECK_FOR_CARD"] = "SEARCH_DECK_FOR_CARD";
  GameCardMessage2["FAILED_IMPORTS"] = "FAILED_IMPORTS";
  GameCardMessage2["CANNOT_MOVE_DAMAGE"] = "CANNOT_MOVE_DAMAGE";
  GameCardMessage2["CANNOT_EVOLVE"] = "CANNOT_EVOLVE";
  GameCardMessage2["ABILITY_BLOCKED"] = "ABILITY_BLOCKED";
  GameCardMessage2["PLAYER_CARDS_REVEALED_BY_EFFECT"] = "PLAYER_CARDS_REVEALED_BY_EFFECT";
  GameCardMessage2["CHOOSE_CARDS"] = "CHOOSE_CARDS";
  GameCardMessage2["CHOOSE_ENERGY_FROM_DISCARD"] = "CHOOSE_ENERGY_FROM_DISCARD";
  GameCardMessage2["CHOOSE_ENERGY_FROM_DECK"] = "CHOOSE_ENERGY_FROM_DECK";
  GameCardMessage2["DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY"] = "DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY";
  GameCardMessage2["CHOOSE_CARD_TO_PUT_ON_BOTTOM"] = "CHOOSE_CARD_TO_PUT_ON_BOTTOM";
  GameCardMessage2["FORMAT_ALL"] = "FORMAT_ALL";
  GameCardMessage2["FORMAT_STANDARD"] = "FORMAT_STANDARD";
  GameCardMessage2["FORMAT_STANDARD_NIGHTLY"] = "FORMAT_STANDARD_NIGHTLY";
  GameCardMessage2["FORMAT_EXPANDED"] = "FORMAT_EXPANDED";
  GameCardMessage2["FORMAT_UNLIMITED"] = "FORMAT_UNLIMITED";
  GameCardMessage2["FORMAT_RETRO"] = "FORMAT_RETRO";
  GameCardMessage2["FORMAT_GLC"] = "FORMAT_GLC";
})(GameCardMessage || (GameCardMessage = {}));
var GameLog;
(function(GameLog2) {
  GameLog2["LOG_BANNED_BY_ARBITER"] = "LOG_BANNED_BY_ARBITER";
  GameLog2["LOG_ABILITY_BLOCKS_DAMAGE"] = "LOG_ABILITY_BLOCKS_DAMAGE";
  GameLog2["LOG_FLIP_ASLEEP"] = "LOG_FLIP_ASLEEP";
  GameLog2["LOG_FLIP_CONFUSION"] = "LOG_FLIP_CONFUSION";
  GameLog2["LOG_GAME_FINISHED"] = "LOG_GAME_FINISHED";
  GameLog2["LOG_GAME_FINISHED_BEFORE_STARTED"] = "LOG_GAME_FINISHED_BEFORE_STARTED";
  GameLog2["LOG_GAME_FINISHED_DRAW"] = "LOG_GAME_FINISHED_DRAW";
  GameLog2["LOG_GAME_FINISHED_WINNER"] = "LOG_GAME_FINISHED_WINNER";
  GameLog2["LOG_HURTS_ITSELF"] = "LOG_HURTS_ITSELF";
  GameLog2["LOG_INVITATION_NOT_ACCEPTED"] = "LOG_INVITATION_NOT_ACCEPTED";
  GameLog2["LOG_PLAYER_ATTACHES_CARD"] = "LOG_PLAYER_ATTACHES_CARD";
  GameLog2["LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD"] = "LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD";
  GameLog2["LOG_PLAYER_COPIES_ATTACK"] = "LOG_PLAYER_COPIES_ATTACK";
  GameLog2["LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN"] = "LOG_PLAYER_DISABLES_ITEMS_UNTIL_END_OF_NEXT_TURN";
  GameLog2["LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN"] = "LOG_PLAYER_DISABLES_SUPPORTERS_UNTIL_END_OF_NEXT_TURN";
  GameLog2["LOG_PLAYER_DISABLES_ATTACK"] = "LOG_PLAYER_DISABLES_ATTACK";
  GameLog2["LOG_PLAYER_DRAWS_CARD"] = "LOG_PLAYER_DRAWS_CARD";
  GameLog2["LOG_PLAYER_ENDS_TURN"] = "LOG_PLAYER_ENDS_TURN";
  GameLog2["LOG_PLAYER_EVOLVES_POKEMON"] = "LOG_PLAYER_EVOLVES_POKEMON";
  GameLog2["LOG_PLAYER_TRANSFORMS_INTO_POKEMON"] = "LOG_PLAYER_TRANSFORMS_INTO_POKEMON";
  GameLog2["LOG_PLAYER_FLIPS_HEADS"] = "LOG_PLAYER_FLIPS_HEADS";
  GameLog2["LOG_PLAYER_FLIPS_TAILS"] = "LOG_PLAYER_FLIPS_TAILS";
  GameLog2["LOG_PLAYER_LEFT_THE_GAME"] = "LOG_PLAYER_LEFT_THE_GAME";
  GameLog2["LOG_PLAYER_HEALS_POKEMON"] = "LOG_PLAYER_HEALS_POKEMON";
  GameLog2["LOG_PLAYER_NO_ACTIVE_POKEMON"] = "LOG_PLAYER_NO_ACTIVE_POKEMON";
  GameLog2["LOG_PLAYER_NO_CARDS_IN_DECK"] = "LOG_PLAYER_NO_CARDS_IN_DECK";
  GameLog2["LOG_PLAYER_NO_PRIZE_CARD"] = "LOG_PLAYER_NO_PRIZE_CARD";
  GameLog2["LOG_PLAYER_DEALS_DAMAGE"] = "LOG_PLAYER_DEALS_DAMAGE";
  GameLog2["LOG_PLAYER_PLACES_DAMAGE_COUNTERS"] = "LOG_PLAYER_PLACES_DAMAGE_COUNTERS";
  GameLog2["LOG_PLAYER_PLAYS_BASIC_POKEMON"] = "LOG_PLAYER_PLAYS_BASIC_POKEMON";
  GameLog2["LOG_PLAYER_PLAYS_ITEM"] = "LOG_PLAYER_PLAYS_ITEM";
  GameLog2["LOG_PLAYER_PLAYS_STADIUM"] = "LOG_PLAYER_PLAYS_STADIUM";
  GameLog2["LOG_PLAYER_PLAYS_SUPPORTER"] = "LOG_PLAYER_PLAYS_SUPPORTER";
  GameLog2["LOG_PLAYER_PLAYS_TOOL"] = "LOG_PLAYER_PLAYS_TOOL";
  GameLog2["LOG_PLAYER_RETURNS_CARD_TO_HAND"] = "LOG_PLAYER_RETURNS_CARD_TO_HAND";
  GameLog2["LOG_PLAYER_RETREATS"] = "LOG_PLAYER_RETREATS";
  GameLog2["LOG_PLAYER_SWITCHES_POKEMON_WITH_POKEMON_FROM_DECK"] = "LOG_PLAYER_SWITCHES_POKEMON_WITH_POKEMON_FROM_DECK";
  GameLog2["LOG_PLAYER_USES_ABILITY"] = "LOG_PLAYER_USES_ABILITY";
  GameLog2["LOG_PLAYER_USES_ATTACK"] = "LOG_PLAYER_USES_ATTACK";
  GameLog2["LOG_PLAYER_USES_STADIUM"] = "LOG_PLAYER_USES_STADIUM";
  GameLog2["LOG_POKEMON_KO"] = "LOG_POKEMON_KO";
  GameLog2["LOG_SETUP_NO_BASIC_POKEMON"] = "LOG_SETUP_NO_BASIC_POKEMON";
  GameLog2["LOG_STARTS_BECAUSE_OF_ABILITY"] = "LOG_STARTS_BECAUSE_OF_ABILITY";
  GameLog2["LOG_TEXT"] = "LOG_TEXT";
  GameLog2["LOG_TIME_ELAPSED"] = "LOG_TIME_ELAPSED";
  GameLog2["LOG_TURN"] = "LOG_TURN";
  GameLog2["LOG_PLAYER_GUSTS_POKEMON_TO_ACTIVE"] = "LOG_PLAYER_GUSTS_POKEMON_TO_ACTIVE";
  GameLog2["LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER"] = "LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER";
  GameLog2["LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE"] = "LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE";
  GameLog2["LOG_PLAYER_DISCARDS_CARD"] = "LOG_PLAYER_DISCARDS_CARD";
  GameLog2["LOG_PLAYER_DISCARDS_CARD_FROM_HAND"] = "LOG_PLAYER_DISCARDS_CARD_FROM_HAND";
  GameLog2["LOG_DISCARD_STADIUM_CHAOTIC_SWELL"] = "LOG_DISCARD_STADIUM_CHAOTIC_SWELL";
  GameLog2["LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE"] = "LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE";
  GameLog2["LOG_PLAYER_PUTS_CARD_IN_HAND"] = "LOG_PLAYER_PUTS_CARD_IN_HAND";
  GameLog2["LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK"] = "LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK";
  GameLog2["LOG_HISUIAN_HEAVY_BALL"] = "LOG_HISUIAN_HEAVY_BALL";
  GameLog2["LOG_SUDDEN_DEATH"] = "LOG_SUDDEN_DEATH";
  GameLog2["LOG_PLAYER_CHOOSES"] = "LOG_PLAYER_CHOOSES";
  GameLog2["LOG_CARD_MOVED"] = "LOG_CARD_MOVED";
  GameLog2["LOG_SHUFFLE_POKEMON_INTO_DECK"] = "SHUFFLE_POKEMON_INTO_DECK";
})(GameLog || (GameLog = {}));
var GameMessage = Object.assign(Object.assign(Object.assign({}, GameCoreError), GameStoreMessage), GameCardMessage);

// ../ptcg-server/dist/game/store/card/card-types.js
var CardTag;
(function(CardTag2) {
  CardTag2["POKEMON_SP"] = "SP";
  CardTag2["POKEMON_EX"] = "EX";
  CardTag2["POKEMON_GX"] = "GX";
  CardTag2["POKEMON_LV_X"] = "LV_X";
  CardTag2["POKEMON_V"] = "V";
  CardTag2["POKEMON_VMAX"] = "VMAX";
  CardTag2["POKEMON_VSTAR"] = "VSTAR";
  CardTag2["POKEMON_VUNION"] = "VUNION";
  CardTag2["ACE_SPEC"] = "ACE_SPEC";
  CardTag2["RADIANT"] = "RADIANT";
  CardTag2["ROCKETS_SECRET_MACHINE"] = "ROCKETS_SECRET_MACHINE";
  CardTag2["TEAM_PLASMA"] = "TEAM_PLASMA";
  CardTag2["FUSION_STRIKE"] = "FUSION_STRIKE";
  CardTag2["SINGLE_STRIKE"] = "SINGLE_STRIKE";
  CardTag2["RAPID_STRIKE"] = "RAPID_STRIKE";
  CardTag2["POKEMON_ex"] = "ex";
  CardTag2["FUTURE"] = "Future";
  CardTag2["ANCIENT"] = "Ancient";
  CardTag2["POKEMON_TERA"] = "POKEMON_TERA";
  CardTag2["ULTRA_BEAST"] = "ULTRA_BEAST";
  CardTag2["TAG_TEAM"] = "TAG_TEAM";
  CardTag2["TEAM_MAGMA"] = "TEAM_MAGMA";
  CardTag2["PRISM_STAR"] = "PRISM_STAR";
  CardTag2["STAR"] = "STAR";
  CardTag2["BREAK"] = "BREAK";
  CardTag2["PRIME"] = "PRIME";
  CardTag2["HOLO"] = "HOLO";
  CardTag2["LEGEND"] = "LEGEND";
  CardTag2["DUAL_LEGEND"] = "DUAL_LEGEND";
  CardTag2["TEAM_FLARE"] = "TEAM_FLARE";
  CardTag2["MEGA"] = "MEGA";
  CardTag2["PLAY_DURING_SETUP"] = "PLAY_DURING_SETUP";
  CardTag2["DELTA_SPECIES"] = "DELTA_SPECIES";
  CardTag2["DARK"] = "DARK";
  CardTag2["LILLIES"] = "LILLIES";
  CardTag2["NS"] = "NS";
  CardTag2["IONOS"] = "IONOS";
  CardTag2["HOPS"] = "HOPS";
  CardTag2["MARNIES"] = "MARNIES";
  CardTag2["STEVENS"] = "STEVENS";
  CardTag2["ETHANS"] = "ETHANS";
  CardTag2["MISTYS"] = "MISTYS";
  CardTag2["CYNTHIAS"] = "CYNTHIAS";
  CardTag2["ARVENS"] = "ARVENS";
  CardTag2["POKEMON_SV_MEGA"] = "POKEMON_SV_MEGA";
  CardTag2["HOLONS"] = "HOLONS";
  CardTag2["TEAM_ROCKET"] = "TEAM_ROCKET";
  CardTag2["UNOWN"] = "UNOWN";
  CardTag2["PRIMAL"] = "PRIMAL";
  CardTag2["ARCEUS"] = "ARCEUS";
})(CardTag || (CardTag = {}));
var SuperType;
(function(SuperType2) {
  SuperType2[SuperType2["NONE"] = 0] = "NONE";
  SuperType2[SuperType2["POKEMON"] = 1] = "POKEMON";
  SuperType2[SuperType2["TRAINER"] = 2] = "TRAINER";
  SuperType2[SuperType2["ENERGY"] = 3] = "ENERGY";
  SuperType2[SuperType2["ANY"] = 4] = "ANY";
})(SuperType || (SuperType = {}));
var EnergyType;
(function(EnergyType2) {
  EnergyType2[EnergyType2["BASIC"] = 0] = "BASIC";
  EnergyType2[EnergyType2["SPECIAL"] = 1] = "SPECIAL";
})(EnergyType || (EnergyType = {}));
var TrainerType;
(function(TrainerType2) {
  TrainerType2[TrainerType2["ITEM"] = 0] = "ITEM";
  TrainerType2[TrainerType2["SUPPORTER"] = 1] = "SUPPORTER";
  TrainerType2[TrainerType2["STADIUM"] = 2] = "STADIUM";
  TrainerType2[TrainerType2["TOOL"] = 3] = "TOOL";
})(TrainerType || (TrainerType = {}));
var PokemonType;
(function(PokemonType2) {
  PokemonType2[PokemonType2["NORMAL"] = 0] = "NORMAL";
  PokemonType2[PokemonType2["EX"] = 1] = "EX";
  PokemonType2[PokemonType2["LEGEND"] = 2] = "LEGEND";
})(PokemonType || (PokemonType = {}));
var Stage;
(function(Stage2) {
  Stage2[Stage2["NONE"] = 0] = "NONE";
  Stage2[Stage2["RESTORED"] = 1] = "RESTORED";
  Stage2[Stage2["BASIC"] = 2] = "BASIC";
  Stage2[Stage2["STAGE_1"] = 3] = "STAGE_1";
  Stage2[Stage2["STAGE_2"] = 4] = "STAGE_2";
  Stage2[Stage2["VMAX"] = 5] = "VMAX";
  Stage2[Stage2["VSTAR"] = 6] = "VSTAR";
  Stage2[Stage2["VUNION"] = 7] = "VUNION";
  Stage2[Stage2["LEGEND"] = 8] = "LEGEND";
  Stage2[Stage2["MEGA"] = 9] = "MEGA";
  Stage2[Stage2["BREAK"] = 10] = "BREAK";
  Stage2[Stage2["LV_X"] = 11] = "LV_X";
})(Stage || (Stage = {}));
var Archetype;
(function(Archetype2) {
  Archetype2["PALKIA_ORIGIN"] = "Palkia Origin";
  Archetype2["COMFEY"] = "Comfey";
  Archetype2["IRON_THORNS"] = "Iron Thorns";
  Archetype2["SNORLAX"] = "Snorlax";
  Archetype2["CERULEDGE"] = "Ceruledge";
  Archetype2["KLAWF"] = "Klawf";
  Archetype2["FERALIGATR"] = "Feraligatr";
  Archetype2["BLISSEY"] = "Blissey";
  Archetype2["MILOTIC"] = "Milotic";
  Archetype2["ZOROARK"] = "Zoroark";
  Archetype2["BELLIBOLT"] = "Bellibolt";
  Archetype2["FLAREON"] = "Flareon";
  Archetype2["MAMOSWINE"] = "Mamoswine";
  Archetype2["ZACIAN"] = "Zacian";
  Archetype2["FROSLASS"] = "Froslass";
  Archetype2["ROTOM"] = "Rotom";
  Archetype2["HOOH"] = "Ho-oh";
  Archetype2["HYDREIGON"] = "Hydreigon";
  Archetype2["MEGA_GARDEVOIR"] = "Mega Gardevoir";
  Archetype2["BULBASAUR"] = "Bulbasaur";
  Archetype2["IVYSAUR"] = "Ivysaur";
  Archetype2["VENUSAUR"] = "Venusaur";
  Archetype2["MEGA_VENUSAUR"] = "Mega Venusaur";
  Archetype2["CHARMANDER"] = "Charmander";
  Archetype2["CHARMELEON"] = "Charmeleon";
  Archetype2["CHARIZARD"] = "Charizard";
  Archetype2["MEGA_CHARIZARD_X"] = "Mega Charizard X";
  Archetype2["MEGA_CHARIZARD_Y"] = "Mega Charizard Y";
  Archetype2["SQUIRTLE"] = "Squirtle";
  Archetype2["WARTORTLE"] = "Wartortle";
  Archetype2["BLASTOISE"] = "Blastoise";
  Archetype2["MEGA_BLASTOISE"] = "Mega Blastoise";
  Archetype2["CATERPIE"] = "Caterpie";
  Archetype2["METAPOD"] = "Metapod";
  Archetype2["BUTTERFREE"] = "Butterfree";
  Archetype2["WEEDLE"] = "Weedle";
  Archetype2["KAKUNA"] = "Kakuna";
  Archetype2["BEEDRILL"] = "Beedrill";
  Archetype2["MEGA_BEEDRILL"] = "Mega Beedrill";
  Archetype2["PIDGEY"] = "Pidgey";
  Archetype2["PIDGEOTTO"] = "Pidgeotto";
  Archetype2["PIDGEOT"] = "Pidgeot";
  Archetype2["MEGA_PIDGEOT"] = "Mega Pidgeot";
  Archetype2["RATTATA"] = "Rattata";
  Archetype2["ALOLAN_RATTATA"] = "Alolan Rattata";
  Archetype2["RATICATE"] = "Raticate";
  Archetype2["ALOLAN_RATICATE"] = "Alolan Raticate";
  Archetype2["SPEAROW"] = "Spearow";
  Archetype2["FEAROW"] = "Fearow";
  Archetype2["EKANS"] = "Ekans";
  Archetype2["ARBOK"] = "Arbok";
  Archetype2["PIKACHU"] = "Pikachu";
  Archetype2["RAICHU"] = "Raichu";
  Archetype2["ALOLAN_RAICHU"] = "Alolan Raichu";
  Archetype2["SANDSHREW"] = "Sandshrew";
  Archetype2["ALOLAN_SANDSHREW"] = "Alolan Sandshrew";
  Archetype2["SANDSLASH"] = "Sandslash";
  Archetype2["ALOLAN_SANDSLASH"] = "Alolan Sandslash";
  Archetype2["NIDORAN_F"] = "Nidoran♀";
  Archetype2["NIDORINA"] = "Nidorina";
  Archetype2["NIDOQUEEN"] = "Nidoqueen";
  Archetype2["NIDORAN_M"] = "Nidoran♂";
  Archetype2["NIDORINO"] = "Nidorino";
  Archetype2["NIDOKING"] = "Nidoking";
  Archetype2["CLEFAIRY"] = "Clefairy";
  Archetype2["CLEFABLE"] = "Clefable";
  Archetype2["VULPIX"] = "Vulpix";
  Archetype2["ALOLAN_VULPIX"] = "Alolan Vulpix";
  Archetype2["NINETALES"] = "Ninetales";
  Archetype2["ALOLAN_NINETALES"] = "Alolan Ninetales";
  Archetype2["JIGGLYPUFF"] = "Jigglypuff";
  Archetype2["WIGGLYTUFF"] = "Wigglytuff";
  Archetype2["ZUBAT"] = "Zubat";
  Archetype2["GOLBAT"] = "Golbat";
  Archetype2["ODDISH"] = "Oddish";
  Archetype2["GLOOM"] = "Gloom";
  Archetype2["VILEPLUME"] = "Vileplume";
  Archetype2["PARAS"] = "Paras";
  Archetype2["PARASECT"] = "Parasect";
  Archetype2["VENONAT"] = "Venonat";
  Archetype2["VENOMOTH"] = "Venomoth";
  Archetype2["DIGLETT"] = "Diglett";
  Archetype2["ALOLAN_DIGLETT"] = "Alolan Diglett";
  Archetype2["DUGTRIO"] = "Dugtrio";
  Archetype2["ALOLAN_DUGTRIO"] = "Alolan Dugtrio";
  Archetype2["MEOWTH"] = "Meowth";
  Archetype2["ALOLAN_MEOWTH"] = "Alolan Meowth";
  Archetype2["GALARIAN_MEOWTH"] = "Galarian Meowth";
  Archetype2["PERSIAN"] = "Persian";
  Archetype2["ALOLAN_PERSIAN"] = "Alolan Persian";
  Archetype2["PSYDUCK"] = "Psyduck";
  Archetype2["GOLDUCK"] = "Golduck";
  Archetype2["MANKEY"] = "Mankey";
  Archetype2["PRIMEAPE"] = "Primeape";
  Archetype2["GROWLITHE"] = "Growlithe";
  Archetype2["HISUIAN_GROWLITHE"] = "Hisuian Growlithe";
  Archetype2["ARCANINE"] = "Arcanine";
  Archetype2["HISUIAN_ARCANINE"] = "Hisuian Arcanine";
  Archetype2["POLIWAG"] = "Poliwag";
  Archetype2["POLIWHIRL"] = "Poliwhirl";
  Archetype2["POLIWRATH"] = "Poliwrath";
  Archetype2["ABRA"] = "Abra";
  Archetype2["KADABRA"] = "Kadabra";
  Archetype2["ALAKAZAM"] = "Alakazam";
  Archetype2["MEGA_ALAKAZAM"] = "Mega Alakazam";
  Archetype2["MACHOP"] = "Machop";
  Archetype2["MACHOKE"] = "Machoke";
  Archetype2["MACHAMP"] = "Machamp";
  Archetype2["BELLSPROUT"] = "Bellsprout";
  Archetype2["WEEPINBELL"] = "Weepinbell";
  Archetype2["VICTREEBEL"] = "Victreebel";
  Archetype2["TENTACOOL"] = "Tentacool";
  Archetype2["TENTACRUEL"] = "Tentacruel";
  Archetype2["GEODUDE"] = "Geodude";
  Archetype2["ALOLAN_GEODUDE"] = "Alolan Geodude";
  Archetype2["GRAVELER"] = "Graveler";
  Archetype2["ALOLAN_GRAVELER"] = "Alolan Graveler";
  Archetype2["GOLEM"] = "Golem";
  Archetype2["ALOLAN_GOLEM"] = "Alolan Golem";
  Archetype2["PONYTA"] = "Ponyta";
  Archetype2["GALARIAN_PONYTA"] = "Galarian Ponyta";
  Archetype2["RAPIDASH"] = "Rapidash";
  Archetype2["GALARIAN_RAPIDASH"] = "Galarian Rapidash";
  Archetype2["SLOWPOKE"] = "Slowpoke";
  Archetype2["GALARIAN_SLOWPOKE"] = "Galarian Slowpoke";
  Archetype2["SLOWBRO"] = "Slowbro";
  Archetype2["MEGA_SLOWBRO"] = "Mega Slowbro";
  Archetype2["GALARIAN_SLOWBRO"] = "Galarian Slowbro";
  Archetype2["MAGNEMITE"] = "Magnemite";
  Archetype2["MAGNETON"] = "Magneton";
  Archetype2["FARFETCHD"] = "Farfetch'd";
  Archetype2["GALARIAN_FARFETCHD"] = "Galarian Farfetch'd";
  Archetype2["DODUO"] = "Doduo";
  Archetype2["DODRIO"] = "Dodrio";
  Archetype2["SEEL"] = "Seel";
  Archetype2["DEWGONG"] = "Dewgong";
  Archetype2["GRIMER"] = "Grimer";
  Archetype2["ALOLAN_GRIMER"] = "Alolan Grimer";
  Archetype2["MUK"] = "Muk";
  Archetype2["ALOLAN_MUK"] = "Alolan Muk";
  Archetype2["SHELLDER"] = "Shellder";
  Archetype2["CLOYSTER"] = "Cloyster";
  Archetype2["GASTLY"] = "Gastly";
  Archetype2["HAUNTER"] = "Haunter";
  Archetype2["GENGAR"] = "Gengar";
  Archetype2["MEGA_GENGAR"] = "Mega Gengar";
  Archetype2["ONIX"] = "Onix";
  Archetype2["DROWZEE"] = "Drowzee";
  Archetype2["HYPNO"] = "Hypno";
  Archetype2["KRABBY"] = "Krabby";
  Archetype2["KINGLER"] = "Kingler";
  Archetype2["VOLTORB"] = "Voltorb";
  Archetype2["HISUIAN_VOLTORB"] = "Hisuian Voltorb";
  Archetype2["ELECTRODE"] = "Electrode";
  Archetype2["HISUIAN_ELECTRODE"] = "Hisuian Electrode";
  Archetype2["EXEGGCUTE"] = "Exeggcute";
  Archetype2["EXEGGUTOR"] = "Exeggutor";
  Archetype2["ALOLAN_EXEGGUTOR"] = "Alolan Exeggutor";
  Archetype2["CUBONE"] = "Cubone";
  Archetype2["MAROWAK"] = "Marowak";
  Archetype2["ALOLAN_MAROWAK"] = "Alolan Marowak";
  Archetype2["HITMONLEE"] = "Hitmonlee";
  Archetype2["HITMONCHAN"] = "Hitmonchan";
  Archetype2["LICKITUNG"] = "Lickitung";
  Archetype2["KOFFING"] = "Koffing";
  Archetype2["WEEZING"] = "Weezing";
  Archetype2["GALARIAN_WEEZING"] = "Galarian Weezing";
  Archetype2["RHYHORN"] = "Rhyhorn";
  Archetype2["RHYDON"] = "Rhydon";
  Archetype2["CHANSEY"] = "Chansey";
  Archetype2["TANGELA"] = "Tangela";
  Archetype2["KANGASKHAN"] = "Kangaskhan";
  Archetype2["MEGA_KANGASKHAN"] = "Mega Kangaskhan";
  Archetype2["HORSEA"] = "Horsea";
  Archetype2["SEADRA"] = "Seadra";
  Archetype2["GOLDEEN"] = "Goldeen";
  Archetype2["SEAKING"] = "Seaking";
  Archetype2["STARYU"] = "Staryu";
  Archetype2["STARMIE"] = "Starmie";
  Archetype2["MR_MIME"] = "Mr. Mime";
  Archetype2["GALARIAN_MR_MIME"] = "Galarian Mr. Mime";
  Archetype2["SCYTHER"] = "Scyther";
  Archetype2["JYNX"] = "Jynx";
  Archetype2["ELECTABUZZ"] = "Electabuzz";
  Archetype2["MAGMAR"] = "Magmar";
  Archetype2["PINSIR"] = "Pinsir";
  Archetype2["MEGA_PINSIR"] = "Mega Pinsir";
  Archetype2["TAUROS"] = "Tauros";
  Archetype2["PALDEAN_TAUROS_COMBAT"] = "Paldean Tauros Combat Breed";
  Archetype2["PALDEAN_TAUROS_BLAZE"] = "Paldean Tauros Blaze Breed";
  Archetype2["PALDEAN_TAUROS_AQUA"] = "Paldean Tauros Aqua Breed";
  Archetype2["MAGIKARP"] = "Magikarp";
  Archetype2["GYARADOS"] = "Gyarados";
  Archetype2["MEGA_GYARADOS"] = "Mega Gyarados";
  Archetype2["LAPRAS"] = "Lapras";
  Archetype2["DITTO"] = "Ditto";
  Archetype2["EEVEE"] = "Eevee";
  Archetype2["VAPOREON"] = "Vaporeon";
  Archetype2["JOLTEON"] = "Jolteon";
  Archetype2["PORYGON"] = "Porygon";
  Archetype2["OMANYTE"] = "Omanyte";
  Archetype2["OMASTAR"] = "Omastar";
  Archetype2["KABUTO"] = "Kabuto";
  Archetype2["KABUTOPS"] = "Kabutops";
  Archetype2["AERODACTYL"] = "Aerodactyl";
  Archetype2["MEGA_AERODACTYL"] = "Mega Aerodactyl";
  Archetype2["ARTICUNO"] = "Articuno";
  Archetype2["GALARIAN_ARTICUNO"] = "Galarian Articuno";
  Archetype2["ZAPDOS"] = "Zapdos";
  Archetype2["GALARIAN_ZAPDOS"] = "Galarian Zapdos";
  Archetype2["MOLTRES"] = "Moltres";
  Archetype2["GALARIAN_MOLTRES"] = "Galarian Moltres";
  Archetype2["DRATINI"] = "Dratini";
  Archetype2["DRAGONAIR"] = "Dragonair";
  Archetype2["DRAGONITE"] = "Dragonite";
  Archetype2["MEWTWO"] = "Mewtwo";
  Archetype2["MEGA_MEWTWO_X"] = "Mega Mewtwo X";
  Archetype2["MEGA_MEWTWO_Y"] = "Mega Mewtwo Y";
  Archetype2["MEW"] = "Mew";
  Archetype2["CHIKORITA"] = "Chikorita";
  Archetype2["BAYLEEF"] = "Bayleef";
  Archetype2["MEGANIUM"] = "Meganium";
  Archetype2["CYNDAQUIL"] = "Cyndaquil";
  Archetype2["QUILAVA"] = "Quilava";
  Archetype2["TYPHLOSION"] = "Typhlosion";
  Archetype2["TYPHLOSION_HISUIAN"] = "Typhlosion Hisuian";
  Archetype2["TOTODILE"] = "Totodile";
  Archetype2["CROCONAW"] = "Croconaw";
  Archetype2["SENTRET"] = "Sentret";
  Archetype2["FURRET"] = "Furret";
  Archetype2["HOOTHOOT"] = "Hoothoot";
  Archetype2["NOCTOWL"] = "Noctowl";
  Archetype2["LEDYBA"] = "Ledyba";
  Archetype2["LEDIAN"] = "Ledian";
  Archetype2["SPINARAK"] = "Spinarak";
  Archetype2["ARIADOS"] = "Ariados";
  Archetype2["CHINCHOU"] = "Chinchou";
  Archetype2["LANTURN"] = "Lanturn";
  Archetype2["PICHU"] = "Pichu";
  Archetype2["CLEFFA"] = "Cleffa";
  Archetype2["IGGLYBUFF"] = "Igglybuff";
  Archetype2["TOGEPI"] = "Togepi";
  Archetype2["TOGETIC"] = "Togetic";
  Archetype2["NATU"] = "Natu";
  Archetype2["XATU"] = "Xatu";
  Archetype2["MAREEP"] = "Mareep";
  Archetype2["FLAAFFY"] = "Flaaffy";
  Archetype2["AMPHAROS"] = "Ampharos";
  Archetype2["BELLOSSOM"] = "Bellossom";
  Archetype2["MARILL"] = "Marill";
  Archetype2["AZUMARILL"] = "Azumarill";
  Archetype2["SUDOWOODO"] = "Sudowoodo";
  Archetype2["POLITOED"] = "Politoed";
  Archetype2["HOPPIP"] = "Hoppip";
  Archetype2["SKIPLOOM"] = "Skiploom";
  Archetype2["JUMPLUFF"] = "Jumpluff";
  Archetype2["AIPOM"] = "Aipom";
  Archetype2["SUNKERN"] = "Sunkern";
  Archetype2["SUNFLORA"] = "Sunflora";
  Archetype2["YANMA"] = "Yanma";
  Archetype2["WOOPER"] = "Wooper";
  Archetype2["WOOPER_PALDEAN"] = "Wooper Paldean";
  Archetype2["QUAGSIRE"] = "Quagsire";
  Archetype2["ESPEON"] = "Espeon";
  Archetype2["UMBREON"] = "Umbreon";
  Archetype2["MURKROW"] = "Murkrow";
  Archetype2["SLOWKING"] = "Slowking";
  Archetype2["SLOWKING_GALARIAN"] = "Slowking Galarian";
  Archetype2["MISDREAVUS"] = "Misdreavus";
  Archetype2["UNOWN"] = "Unown";
  Archetype2["WOBBUFFET"] = "Wobbuffet";
  Archetype2["GIRAFARIG"] = "Girafarig";
  Archetype2["PINECO"] = "Pineco";
  Archetype2["FORRETRESS"] = "Forretress";
  Archetype2["DUNSPARCE"] = "Dunsparce";
  Archetype2["GLIGAR"] = "Gligar";
  Archetype2["STEELIX"] = "Steelix";
  Archetype2["SNUBBULL"] = "Snubbull";
  Archetype2["GRANBULL"] = "Granbull";
  Archetype2["QWILFISH"] = "Qwilfish";
  Archetype2["QWILFISH_HISUIAN"] = "Qwilfish Hisuian";
  Archetype2["SCIZOR"] = "Scizor";
  Archetype2["SHUCKLE"] = "Shuckle";
  Archetype2["HERACROSS"] = "Heracross";
  Archetype2["SNEASEL"] = "Sneasel";
  Archetype2["SNEASEL_HISUIAN"] = "Sneasel Hisuian";
  Archetype2["TEDDIURSA"] = "Teddiursa";
  Archetype2["URSARING"] = "Ursaring";
  Archetype2["SLUGMA"] = "Slugma";
  Archetype2["MAGCARGO"] = "Magcargo";
  Archetype2["SWINUB"] = "Swinub";
  Archetype2["PILOSWINE"] = "Piloswine";
  Archetype2["CORSOLA"] = "Corsola";
  Archetype2["CORSOLA_GALARIAN"] = "Corsola Galarian";
  Archetype2["REMORAID"] = "Remoraid";
  Archetype2["OCTILLERY"] = "Octillery";
  Archetype2["DELIBIRD"] = "Delibird";
  Archetype2["MANTINE"] = "Mantine";
  Archetype2["SKARMORY"] = "Skarmory";
  Archetype2["HOUNDOUR"] = "Houndour";
  Archetype2["HOUNDOOM"] = "Houndoom";
  Archetype2["KINGDRA"] = "Kingdra";
  Archetype2["PHANPY"] = "Phanpy";
  Archetype2["DONPHAN"] = "Donphan";
  Archetype2["PORYGON2"] = "Porygon2";
  Archetype2["STANTLER"] = "Stantler";
  Archetype2["SMEARGLE"] = "Smeargle";
  Archetype2["TYROGUE"] = "Tyrogue";
  Archetype2["HITMONTOP"] = "Hitmontop";
  Archetype2["SMOOCHUM"] = "Smoochum";
  Archetype2["ELEKID"] = "Elekid";
  Archetype2["MAGBY"] = "Magby";
  Archetype2["MILTANK"] = "Miltank";
  Archetype2["RAIKOU"] = "Raikou";
  Archetype2["ENTEI"] = "Entei";
  Archetype2["SUICUNE"] = "Suicune";
  Archetype2["LARVITAR"] = "Larvitar";
  Archetype2["PUPITAR"] = "Pupitar";
  Archetype2["TYRANITAR"] = "Tyranitar";
  Archetype2["LUGIA"] = "Lugia";
  Archetype2["HO_OH"] = "Ho-Oh";
  Archetype2["CELEBI"] = "Celebi";
  Archetype2["TREECKO"] = "Treecko";
  Archetype2["GROVYLE"] = "Grovyle";
  Archetype2["SCEPTILE"] = "Sceptile";
  Archetype2["MEGA_SCEPTILE"] = "Mega Sceptile";
  Archetype2["TORCHIC"] = "Torchic";
  Archetype2["COMBUSKEN"] = "Combusken";
  Archetype2["BLAZIKEN"] = "Blaziken";
  Archetype2["MEGA_BLAZIKEN"] = "Mega Blaziken";
  Archetype2["MUDKIP"] = "Mudkip";
  Archetype2["MARSHTOMP"] = "Marshtomp";
  Archetype2["SWAMPERT"] = "Swampert";
  Archetype2["MEGA_SWAMPERT"] = "Mega Swampert";
  Archetype2["POOCHYENA"] = "Poochyena";
  Archetype2["MIGHTYENA"] = "Mightyena";
  Archetype2["ZIGZAGOON"] = "Zigzagoon";
  Archetype2["GALARIAN_ZIGZAGOON"] = "Galarian Zigzagoon";
  Archetype2["LINOONE"] = "Linoone";
  Archetype2["GALARIAN_LINOONE"] = "Galarian Linoone";
  Archetype2["WURMPLE"] = "Wurmple";
  Archetype2["SILCOON"] = "Silcoon";
  Archetype2["BEAUTIFLY"] = "Beautifly";
  Archetype2["CASCOON"] = "Cascoon";
  Archetype2["DUSTOX"] = "Dustox";
  Archetype2["LOTAD"] = "Lotad";
  Archetype2["LOMBRE"] = "Lombre";
  Archetype2["LUDICOLO"] = "Ludicolo";
  Archetype2["SEEDOT"] = "Seedot";
  Archetype2["NUZLEAF"] = "Nuzleaf";
  Archetype2["SHIFTRY"] = "Shiftry";
  Archetype2["TAILLOW"] = "Taillow";
  Archetype2["SWELLOW"] = "Swellow";
  Archetype2["WINGULL"] = "Wingull";
  Archetype2["PELIPPER"] = "Pelipper";
  Archetype2["RALTS"] = "Ralts";
  Archetype2["KIRLIA"] = "Kirlia";
  Archetype2["GARDEVOIR"] = "Gardevoir";
  Archetype2["SURSKIT"] = "Surskit";
  Archetype2["MASQUERAIN"] = "Masquerain";
  Archetype2["SHROOMISH"] = "Shroomish";
  Archetype2["BRELOOM"] = "Breloom";
  Archetype2["SLAKOTH"] = "Slakoth";
  Archetype2["VIGOROTH"] = "Vigoroth";
  Archetype2["SLAKING"] = "Slaking";
  Archetype2["NINCADA"] = "Nincada";
  Archetype2["NINJASK"] = "Ninjask";
  Archetype2["SHEDINJA"] = "Shedinja";
  Archetype2["WHISMUR"] = "Whismur";
  Archetype2["LOUDRED"] = "Loudred";
  Archetype2["EXPLOUD"] = "Exploud";
  Archetype2["MAKUHITA"] = "Makuhita";
  Archetype2["HARIYAMA"] = "Hariyama";
  Archetype2["NOSEPASS"] = "Nosepass";
  Archetype2["SKITTY"] = "Skitty";
  Archetype2["DELCATTY"] = "Delcatty";
  Archetype2["SABLEYE"] = "Sableye";
  Archetype2["MEGA_SABLEYE"] = "Mega Sableye";
  Archetype2["MAWILE"] = "Mawile";
  Archetype2["MEGA_MAWILE"] = "Mega Mawile";
  Archetype2["ARON"] = "Aron";
  Archetype2["LAIRON"] = "Lairon";
  Archetype2["AGGRON"] = "Aggron";
  Archetype2["MEGA_AGGRON"] = "Mega Aggron";
  Archetype2["MEDITITE"] = "Meditite";
  Archetype2["MEDICHAM"] = "Medicham";
  Archetype2["MEGA_MEDICHAM"] = "Mega Medicham";
  Archetype2["ELECTRIKE"] = "Electrike";
  Archetype2["MANECTRIC"] = "Manectric";
  Archetype2["MEGA_MANECTRIC"] = "Mega Manectric";
  Archetype2["PLUSLE"] = "Plusle";
  Archetype2["MINUN"] = "Minun";
  Archetype2["VOLBEAT"] = "Volbeat";
  Archetype2["ILLUMISE"] = "Illumise";
  Archetype2["ROSELIA"] = "Roselia";
  Archetype2["GULPIN"] = "Gulpin";
  Archetype2["SWALOT"] = "Swalot";
  Archetype2["CARVANHA"] = "Carvanha";
  Archetype2["SHARPEDO"] = "Sharpedo";
  Archetype2["MEGA_SHARPEDO"] = "Mega Sharpedo";
  Archetype2["WAILMER"] = "Wailmer";
  Archetype2["WAILORD"] = "Wailord";
  Archetype2["NUMEL"] = "Numel";
  Archetype2["CAMERUPT"] = "Camerupt";
  Archetype2["MEGA_CAMERUPT"] = "Mega Camerupt";
  Archetype2["TORKOAL"] = "Torkoal";
  Archetype2["SPOINK"] = "Spoink";
  Archetype2["GRUMPIG"] = "Grumpig";
  Archetype2["SPINDA"] = "Spinda";
  Archetype2["TRAPINCH"] = "Trapinch";
  Archetype2["VIBRAVA"] = "Vibrava";
  Archetype2["FLYGON"] = "Flygon";
  Archetype2["CACNEA"] = "Cacnea";
  Archetype2["CACTURNE"] = "Cacturne";
  Archetype2["SWABLU"] = "Swablu";
  Archetype2["ALTARIA"] = "Altaria";
  Archetype2["MEGA_ALTARIA"] = "Mega Altaria";
  Archetype2["ZANGOOSE"] = "Zangoose";
  Archetype2["SEVIPER"] = "Seviper";
  Archetype2["LUNATONE"] = "Lunatone";
  Archetype2["SOLROCK"] = "Solrock";
  Archetype2["BARBOACH"] = "Barboach";
  Archetype2["WHISCASH"] = "Whiscash";
  Archetype2["CORPHISH"] = "Corphish";
  Archetype2["CRAWDAUNT"] = "Crawdaunt";
  Archetype2["BALTOY"] = "Baltoy";
  Archetype2["CLAYDOL"] = "Claydol";
  Archetype2["LILEEP"] = "Lileep";
  Archetype2["CRADILY"] = "Cradily";
  Archetype2["ANORITH"] = "Anorith";
  Archetype2["ARMALDO"] = "Armaldo";
  Archetype2["FEEBAS"] = "Feebas";
  Archetype2["CASTFORM"] = "Castform";
  Archetype2["CASTFORM_SUNNY"] = "Castform Sunny";
  Archetype2["CASTFORM_RAINY"] = "Castform Rainy";
  Archetype2["CASTFORM_SNOWY"] = "Castform Snowy";
  Archetype2["KECLEON"] = "Kecleon";
  Archetype2["SHUPPET"] = "Shuppet";
  Archetype2["BANETTE"] = "Banette";
  Archetype2["MEGA_BANETTE"] = "Mega Banette";
  Archetype2["DUSKULL"] = "Duskull";
  Archetype2["DUSCLOPS"] = "Dusclops";
  Archetype2["TROPIUS"] = "Tropius";
  Archetype2["CHIMECHO"] = "Chimecho";
  Archetype2["ABSOL"] = "Absol";
  Archetype2["MEGA_ABSOL"] = "Mega Absol";
  Archetype2["SNORUNT"] = "Snorunt";
  Archetype2["GLALIE"] = "Glalie";
  Archetype2["MEGA_GLALIE"] = "Mega Glalie";
  Archetype2["SPHEAL"] = "Spheal";
  Archetype2["SEALEO"] = "Sealeo";
  Archetype2["WALREIN"] = "Walrein";
  Archetype2["CLAMPERL"] = "Clamperl";
  Archetype2["HUNTAIL"] = "Huntail";
  Archetype2["GOREBYSS"] = "Gorebyss";
  Archetype2["RELICANTH"] = "Relicanth";
  Archetype2["LUVDISC"] = "Luvdisc";
  Archetype2["BAGON"] = "Bagon";
  Archetype2["SHELGON"] = "Shelgon";
  Archetype2["SALAMENCE"] = "Salamence";
  Archetype2["MEGA_SALAMENCE"] = "Mega Salamence";
  Archetype2["BELDUM"] = "Beldum";
  Archetype2["METANG"] = "Metang";
  Archetype2["METAGROSS"] = "Metagross";
  Archetype2["MEGA_METAGROSS"] = "Mega Metagross";
  Archetype2["REGIROCK"] = "Regirock";
  Archetype2["REGICE"] = "Regice";
  Archetype2["REGISTEEL"] = "Registeel";
  Archetype2["LATIAS"] = "Latias";
  Archetype2["MEGA_LATIAS"] = "Mega Latias";
  Archetype2["LATIOS"] = "Latios";
  Archetype2["MEGA_LATIOS"] = "Mega Latios";
  Archetype2["KYOGRE"] = "Kyogre";
  Archetype2["PRIMAL_KYOGRE"] = "Primal Kyogre";
  Archetype2["GROUDON"] = "Groudon";
  Archetype2["PRIMAL_GROUDON"] = "Primal Groudon";
  Archetype2["RAYQUAZA"] = "Rayquaza";
  Archetype2["MEGA_RAYQUAZA"] = "Mega Rayquaza";
  Archetype2["JIRACHI"] = "Jirachi";
  Archetype2["DEOXYS"] = "Deoxys";
  Archetype2["DEOXYS_ATTACK"] = "Deoxys Attack";
  Archetype2["DEOXYS_DEFENSE"] = "Deoxys Defense";
  Archetype2["DEOXYS_SPEED"] = "Deoxys Speed";
  Archetype2["TURTWIG"] = "Turtwig";
  Archetype2["GROTLE"] = "Grotle";
  Archetype2["TORTERRA"] = "Torterra";
  Archetype2["CHIMCHAR"] = "Chimchar";
  Archetype2["MONFERNO"] = "Monferno";
  Archetype2["INFERNAPE"] = "Infernape";
  Archetype2["PIPLUP"] = "Piplup";
  Archetype2["PRINPLUP"] = "Prinplup";
  Archetype2["EMPOLEON"] = "Empoleon";
  Archetype2["STARLY"] = "Starly";
  Archetype2["STARAVIA"] = "Staravia";
  Archetype2["STARAPTOR"] = "Staraptor";
  Archetype2["BIDOOF"] = "Bidoof";
  Archetype2["BIBAREL"] = "Bibarel";
  Archetype2["KRICKETOT"] = "Kricketot";
  Archetype2["KRICKETUNE"] = "Kricketune";
  Archetype2["SHINX"] = "Shinx";
  Archetype2["LUXIO"] = "Luxio";
  Archetype2["LUXRAY"] = "Luxray";
  Archetype2["BUDEW"] = "Budew";
  Archetype2["ROSERADE"] = "Roserade";
  Archetype2["CRANIDOS"] = "Cranidos";
  Archetype2["RAMPARDOS"] = "Rampardos";
  Archetype2["SHIELDON"] = "Shieldon";
  Archetype2["BASTIODON"] = "Bastiodon";
  Archetype2["BURMY"] = "Burmy";
  Archetype2["WORMADAM"] = "Wormadam";
  Archetype2["MOTHIM"] = "Mothim";
  Archetype2["COMBEE"] = "Combee";
  Archetype2["VESPIQUEN"] = "Vespiquen";
  Archetype2["PACHIRISU"] = "Pachirisu";
  Archetype2["BUIZEL"] = "Buizel";
  Archetype2["FLOATZEL"] = "Floatzel";
  Archetype2["CHERUBI"] = "Cherubi";
  Archetype2["CHERRIM"] = "Cherrim";
  Archetype2["SHELLOS"] = "Shellos";
  Archetype2["GASTRODON"] = "Gastrodon";
  Archetype2["AMBIPOM"] = "Ambipom";
  Archetype2["DRIFLOON"] = "Drifloon";
  Archetype2["DRIFBLIM"] = "Drifblim";
  Archetype2["BUNEARY"] = "Buneary";
  Archetype2["LOPUNNY"] = "Lopunny";
  Archetype2["MISMAGIUS"] = "Mismagius";
  Archetype2["HONCHKROW"] = "Honchkrow";
  Archetype2["GLAMEOW"] = "Glameow";
  Archetype2["PURUGLY"] = "Purugly";
  Archetype2["CHINGLING"] = "Chingling";
  Archetype2["STUNKY"] = "Stunky";
  Archetype2["SKUNTANK"] = "Skuntank";
  Archetype2["BRONZOR"] = "Bronzor";
  Archetype2["BRONZONG"] = "Bronzong";
  Archetype2["BONSLY"] = "Bonsly";
  Archetype2["MIME_JR"] = "Mime Jr.";
  Archetype2["HAPPINY"] = "Happiny";
  Archetype2["CHATOT"] = "Chatot";
  Archetype2["SPIRITOMB"] = "Spiritomb";
  Archetype2["GIBLE"] = "Gible";
  Archetype2["GABITE"] = "Gabite";
  Archetype2["GARCHOMP"] = "Garchomp";
  Archetype2["MUNCHLAX"] = "Munchlax";
  Archetype2["RIOLU"] = "Riolu";
  Archetype2["LUCARIO"] = "Lucario";
  Archetype2["HIPPOPOTAS"] = "Hippopotas";
  Archetype2["HIPPOWDON"] = "Hippowdon";
  Archetype2["SKORUPI"] = "Skorupi";
  Archetype2["DRAPION"] = "Drapion";
  Archetype2["CROAGUNK"] = "Croagunk";
  Archetype2["TOXICROAK"] = "Toxicroak";
  Archetype2["CARNIVINE"] = "Carnivine";
  Archetype2["FINNEON"] = "Finneon";
  Archetype2["LUMINEON"] = "Lumineon";
  Archetype2["MANTYKE"] = "Mantyke";
  Archetype2["SNOVER"] = "Snover";
  Archetype2["ABOMASNOW"] = "Abomasnow";
  Archetype2["WEAVILE"] = "Weavile";
  Archetype2["MAGNEZONE"] = "Magnezone";
  Archetype2["LICKILICKY"] = "Lickilicky";
  Archetype2["RHYPERIOR"] = "Rhyperior";
  Archetype2["TANGROWTH"] = "Tangrowth";
  Archetype2["ELECTIVIRE"] = "Electivire";
  Archetype2["MAGMORTAR"] = "Magmortar";
  Archetype2["TOGEKISS"] = "Togekiss";
  Archetype2["YANMEGA"] = "Yanmega";
  Archetype2["LEAFEON"] = "Leafeon";
  Archetype2["GLACEON"] = "Glaceon";
  Archetype2["GLISCOR"] = "Gliscor";
  Archetype2["PORYGON_Z"] = "Porygon-Z";
  Archetype2["GALLADE"] = "Gallade";
  Archetype2["PROBOPASS"] = "Probopass";
  Archetype2["DUSKNOIR"] = "Dusknoir";
  Archetype2["UXIE"] = "Uxie";
  Archetype2["MESPRIT"] = "Mesprit";
  Archetype2["AZELF"] = "Azelf";
  Archetype2["DIALGA"] = "Dialga";
  Archetype2["PALKIA"] = "Palkia";
  Archetype2["HEATRAN"] = "Heatran";
  Archetype2["REGIGIGAS"] = "Regigigas";
  Archetype2["GIRATINA"] = "Giratina";
  Archetype2["CRESSELIA"] = "Cresselia";
  Archetype2["PHIONE"] = "Phione";
  Archetype2["MANAPHY"] = "Manaphy";
  Archetype2["DARKRAI"] = "Darkrai";
  Archetype2["SHAYMIN"] = "Shaymin";
  Archetype2["ARCEUS"] = "Arceus";
  Archetype2["VICTINI"] = "Victini";
  Archetype2["SNIVY"] = "Snivy";
  Archetype2["SERVINE"] = "Servine";
  Archetype2["SERPERIOR"] = "Serperior";
  Archetype2["TEPIG"] = "Tepig";
  Archetype2["PIGNITE"] = "Pignite";
  Archetype2["EMBOAR"] = "Emboar";
  Archetype2["OSHAWOTT"] = "Oshawott";
  Archetype2["DEWOTT"] = "Dewott";
  Archetype2["SAMUROTT"] = "Samurott";
  Archetype2["PATRAT"] = "Patrat";
  Archetype2["WATCHOG"] = "Watchog";
  Archetype2["LILLIPUP"] = "Lillipup";
  Archetype2["HERDIER"] = "Herdier";
  Archetype2["STOUTLAND"] = "Stoutland";
  Archetype2["PURRLOIN"] = "Purrloin";
  Archetype2["LIEPARD"] = "Liepard";
  Archetype2["PANSAGE"] = "Pansage";
  Archetype2["SIMISAGE"] = "Simisage";
  Archetype2["PANSEAR"] = "Pansear";
  Archetype2["SIMISEAR"] = "Simisear";
  Archetype2["PANPOUR"] = "Panpour";
  Archetype2["SIMIPOUR"] = "Simipour";
  Archetype2["MUNNA"] = "Munna";
  Archetype2["MUSHARNA"] = "Musharna";
  Archetype2["PIDOVE"] = "Pidove";
  Archetype2["TRANQUILL"] = "Tranquill";
  Archetype2["UNFEZANT"] = "Unfezant";
  Archetype2["BLITZLE"] = "Blitzle";
  Archetype2["ZEBSTRIKA"] = "Zebstrika";
  Archetype2["ROGGENROLA"] = "Roggenrola";
  Archetype2["BOLDORE"] = "Boldore";
  Archetype2["GIGALITH"] = "Gigalith";
  Archetype2["WOOBAT"] = "Woobat";
  Archetype2["SWOOBAT"] = "Swoobat";
  Archetype2["DRILBUR"] = "Drilbur";
  Archetype2["EXCADRILL"] = "Excadrill";
  Archetype2["AUDINO"] = "Audino";
  Archetype2["TIMBURR"] = "Timburr";
  Archetype2["GURDURR"] = "Gurdurr";
  Archetype2["CONKELDURR"] = "Conkeldurr";
  Archetype2["TYMPOLE"] = "Tympole";
  Archetype2["PALPITOAD"] = "Palpitoad";
  Archetype2["SEISMITOAD"] = "Seismitoad";
  Archetype2["THROH"] = "Throh";
  Archetype2["SAWK"] = "Sawk";
  Archetype2["SEWADDLE"] = "Sewaddle";
  Archetype2["SWADLOON"] = "Swadloon";
  Archetype2["LEAVANNY"] = "Leavanny";
  Archetype2["VENIPEDE"] = "Venipede";
  Archetype2["WHIRLIPEDE"] = "Whirlipede";
  Archetype2["SCOLIPEDE"] = "Scolipede";
  Archetype2["COTTONEE"] = "Cottonee";
  Archetype2["WHIMSICOTT"] = "Whimsicott";
  Archetype2["PETILIL"] = "Petilil";
  Archetype2["LILLIGANT"] = "Lilligant";
  Archetype2["BASCULIN"] = "Basculin";
  Archetype2["SANDILE"] = "Sandile";
  Archetype2["KROKOROK"] = "Krokorok";
  Archetype2["KROOKODILE"] = "Krookodile";
  Archetype2["DARUMAKA"] = "Darumaka";
  Archetype2["DARMANITAN"] = "Darmanitan";
  Archetype2["MARACTUS"] = "Maractus";
  Archetype2["DWEBBLE"] = "Dwebble";
  Archetype2["CRUSTLE"] = "Crustle";
  Archetype2["SCRAGGY"] = "Scraggy";
  Archetype2["SCRAFTY"] = "Scrafty";
  Archetype2["SIGILYPH"] = "Sigilyph";
  Archetype2["YAMASK"] = "Yamask";
  Archetype2["COFAGRIGUS"] = "Cofagrigus";
  Archetype2["TIRTOUGA"] = "Tirtouga";
  Archetype2["CARRACOSTA"] = "Carracosta";
  Archetype2["ARCHEN"] = "Archen";
  Archetype2["ARCHEOPS"] = "Archeops";
  Archetype2["TRUBBISH"] = "Trubbish";
  Archetype2["GARBODOR"] = "Garbodor";
  Archetype2["ZORUA"] = "Zorua";
  Archetype2["MINCCINO"] = "Minccino";
  Archetype2["GOTHITA"] = "Gothita";
  Archetype2["GOTHORITA"] = "Gothorita";
  Archetype2["GOTHITELLE"] = "Gothitelle";
  Archetype2["SOLOSIS"] = "Solosis";
  Archetype2["DUOSION"] = "Duosion";
  Archetype2["REUNICLUS"] = "Reuniclus";
  Archetype2["DUCKLETT"] = "Ducklett";
  Archetype2["SWANNA"] = "Swanna";
  Archetype2["VANILLITE"] = "Vanillite";
  Archetype2["VANILLISH"] = "Vanillish";
  Archetype2["VANILLUXE"] = "Vanilluxe";
  Archetype2["DEERLING"] = "Deerling";
  Archetype2["SAWSBUCK"] = "Sawsbuck";
  Archetype2["EMOLGA"] = "Emolga";
  Archetype2["KARRABLAST"] = "Karrablast";
  Archetype2["ESCAVALIER"] = "Escavalier";
  Archetype2["FOONGUS"] = "Foongus";
  Archetype2["AMOONGUSS"] = "Amoonguss";
  Archetype2["FRILLISH"] = "Frillish";
  Archetype2["JELLICENT"] = "Jellicent";
  Archetype2["ALOMOMOLA"] = "Alomomola";
  Archetype2["JOLTIK"] = "Joltik";
  Archetype2["GALVANTULA"] = "Galvantula";
  Archetype2["FERROSEED"] = "Ferroseed";
  Archetype2["FERROTHORN"] = "Ferrothorn";
  Archetype2["KLINK"] = "Klink";
  Archetype2["KLANG"] = "Klang";
  Archetype2["KLINKLANG"] = "Klinklang";
  Archetype2["TYNAMO"] = "Tynamo";
  Archetype2["EELEKTRIK"] = "Eelektrik";
  Archetype2["EELEKTROSS"] = "Eelektross";
  Archetype2["ELGYEM"] = "Elgyem";
  Archetype2["BEHEEYEM"] = "Beheeyem";
  Archetype2["LITWICK"] = "Litwick";
  Archetype2["LAMPENT"] = "Lampent";
  Archetype2["CHANDELURE"] = "Chandelure";
  Archetype2["AXEW"] = "Axew";
  Archetype2["FRAXURE"] = "Fraxure";
  Archetype2["HAXORUS"] = "Haxorus";
  Archetype2["CUBCHOO"] = "Cubchoo";
  Archetype2["BEARTIC"] = "Beartic";
  Archetype2["CRYOGONAL"] = "Cryogonal";
  Archetype2["SHELMET"] = "Shelmet";
  Archetype2["ACCELGOR"] = "Accelgor";
  Archetype2["STUNFISK"] = "Stunfisk";
  Archetype2["MIENFOO"] = "Mienfoo";
  Archetype2["MIENSHAO"] = "Mienshao";
  Archetype2["DRUDDIGON"] = "Druddigon";
  Archetype2["GOLETT"] = "Golett";
  Archetype2["GOLURK"] = "Golurk";
  Archetype2["PAWNIARD"] = "Pawniard";
  Archetype2["BISHARP"] = "Bisharp";
  Archetype2["BOUFFALANT"] = "Bouffalant";
  Archetype2["RUFFLET"] = "Rufflet";
  Archetype2["BRAVIARY"] = "Braviary";
  Archetype2["VULLABY"] = "Vullaby";
  Archetype2["MANDIBUZZ"] = "Mandibuzz";
  Archetype2["HEATMOR"] = "Heatmor";
  Archetype2["DURANT"] = "Durant";
  Archetype2["DEINO"] = "Deino";
  Archetype2["ZWEILOUS"] = "Zweilous";
  Archetype2["LARVESTA"] = "Larvesta";
  Archetype2["VOLCARONA"] = "Volcarona";
  Archetype2["COBALION"] = "Cobalion";
  Archetype2["TERRAKION"] = "Terrakion";
  Archetype2["VIRIZION"] = "Virizion";
  Archetype2["TORNADUS"] = "Tornadus";
  Archetype2["THUNDURUS"] = "Thundurus";
  Archetype2["RESHIRAM"] = "Reshiram";
  Archetype2["ZEKROM"] = "Zekrom";
  Archetype2["LANDORUS"] = "Landorus";
  Archetype2["KYUREM"] = "Kyurem";
  Archetype2["KYUREM_WHITE"] = "White Kyurem";
  Archetype2["KYUREM_BLACK"] = "Black Kyurem";
  Archetype2["KELDEO"] = "Keldeo";
  Archetype2["MELOETTA"] = "Meloetta";
  Archetype2["GENESECT"] = "Genesect";
  Archetype2["CHESPIN"] = "Chespin";
  Archetype2["QUILLADIN"] = "Quilladin";
  Archetype2["CHESNAUGHT"] = "Chesnaught";
  Archetype2["FENNEKIN"] = "Fennekin";
  Archetype2["BRAIXEN"] = "Braixen";
  Archetype2["DELPHOX"] = "Delphox";
  Archetype2["FROAKIE"] = "Froakie";
  Archetype2["FROGADIER"] = "Frogadier";
  Archetype2["GRENINJA"] = "Greninja";
  Archetype2["BUNNELBY"] = "Bunnelby";
  Archetype2["DIGGERSBY"] = "Diggersby";
  Archetype2["FLETCHLING"] = "Fletchling";
  Archetype2["FLETCHINDER"] = "Fletchinder";
  Archetype2["TALONFLAME"] = "Talonflame";
  Archetype2["SCATTERBUG"] = "Scatterbug";
  Archetype2["SPEWPA"] = "Spewpa";
  Archetype2["VIVILLON"] = "Vivillon";
  Archetype2["LITLEO"] = "Litleo";
  Archetype2["PYROAR"] = "Pyroar";
  Archetype2["FLABEBE"] = "Flabébé";
  Archetype2["FLOETTE"] = "Floette";
  Archetype2["FLORGES"] = "Florges";
  Archetype2["SKIDDO"] = "Skiddo";
  Archetype2["GOGOAT"] = "Gogoat";
  Archetype2["PANCHAM"] = "Pancham";
  Archetype2["PANGORO"] = "Pangoro";
  Archetype2["FURFROU"] = "Furfrou";
  Archetype2["ESPURR"] = "Espurr";
  Archetype2["MEOWSTIC"] = "Meowstic";
  Archetype2["HONEDGE"] = "Honedge";
  Archetype2["DOUBLADE"] = "Doublade";
  Archetype2["AEGISLASH"] = "Aegislash";
  Archetype2["SPRITZEE"] = "Spritzee";
  Archetype2["AROMATISSE"] = "Aromatisse";
  Archetype2["SWIRLIX"] = "Swirlix";
  Archetype2["SLURPUFF"] = "Slurpuff";
  Archetype2["INKAY"] = "Inkay";
  Archetype2["MALAMAR"] = "Malamar";
  Archetype2["BINACLE"] = "Binacle";
  Archetype2["BARBARACLE"] = "Barbaracle";
  Archetype2["SKRELP"] = "Skrelp";
  Archetype2["DRAGALGE"] = "Dragalge";
  Archetype2["CLAUNCHER"] = "Clauncher";
  Archetype2["CLAWITZER"] = "Clawitzer";
  Archetype2["HELIOPTILE"] = "Helioptile";
  Archetype2["HELIOLISK"] = "Heliolisk";
  Archetype2["TYRUNT"] = "Tyrunt";
  Archetype2["TYRANTRUM"] = "Tyrantrum";
  Archetype2["AMAURA"] = "Amaura";
  Archetype2["AURORUS"] = "Aurorus";
  Archetype2["SYLVEON"] = "Sylveon";
  Archetype2["HAWLUCHA"] = "Hawlucha";
  Archetype2["DEDENNE"] = "Dedenne";
  Archetype2["CARBINK"] = "Carbink";
  Archetype2["GOOMY"] = "Goomy";
  Archetype2["SLIGGOO"] = "Sliggoo";
  Archetype2["GOODRA"] = "Goodra";
  Archetype2["KLEFKI"] = "Klefki";
  Archetype2["PHANTUMP"] = "Phantump";
  Archetype2["TREVENANT"] = "Trevenant";
  Archetype2["PUMPKABOO"] = "Pumpkaboo";
  Archetype2["GOURGEIST"] = "Gourgeist";
  Archetype2["BERGMITE"] = "Bergmite";
  Archetype2["AVALUGG"] = "Avalugg";
  Archetype2["NOIBAT"] = "Noibat";
  Archetype2["NOIVERN"] = "Noivern";
  Archetype2["XERNEAS"] = "Xerneas";
  Archetype2["YVELTAL"] = "Yveltal";
  Archetype2["ZYGARDE"] = "Zygarde";
  Archetype2["DIANCIE"] = "Diancie";
  Archetype2["HOOPA"] = "Hoopa";
  Archetype2["VOLCANION"] = "Volcanion";
  Archetype2["ROWLET"] = "Rowlet";
  Archetype2["DARTRIX"] = "Dartrix";
  Archetype2["DECIDUEYE"] = "Decidueye";
  Archetype2["LITTEN"] = "Litten";
  Archetype2["TORRACAT"] = "Torracat";
  Archetype2["INCINEROAR"] = "Incineroar";
  Archetype2["POPPLIO"] = "Popplio";
  Archetype2["BRIONNE"] = "Brionne";
  Archetype2["PRIMARINA"] = "Primarina";
  Archetype2["PIKIPEK"] = "Pikipek";
  Archetype2["TRUMBEAK"] = "Trumbeak";
  Archetype2["TOUCANNON"] = "Toucannon";
  Archetype2["YUNGOOS"] = "Yungoos";
  Archetype2["GUMSHOOS"] = "Gumshoos";
  Archetype2["GRUBBIN"] = "Grubbin";
  Archetype2["CHARJABUG"] = "Charjabug";
  Archetype2["VIKAVOLT"] = "Vikavolt";
  Archetype2["CRABRAWLER"] = "Crabrawler";
  Archetype2["CRABOMINABLE"] = "Crabominable";
  Archetype2["ORICORIO"] = "Oricorio";
  Archetype2["CUTIEFLY"] = "Cutiefly";
  Archetype2["RIBOMBEE"] = "Ribombee";
  Archetype2["ROCKRUFF"] = "Rockruff";
  Archetype2["LYCANROC"] = "Lycanroc";
  Archetype2["WISHIWASHI"] = "Wishiwashi";
  Archetype2["MAREANIE"] = "Mareanie";
  Archetype2["TOXAPEX"] = "Toxapex";
  Archetype2["MUDBRAY"] = "Mudbray";
  Archetype2["MUDSDALE"] = "Mudsdale";
  Archetype2["DEWPIDER"] = "Dewpider";
  Archetype2["ARAQUANID"] = "Araquanid";
  Archetype2["FOMANTIS"] = "Fomantis";
  Archetype2["LURANTIS"] = "Lurantis";
  Archetype2["MORELULL"] = "Morelull";
  Archetype2["SHIINOTIC"] = "Shiinotic";
  Archetype2["SALANDIT"] = "Salandit";
  Archetype2["SALAZZLE"] = "Salazzle";
  Archetype2["STUFFUL"] = "Stufful";
  Archetype2["BEWEAR"] = "Bewear";
  Archetype2["BOUNSWEET"] = "Bounsweet";
  Archetype2["STEENEE"] = "Steenee";
  Archetype2["TSAREENA"] = "Tsareena";
  Archetype2["ORANGURU"] = "Oranguru";
  Archetype2["PASSIMIAN"] = "Passimian";
  Archetype2["WIMPOD"] = "Wimpod";
  Archetype2["GOLISOPOD"] = "Golisopod";
  Archetype2["SANDYGAST"] = "Sandygast";
  Archetype2["PALOSSAND"] = "Palossand";
  Archetype2["PYUKUMUKU"] = "Pyukumuku";
  Archetype2["TYPE_NULL"] = "Type: Null";
  Archetype2["SILVALLY"] = "Silvally";
  Archetype2["MINIOR"] = "Minior";
  Archetype2["KOMALA"] = "Komala";
  Archetype2["TURTONATOR"] = "Turtonator";
  Archetype2["TOGEDEMARU"] = "Togedemaru";
  Archetype2["MIMIKYU"] = "Mimikyu";
  Archetype2["BRUXISH"] = "Bruxish";
  Archetype2["DRAMPA"] = "Drampa";
  Archetype2["DHELMISE"] = "Dhelmise";
  Archetype2["JANGMO_O"] = "Jangmo-o";
  Archetype2["HAKAMO_O"] = "Hakamo-o";
  Archetype2["KOMMO_O"] = "Kommo-o";
  Archetype2["TAPU_KOKO"] = "Tapu Koko";
  Archetype2["TAPU_LELE"] = "Tapu Lele";
  Archetype2["TAPU_BULU"] = "Tapu Bulu";
  Archetype2["TAPU_FINI"] = "Tapu Fini";
  Archetype2["COSMOG"] = "Cosmog";
  Archetype2["COSMOEM"] = "Cosmoem";
  Archetype2["SOLGALEO"] = "Solgaleo";
  Archetype2["LUNALA"] = "Lunala";
  Archetype2["NIHILEGO"] = "Nihilego";
  Archetype2["BUZZWOLE"] = "Buzzwole";
  Archetype2["PHEROMOSA"] = "Pheromosa";
  Archetype2["XURKITREE"] = "Xurkitree";
  Archetype2["CELESTEELA"] = "Celesteela";
  Archetype2["KARTANA"] = "Kartana";
  Archetype2["GUZZLORD"] = "Guzzlord";
  Archetype2["NECROZMA"] = "Necrozma";
  Archetype2["MAGEARNA"] = "Magearna";
  Archetype2["MARSHADOW"] = "Marshadow";
  Archetype2["POIPOLE"] = "Poipole";
  Archetype2["NAGANADEL"] = "Naganadel";
  Archetype2["STAKATAKA"] = "Stakataka";
  Archetype2["BLACEPHALON"] = "Blacephalon";
  Archetype2["ZERAORA"] = "Zeraora";
  Archetype2["MELTAN"] = "Meltan";
  Archetype2["MELMETAL"] = "Melmetal";
  Archetype2["GROOKEY"] = "Grookey";
  Archetype2["THWACKEY"] = "Thwackey";
  Archetype2["RILLABOOM"] = "Rillaboom";
  Archetype2["SCORBUNNY"] = "Scorbunny";
  Archetype2["RABOOT"] = "Raboot";
  Archetype2["CINDERACE"] = "Cinderace";
  Archetype2["SOBBLE"] = "Sobble";
  Archetype2["DRIZZILE"] = "Drizzile";
  Archetype2["INTELEON"] = "Inteleon";
  Archetype2["SKWOVET"] = "Skwovet";
  Archetype2["GREEDENT"] = "Greedent";
  Archetype2["ROOKIDEE"] = "Rookidee";
  Archetype2["CORVISQUIRE"] = "Corvisquire";
  Archetype2["CORVIKNIGHT"] = "Corviknight";
  Archetype2["BLIPBUG"] = "Blipbug";
  Archetype2["DOTTLER"] = "Dottler";
  Archetype2["ORBEETLE"] = "Orbeetle";
  Archetype2["NICKIT"] = "Nickit";
  Archetype2["THIEVUL"] = "Thievul";
  Archetype2["GOSSIFLEUR"] = "Gossifleur";
  Archetype2["ELDEGOSS"] = "Eldegoss";
  Archetype2["WOOLOO"] = "Wooloo";
  Archetype2["DUBWOOL"] = "Dubwool";
  Archetype2["CHEWTLE"] = "Chewtle";
  Archetype2["DREDNAW"] = "Drednaw";
  Archetype2["YAMPER"] = "Yamper";
  Archetype2["BOLTUND"] = "Boltund";
  Archetype2["ROLYCOLY"] = "Rolycoly";
  Archetype2["CARKOL"] = "Carkol";
  Archetype2["COALOSSAL"] = "Coalossal";
  Archetype2["APPLIN"] = "Applin";
  Archetype2["FLAPPLE"] = "Flapple";
  Archetype2["APPLETUN"] = "Appletun";
  Archetype2["SILICOBRA"] = "Silicobra";
  Archetype2["SANDACONDA"] = "Sandaconda";
  Archetype2["CRAMORANT"] = "Cramorant";
  Archetype2["ARROKUDA"] = "Arrokuda";
  Archetype2["BARRASKEWDA"] = "Barraskewda";
  Archetype2["TOXEL"] = "Toxel";
  Archetype2["TOXTRICITY"] = "Toxtricity";
  Archetype2["SIZZLIPEDE"] = "Sizzlipede";
  Archetype2["CENTISKORCH"] = "Centiskorch";
  Archetype2["CLOBBOPUS"] = "Clobbopus";
  Archetype2["GRAPPLOCT"] = "Grapploct";
  Archetype2["SINISTEA"] = "Sinistea";
  Archetype2["POLTEAGEIST"] = "Polteageist";
  Archetype2["HATENNA"] = "Hatenna";
  Archetype2["HATTREM"] = "Hattrem";
  Archetype2["HATTERENE"] = "Hatterene";
  Archetype2["IMPIDIMP"] = "Impidimp";
  Archetype2["MORGREM"] = "Morgrem";
  Archetype2["GRIMMSNARL"] = "Grimmsnarl";
  Archetype2["OBSTAGOON"] = "Obstagoon";
  Archetype2["PERRSERKER"] = "Perrserker";
  Archetype2["CURSOLA"] = "Cursola";
  Archetype2["SIRFETCHD"] = "Sirfetch'd";
  Archetype2["MR_RIME"] = "Mr. Rime";
  Archetype2["RUNERIGUS"] = "Runerigus";
  Archetype2["MILCERY"] = "Milcery";
  Archetype2["ALCREMIE"] = "Alcremie";
  Archetype2["FALINKS"] = "Falinks";
  Archetype2["PINCURCHIN"] = "Pincurchin";
  Archetype2["SNOM"] = "Snom";
  Archetype2["FROSMOTH"] = "Frosmoth";
  Archetype2["STONJOURNER"] = "Stonjourner";
  Archetype2["EISCUE"] = "Eiscue";
  Archetype2["INDEEDEE"] = "Indeedee";
  Archetype2["MORPEKO"] = "Morpeko";
  Archetype2["CUFANT"] = "Cufant";
  Archetype2["COPPERAJAH"] = "Copperajah";
  Archetype2["DRACOZOLT"] = "Dracozolt";
  Archetype2["ARCTOZOLT"] = "Arctozolt";
  Archetype2["DRACOVISH"] = "Dracovish";
  Archetype2["ARCTOVISH"] = "Arctovish";
  Archetype2["DURALUDON"] = "Duraludon";
  Archetype2["DREEPY"] = "Dreepy";
  Archetype2["DRAKLOAK"] = "Drakloak";
  Archetype2["DRAGAPULT"] = "Dragapult";
  Archetype2["ZAMAZENTA"] = "Zamazenta";
  Archetype2["ETERNATUS"] = "Eternatus";
  Archetype2["KUBFU"] = "Kubfu";
  Archetype2["URSHIFU"] = "Urshifu";
  Archetype2["ZARUDE"] = "Zarude";
  Archetype2["REGIELEKI"] = "Regieleki";
  Archetype2["REGIDRAGO"] = "Regidrago";
  Archetype2["GLASTRIER"] = "Glastrier";
  Archetype2["SPECTRIER"] = "Spectrier";
  Archetype2["CALYREX"] = "Calyrex";
  Archetype2["WYRDEER"] = "Wyrdeer";
  Archetype2["KLEAVOR"] = "Kleavor";
  Archetype2["URSALUNA"] = "Ursaluna";
  Archetype2["BASCULEGION"] = "Basculegion";
  Archetype2["SNEASLER"] = "Sneasler";
  Archetype2["OVERQWIL"] = "Overqwil";
  Archetype2["ENAMORUS"] = "Enamorus";
  Archetype2["SPRIGATITO"] = "Sprigatito";
  Archetype2["FLORAGATO"] = "Floragato";
  Archetype2["MEOWSCARADA"] = "Meowscarada";
  Archetype2["FUECOCO"] = "Fuecoco";
  Archetype2["CROCALOR"] = "Crocalor";
  Archetype2["SKELEDIRGE"] = "Skeledirge";
  Archetype2["QUAXLY"] = "Quaxly";
  Archetype2["QUAXWELL"] = "Quaxwell";
  Archetype2["QUAQUAVAL"] = "Quaquaval";
  Archetype2["LECHONK"] = "Lechonk";
  Archetype2["OINKOLOGNE"] = "Oinkologne";
  Archetype2["TAROUNTULA"] = "Tarountula";
  Archetype2["SPIDOPS"] = "Spidops";
  Archetype2["NYMBLE"] = "Nymble";
  Archetype2["LOKIX"] = "Lokix";
  Archetype2["PAWMI"] = "Pawmi";
  Archetype2["PAWMO"] = "Pawmo";
  Archetype2["PAWMOT"] = "Pawmot";
  Archetype2["TANDEMAUS"] = "Tandemaus";
  Archetype2["MAUSHOLD"] = "Maushold";
  Archetype2["FIDOUGH"] = "Fidough";
  Archetype2["DACHSBUN"] = "Dachsbun";
  Archetype2["SMOLIV"] = "Smoliv";
  Archetype2["DOLLIV"] = "Dolliv";
  Archetype2["ARBOLIVA"] = "Arboliva";
  Archetype2["SQUAWKABILLY"] = "Squawkabilly";
  Archetype2["NACLI"] = "Nacli";
  Archetype2["NACLSTACK"] = "Naclstack";
  Archetype2["GARGANACL"] = "Garganacl";
  Archetype2["CHARCADET"] = "Charcadet";
  Archetype2["ARMAROUGE"] = "Armarouge";
  Archetype2["TADBULB"] = "Tadbulb";
  Archetype2["WATTREL"] = "Wattrel";
  Archetype2["KILOWATTREL"] = "Kilowattrel";
  Archetype2["MASCHIFF"] = "Maschiff";
  Archetype2["MABOSSTIFF"] = "Mabosstiff";
  Archetype2["SHROODLE"] = "Shroodle";
  Archetype2["GRAFAIAI"] = "Grafaiai";
  Archetype2["BRAMBLIN"] = "Bramblin";
  Archetype2["BRAMBLEGHAST"] = "Brambleghast";
  Archetype2["TOEDSCOOL"] = "Toedscool";
  Archetype2["TOEDSCRUEL"] = "Toedscruel";
  Archetype2["CAPSAKID"] = "Capsakid";
  Archetype2["SCOVILLAIN"] = "Scovillain";
  Archetype2["RELLOR"] = "Rellor";
  Archetype2["RABSCA"] = "Rabsca";
  Archetype2["FLITTLE"] = "Flittle";
  Archetype2["ESPATHRA"] = "Espathra";
  Archetype2["TINKATINK"] = "Tinkatink";
  Archetype2["TINKATUFF"] = "Tinkatuff";
  Archetype2["TINKATON"] = "Tinkaton";
  Archetype2["WIGLETT"] = "Wiglett";
  Archetype2["WUGTRIO"] = "Wugtrio";
  Archetype2["BOMBIRDIER"] = "Bombirdier";
  Archetype2["FINIZEN"] = "Finizen";
  Archetype2["PALAFIN"] = "Palafin";
  Archetype2["VAROOM"] = "Varoom";
  Archetype2["REVAVROOM"] = "Revavroom";
  Archetype2["CYCLIZAR"] = "Cyclizar";
  Archetype2["ORTHWORM"] = "Orthworm";
  Archetype2["GLIMMET"] = "Glimmet";
  Archetype2["GLIMMORA"] = "Glimmora";
  Archetype2["GREAVARD"] = "Greavard";
  Archetype2["HOUNDSTONE"] = "Houndstone";
  Archetype2["FLAMIGO"] = "Flamigo";
  Archetype2["CETODDLE"] = "Cetoddle";
  Archetype2["CETITAN"] = "Cetitan";
  Archetype2["VELUZA"] = "Veluza";
  Archetype2["DONDOZO"] = "Dondozo";
  Archetype2["TATSUGIRI"] = "Tatsugiri";
  Archetype2["ANNIHILAPE"] = "Annihilape";
  Archetype2["CLODSIRE"] = "Clodsire";
  Archetype2["FARIGIRAF"] = "Farigiraf";
  Archetype2["DUDUNSPARCE"] = "Dudunsparce";
  Archetype2["KINGAMBIT"] = "Kingambit";
  Archetype2["GREAT_TUSK"] = "Great Tusk";
  Archetype2["SCREAM_TAIL"] = "Scream Tail";
  Archetype2["BRUTE_BONNET"] = "Brute Bonnet";
  Archetype2["FLUTTER_MANE"] = "Flutter Mane";
  Archetype2["SLITHER_WING"] = "Slither Wing";
  Archetype2["IRON_TREADS"] = "Iron Treads";
  Archetype2["IRON_BUNDLE"] = "Iron Bundle";
  Archetype2["IRON_HANDS"] = "Iron Hands";
  Archetype2["IRON_JUGULIS"] = "Iron Jugulis";
  Archetype2["IRON_MOTH"] = "Iron Moth";
  Archetype2["FRIGIBAX"] = "Frigibax";
  Archetype2["ARCTIBAX"] = "Arctibax";
  Archetype2["BAXCALIBUR"] = "Baxcalibur";
  Archetype2["GIMMIGHOUL"] = "Gimmighoul";
  Archetype2["GHOLDENGO"] = "Gholdengo";
  Archetype2["CHIEN_PAO"] = "Chien-Pao";
  Archetype2["WO_CHIEN"] = "Wo-Chien";
  Archetype2["TING_LU"] = "Ting-Lu";
  Archetype2["CHI_YU"] = "Chi-Yu";
  Archetype2["ROARING_MOON"] = "Roaring Moon";
  Archetype2["IRON_VALIANT"] = "Iron Valiant";
  Archetype2["KORAIDON"] = "Koraidon";
  Archetype2["MIRAIDON"] = "Miraidon";
  Archetype2["WALKING_WAKE"] = "Walking Wake";
  Archetype2["IRON_LEAVES"] = "Iron Leaves";
  Archetype2["DIPPLIN"] = "Dipplin";
  Archetype2["POLTCHAGEIST"] = "Poltchageist";
  Archetype2["SINISTCHA"] = "Sinistcha";
  Archetype2["OKIDOGI"] = "Okidogi";
  Archetype2["MUNKIDORI"] = "Munkidori";
  Archetype2["FEZANDIPITI"] = "Fezandipiti";
  Archetype2["OGERPON"] = "Ogerpon";
  Archetype2["ARCHALUDON"] = "Archaludon";
  Archetype2["HYDRAPPLE"] = "Hydrapple";
  Archetype2["GOUGING_FIRE"] = "Gouging Fire";
  Archetype2["RAGING_BOLT"] = "Raging Bolt";
  Archetype2["IRON_BOULDER"] = "Iron Boulder";
  Archetype2["IRON_CROWN"] = "Iron Crown";
  Archetype2["TERAPAGOS"] = "Terapagos";
  Archetype2["PECHARUNT"] = "Pecharunt";
})(Archetype || (Archetype = {}));
var CardType;
(function(CardType2) {
  CardType2[CardType2["ANY"] = 0] = "ANY";
  CardType2[CardType2["GRASS"] = 1] = "GRASS";
  CardType2[CardType2["FIRE"] = 2] = "FIRE";
  CardType2[CardType2["WATER"] = 3] = "WATER";
  CardType2[CardType2["LIGHTNING"] = 4] = "LIGHTNING";
  CardType2[CardType2["PSYCHIC"] = 5] = "PSYCHIC";
  CardType2[CardType2["FIGHTING"] = 6] = "FIGHTING";
  CardType2[CardType2["DARK"] = 7] = "DARK";
  CardType2[CardType2["METAL"] = 8] = "METAL";
  CardType2[CardType2["COLORLESS"] = 9] = "COLORLESS";
  CardType2[CardType2["FAIRY"] = 10] = "FAIRY";
  CardType2[CardType2["DRAGON"] = 11] = "DRAGON";
  CardType2[CardType2["NONE"] = 12] = "NONE";
  CardType2[CardType2["CHARIZARD_EX"] = 13] = "CHARIZARD_EX";
  CardType2[CardType2["PIDGEOT_EX"] = 14] = "PIDGEOT_EX";
  CardType2[CardType2["GIRATINA_VSTAR"] = 15] = "GIRATINA_VSTAR";
  CardType2[CardType2["ARCEUS_VSTAR"] = 16] = "ARCEUS_VSTAR";
  CardType2[CardType2["COMFEY"] = 17] = "COMFEY";
  CardType2[CardType2["SABLEYE"] = 18] = "SABLEYE";
  CardType2[CardType2["RAGING_BOLT_EX"] = 19] = "RAGING_BOLT_EX";
  CardType2[CardType2["SOLROCK"] = 20] = "SOLROCK";
  CardType2[CardType2["LUNATONE"] = 21] = "LUNATONE";
  CardType2[CardType2["KYUREM_VMAX"] = 22] = "KYUREM_VMAX";
  CardType2[CardType2["MURKROW"] = 23] = "MURKROW";
  CardType2[CardType2["FLAMIGO"] = 24] = "FLAMIGO";
  CardType2[CardType2["CHIEN_PAO_EX"] = 25] = "CHIEN_PAO_EX";
  CardType2[CardType2["BAXCALIBUR"] = 26] = "BAXCALIBUR";
  CardType2[CardType2["SNORLAX_STALL"] = 27] = "SNORLAX_STALL";
  CardType2[CardType2["LUGIA_VSTAR"] = 28] = "LUGIA_VSTAR";
  CardType2[CardType2["ABSOL_EX"] = 29] = "ABSOL_EX";
  CardType2[CardType2["THWACKEY"] = 30] = "THWACKEY";
  CardType2[CardType2["DIPPLIN"] = 31] = "DIPPLIN";
  CardType2[CardType2["PALKIA_VSTAR"] = 32] = "PALKIA_VSTAR";
  CardType2[CardType2["ROTOM_V"] = 33] = "ROTOM_V";
  CardType2[CardType2["BIBAREL"] = 34] = "BIBAREL";
  CardType2[CardType2["GHOLDENGO_EX"] = 35] = "GHOLDENGO_EX";
  CardType2[CardType2["SANDY_SHOCKS_EX"] = 36] = "SANDY_SHOCKS_EX";
  CardType2[CardType2["GARDEVOIR_EX"] = 37] = "GARDEVOIR_EX";
  CardType2[CardType2["XATU"] = 38] = "XATU";
  CardType2[CardType2["TEALMASK_OGERPON_EX"] = 39] = "TEALMASK_OGERPON_EX";
  CardType2[CardType2["LUXRAY_EX"] = 40] = "LUXRAY_EX";
  CardType2[CardType2["GRENINJA_EX"] = 41] = "GRENINJA_EX";
  CardType2[CardType2["BLISSEY_EX"] = 42] = "BLISSEY_EX";
  CardType2[CardType2["ROARING_MOON"] = 43] = "ROARING_MOON";
  CardType2[CardType2["KORAIDON"] = 44] = "KORAIDON";
  CardType2[CardType2["IRON_CROWN_EX"] = 45] = "IRON_CROWN_EX";
  CardType2[CardType2["CINCCINO"] = 46] = "CINCCINO";
  CardType2[CardType2["ARCHEOPS"] = 47] = "ARCHEOPS";
  CardType2[CardType2["MIRAIDON_EX"] = 48] = "MIRAIDON_EX";
  CardType2[CardType2["IRON_HANDS_EX"] = 49] = "IRON_HANDS_EX";
  CardType2[CardType2["DRAGAPULT_EX"] = 50] = "DRAGAPULT_EX";
  CardType2[CardType2["DRIFLOON"] = 51] = "DRIFLOON";
  CardType2[CardType2["FROSLASS"] = 52] = "FROSLASS";
  CardType2[CardType2["WLFM"] = 53] = "WLFM";
  CardType2[CardType2["GRW"] = 54] = "GRW";
  CardType2[CardType2["LPM"] = 55] = "LPM";
  CardType2[CardType2["FDY"] = 56] = "FDY";
  CardType2[CardType2["GRPD"] = 57] = "GRPD";
})(CardType || (CardType = {}));
var SpecialCondition;
(function(SpecialCondition2) {
  SpecialCondition2[SpecialCondition2["PARALYZED"] = 0] = "PARALYZED";
  SpecialCondition2[SpecialCondition2["CONFUSED"] = 1] = "CONFUSED";
  SpecialCondition2[SpecialCondition2["ASLEEP"] = 2] = "ASLEEP";
  SpecialCondition2[SpecialCondition2["POISONED"] = 3] = "POISONED";
  SpecialCondition2[SpecialCondition2["BURNED"] = 4] = "BURNED";
  SpecialCondition2[SpecialCondition2["ABILITY_USED"] = 5] = "ABILITY_USED";
  SpecialCondition2[SpecialCondition2["POWER_GLOW"] = 6] = "POWER_GLOW";
})(SpecialCondition || (SpecialCondition = {}));
var BoardEffect;
(function(BoardEffect2) {
  BoardEffect2[BoardEffect2["ABILITY_USED"] = 0] = "ABILITY_USED";
  BoardEffect2[BoardEffect2["POWER_GLOW"] = 1] = "POWER_GLOW";
  BoardEffect2[BoardEffect2["POWER_NEGATED_GLOW"] = 2] = "POWER_NEGATED_GLOW";
  BoardEffect2[BoardEffect2["POWER_RETURN"] = 3] = "POWER_RETURN";
  BoardEffect2[BoardEffect2["EVOLVE"] = 4] = "EVOLVE";
  BoardEffect2[BoardEffect2["REVEAL_OPPONENT_HAND"] = 5] = "REVEAL_OPPONENT_HAND";
})(BoardEffect || (BoardEffect = {}));
var Format;
(function(Format2) {
  Format2[Format2["NONE"] = 0] = "NONE";
  Format2[Format2["STANDARD"] = 1] = "STANDARD";
  Format2[Format2["EXPANDED"] = 2] = "EXPANDED";
  Format2[Format2["UNLIMITED"] = 3] = "UNLIMITED";
  Format2[Format2["RETRO"] = 4] = "RETRO";
  Format2[Format2["GLC"] = 5] = "GLC";
  Format2[Format2["STANDARD_NIGHTLY"] = 6] = "STANDARD_NIGHTLY";
  Format2[Format2["BW"] = 7] = "BW";
  Format2[Format2["XY"] = 8] = "XY";
  Format2[Format2["SM"] = 9] = "SM";
  Format2[Format2["SWSH"] = 10] = "SWSH";
  Format2[Format2["SV"] = 11] = "SV";
  Format2[Format2["WORLDS_2013"] = 12] = "WORLDS_2013";
})(Format || (Format = {}));
var Energy = {
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

// ../ptcg-server/dist/game/store/state/card-list.js
var StadiumDirection;
(function(StadiumDirection2) {
  StadiumDirection2["UP"] = "up";
  StadiumDirection2["DOWN"] = "down";
})(StadiumDirection || (StadiumDirection = {}));
var CardList = class _CardList {
  constructor() {
    this.cards = [];
    this.isPublic = false;
    this.isSecret = false;
    this.faceUpPrize = false;
    this.stadiumDirection = StadiumDirection.UP;
    this.markedAsNotSecret = false;
  }
  static fromList(names) {
    const cardList = new _CardList();
    const cardManager = CardManager.getInstance();
    cardList.cards = names.map((cardName) => {
      const card = cardManager.getCardByName(cardName);
      if (card === void 0) {
        throw new GameError(GameMessage.UNKNOWN_CARD, cardName);
      }
      return card;
    });
    return cardList;
  }
  applyOrder(order) {
    if (this.cards.length !== order.length) {
      return;
    }
    const orderCopy = order.slice();
    orderCopy.sort((a, b) => a - b);
    for (let i = 0; i < orderCopy.length; i++) {
      if (i !== orderCopy[i]) {
        return;
      }
    }
    const copy = this.cards.slice();
    for (let i = 0; i < order.length; i++) {
      this.cards[i] = copy[order[i]];
    }
  }
  moveTo(destination, count) {
    if (count === void 0) {
      count = this.cards.length;
    }
    count = Math.min(count, this.cards.length);
    const cards = this.cards.splice(0, count);
    destination.cards.push(...cards);
  }
  moveCardsTo(cards, destination) {
    for (let i = 0; i < cards.length; i++) {
      const index = this.cards.indexOf(cards[i]);
      if (index !== -1) {
        const card = this.cards.splice(index, 1);
        if ("energyCards" in this) {
          const pokemonList = this;
          if (typeof pokemonList.removePokemonAsEnergy === "function") {
            pokemonList.removePokemonAsEnergy(card[0]);
          }
        }
        destination.cards.push(card[0]);
      }
    }
  }
  moveCardTo(card, destination) {
    this.moveCardsTo([card], destination);
  }
  moveToTopOfDestination(destination) {
    destination.cards = [...this.cards, ...destination.cards];
  }
  filter(query) {
    return this.cards.filter((c) => {
      for (const key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          const value = c[key];
          const expected = query[key];
          if (value !== expected) {
            return false;
          }
        }
      }
      return true;
    });
  }
  count(query) {
    return this.filter(query).length;
  }
  sort(superType = SuperType.POKEMON) {
    this.cards.sort((a, b) => {
      const result = this.compareSupertype(a.superType) - this.compareSupertype(b.superType);
      if (result !== 0) {
        return result;
      }
      if (a.trainerType != null) {
        const cardA = a;
        if (cardA.trainerType != null && b.trainerType != null) {
          const cardB = b;
          const subtypeCompare = this.compareTrainerType(cardA.trainerType) - this.compareTrainerType(cardB.trainerType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      } else if (a.energyType != null) {
        const cardA = a;
        if (cardA.energyType != null && b.energyType != null) {
          const cardB = b;
          const subtypeCompare = this.compareEnergyType(cardA.energyType) - this.compareEnergyType(cardB.energyType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  compareSupertype(input) {
    if (input === SuperType.POKEMON)
      return 1;
    if (input === SuperType.TRAINER)
      return 2;
    if (input === SuperType.ENERGY)
      return 3;
    return Infinity;
  }
  compareTrainerType(input) {
    if (input === TrainerType.SUPPORTER)
      return 1;
    if (input === TrainerType.ITEM)
      return 2;
    if (input === TrainerType.TOOL)
      return 3;
    if (input === TrainerType.STADIUM)
      return 4;
    return Infinity;
  }
  compareEnergyType(input) {
    if (input === EnergyType.BASIC)
      return 1;
    if (input === EnergyType.SPECIAL)
      return 2;
    return Infinity;
  }
};

// ../ptcg-server/dist/game/store/state/card-marker.js
var Marker = class {
  constructor() {
    this.markers = [];
  }
  hasMarker(name, source) {
    if (source === void 0) {
      return this.markers.some((c) => c.name === name);
    }
    return this.markers.some((c) => c.source === source && c.name === name);
  }
  removeMarker(name, source) {
    if (!this.hasMarker(name, source)) {
      return;
    }
    if (source === void 0) {
      this.markers = this.markers.filter((c) => c.name !== name);
      return;
    }
    this.markers = this.markers.filter((c) => c.source !== source || c.name !== name);
  }
  addMarker(name, source) {
    if (this.hasMarker(name, source)) {
      return;
    }
    this.markers.push({ name, source });
  }
  addMarkerToState(name) {
    if (this.hasMarker(name)) {
      return;
    }
    this.markers.push({ name });
  }
};

// ../ptcg-server/dist/game/store/card/card.js
var Card = class {
  constructor() {
    this.id = -1;
    this.regulationMark = "";
    this.tags = [];
    this.setNumber = "";
    this.cardImage = "";
    this.retreat = [];
    this.attacks = [];
    this.powers = [];
    this.cards = new CardList();
    this.marker = new Marker();
  }
  reduceEffect(store, state, effect) {
    return state;
  }
};

// ../ptcg-server/dist/game/store/card/energy-card.js
var EnergyCard = class extends Card {
  constructor() {
    super(...arguments);
    this.superType = SuperType.ENERGY;
    this.energyType = EnergyType.BASIC;
    this.format = Format.NONE;
    this.provides = [];
    this.text = "";
    this.isBlocked = false;
    this.blendedEnergies = [];
  }
};

// ../ptcg-server/dist/game/store/card/pokemon-card.js
var PokemonCard = class extends Card {
  constructor() {
    super(...arguments);
    this.superType = SuperType.POKEMON;
    this.cardType = CardType.NONE;
    this.cardTag = [];
    this.pokemonType = PokemonType.NORMAL;
    this.evolvesFrom = "";
    this.stage = Stage.BASIC;
    this.retreat = [];
    this.hp = 0;
    this.weakness = [];
    this.resistance = [];
    this.powers = [];
    this.attacks = [];
    this.format = Format.NONE;
    this.marker = new Marker();
    this.movedToActiveThisTurn = false;
    this.tools = [];
    this.archetype = [];
  }
};

// ../ptcg-server/dist/game/cards/deck-analyser.js
var DeckAnalyser = class {
  constructor(cardNames = []) {
    this.cardNames = cardNames;
    const cardManager = CardManager.getInstance();
    this.cards = [];
    cardNames.forEach((name) => {
      const card = cardManager.getCardByName(name);
      if (card !== void 0) {
        this.cards.push(card);
      }
    });
  }
  isValid() {
    const countMap = {};
    const prismStarCards = /* @__PURE__ */ new Set();
    let hasBasicPokemon = false;
    let hasAceSpec = false;
    let hasRadiant = false;
    let hasStar = false;
    let hasUnownTag = false;
    let unownCount = 0;
    let hasArceusRule = false;
    let arceusRuleCount = 0;
    let arceusCount = 0;
    if (this.cards.length !== 60) {
      return false;
    }
    const cardSet = new Set(this.cards.map((c) => c.name));
    if (cardSet.has("Professor Sycamore") && cardSet.has("Professor Juniper") || cardSet.has("Professor Juniper") && cardSet.has("Professor's Research") || cardSet.has("Professor Sycamore") && cardSet.has("Professor's Research") || cardSet.has("Lysandre") && cardSet.has("Boss's Orders")) {
      return false;
    }
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      if (card instanceof PokemonCard && card.stage === Stage.BASIC) {
        hasBasicPokemon = true;
      }
      if (card.tags.includes(CardTag.UNOWN)) {
        hasUnownTag = true;
      }
      if (card.name.includes("Unown")) {
        unownCount++;
      }
      if (card.tags.includes(CardTag.ARCEUS)) {
        hasArceusRule = true;
      }
      if (card.name === "Arceus") {
        arceusCount++;
        if (card.tags.includes(CardTag.ARCEUS)) {
          arceusRuleCount++;
        }
      }
      if (!(card instanceof EnergyCard) || card.energyType !== EnergyType.BASIC) {
        countMap[card.name] = (countMap[card.name] || 0) + 1;
        if (countMap[card.name] > 4 && (!hasArceusRule || arceusCount !== arceusRuleCount)) {
          return false;
        }
      }
      if (card.tags.includes(CardTag.ACE_SPEC)) {
        if (hasAceSpec) {
          return false;
        }
        hasAceSpec = true;
      }
      if (card.tags.includes(CardTag.RADIANT)) {
        if (hasRadiant) {
          return false;
        }
        hasRadiant = true;
      }
      if (card.tags.includes(CardTag.STAR)) {
        if (hasStar) {
          return false;
        }
        hasStar = true;
      }
      if (card.tags.includes(CardTag.PRISM_STAR)) {
        if (prismStarCards.has(card.name)) {
          return false;
        }
        prismStarCards.add(card.name);
      }
    }
    if (hasUnownTag && unownCount > 4) {
      return false;
    }
    if (hasArceusRule && arceusCount !== arceusRuleCount) {
      return false;
    }
    return hasBasicPokemon;
  }
  getDeckType() {
    const cardTypes = [];
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      let cardType = CardType.NONE;
      if (card instanceof PokemonCard) {
        cardType = card.cardType;
        if (cardType !== CardType.NONE && cardTypes.indexOf(cardType) === -1) {
          cardTypes.push(cardType);
        }
      }
    }
    return cardTypes;
  }
};

// ../ptcg-server/dist/game/store/state/rules.js
var Rules = class {
  constructor(init = {}) {
    this.firstTurnDrawCard = true;
    this.firstTurnUseSupporter = true;
    this.attackFirstTurn = false;
    this.unlimitedEnergyAttachments = false;
    Object.assign(this, init);
  }
};

// ../ptcg-server/dist/game/core/game-settings.js
var GameSettings = class {
  constructor() {
    this.rules = new Rules();
    this.timeLimit = 900;
    this.recordingEnabled = true;
    this.format = Format.STANDARD;
  }
};

// ../ptcg-server/node_modules/@progress/pako-esm/dist/pako-esm5.js
var Z_NO_FLUSH = 0;
var Z_PARTIAL_FLUSH = 1;
var Z_SYNC_FLUSH = 2;
var Z_FULL_FLUSH = 3;
var Z_FINISH = 4;
var Z_BLOCK = 5;
var Z_OK = 0;
var Z_STREAM_END = 1;
var Z_NEED_DICT = 2;
var Z_STREAM_ERROR = -2;
var Z_DATA_ERROR = -3;
var Z_BUF_ERROR = -5;
var Z_DEFAULT_COMPRESSION = -1;
var Z_FILTERED = 1;
var Z_HUFFMAN_ONLY = 2;
var Z_RLE = 3;
var Z_FIXED = 4;
var Z_DEFAULT_STRATEGY = 0;
var Z_BINARY = 0;
var Z_TEXT = 1;
var Z_UNKNOWN = 2;
var Z_DEFLATED = 8;
function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
function assign(obj) {
  var sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    var source = sources.shift();
    if (!source) {
      continue;
    }
    if (typeof source !== "object") {
      throw new TypeError(source + "must be non-object");
    }
    for (var p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }
  return obj;
}
function shrinkBuf(buf, size) {
  if (buf.length === size) {
    return buf;
  }
  if (buf.subarray) {
    return buf.subarray(0, size);
  }
  buf.length = size;
  return buf;
}
var fnTyped = {
  arraySet: function(dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function(chunks) {
    var i, l, len, pos, chunk, result;
    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  },
  Buf8: function(size) {
    return new Uint8Array(size);
  },
  Buf16: function(size) {
    return new Uint16Array(size);
  },
  Buf32: function(size) {
    return new Int32Array(size);
  }
};
var fnUntyped = {
  arraySet: function(dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) {
      dest[dest_offs + i] = src[src_offs + i];
    }
  },
  // Join array of chunks to single array.
  flattenChunks: function(chunks) {
    return [].concat.apply([], chunks);
  },
  Buf8: function(size) {
    return new Array(size);
  },
  Buf16: function(size) {
    return new Array(size);
  },
  Buf32: function(size) {
    return new Array(size);
  }
};
var typedOK = function() {
  var supported = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Int32Array !== "undefined";
  typedOK = function() {
    return supported;
  };
  return supported;
};
var arraySet = function(dest, src, src_offs, len, dest_offs) {
  arraySet = typedOK() ? fnTyped.arraySet : fnUntyped.arraySet;
  return arraySet(dest, src, src_offs, len, dest_offs);
};
var flattenChunks = function(chunks) {
  flattenChunks = typedOK() ? fnTyped.flattenChunks : fnUntyped.flattenChunks;
  return flattenChunks(chunks);
};
var Buf8 = function(size) {
  Buf8 = typedOK() ? fnTyped.Buf8 : fnUntyped.Buf8;
  return Buf8(size);
};
var Buf16 = function(size) {
  Buf16 = typedOK() ? fnTyped.Buf16 : fnUntyped.Buf16;
  return Buf16(size);
};
var Buf32 = function(size) {
  Buf32 = typedOK() ? fnTyped.Buf32 : fnUntyped.Buf32;
  return Buf32(size);
};
var strApplyOK = function() {
  var result = true;
  try {
    String.fromCharCode.apply(null, [0]);
  } catch (_) {
    result = false;
  }
  strApplyOK = function() {
    return result;
  };
  return result;
};
var strApplyUintOK = function() {
  var result = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (_) {
    result = false;
  }
  strApplyUintOK = function() {
    return result;
  };
  return result;
};
var utf8len = function(c) {
  var table = Buf8(256);
  for (var q = 0; q < 256; q++) {
    table[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  table[254] = table[254] = 1;
  utf8len = function(arg) {
    return table[arg];
  };
  return table[c];
};
function string2buf(str) {
  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 64512) === 56320) {
        c = 65536 + (c - 55296 << 10) + (c2 - 56320);
        m_pos++;
      }
    }
    buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
  }
  buf = new Uint8Array(buf_len);
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 64512) === 56320) {
        c = 65536 + (c - 55296 << 10) + (c2 - 56320);
        m_pos++;
      }
    }
    if (c < 128) {
      buf[i++] = c;
    } else if (c < 2048) {
      buf[i++] = 192 | c >>> 6;
      buf[i++] = 128 | c & 63;
    } else if (c < 65536) {
      buf[i++] = 224 | c >>> 12;
      buf[i++] = 128 | c >>> 6 & 63;
      buf[i++] = 128 | c & 63;
    } else {
      buf[i++] = 240 | c >>> 18;
      buf[i++] = 128 | c >>> 12 & 63;
      buf[i++] = 128 | c >>> 6 & 63;
      buf[i++] = 128 | c & 63;
    }
  }
  return buf;
}
function _buf2binstring(buf, len) {
  if (len < 65534) {
    if (buf.subarray && strApplyUintOK() || !buf.subarray && strApplyOK()) {
      return String.fromCharCode.apply(null, shrinkBuf(buf, len));
    }
  }
  var result = "";
  for (var i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}
function buf2binstring(buf) {
  return _buf2binstring(buf, buf.length);
}
function binstring2buf(str) {
  var buf = new Uint8Array(str.length);
  for (var i = 0, len = buf.length; i < len; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
}
function buf2string(buf, max) {
  var i, out, c, c_len;
  var len = max || buf.length;
  var utf16buf = new Array(len * 2);
  for (out = 0, i = 0; i < len; ) {
    c = buf[i++];
    if (c < 128) {
      utf16buf[out++] = c;
      continue;
    }
    c_len = utf8len(c);
    if (c_len > 4) {
      utf16buf[out++] = 65533;
      i += c_len - 1;
      continue;
    }
    c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
    while (c_len > 1 && i < len) {
      c = c << 6 | buf[i++] & 63;
      c_len--;
    }
    if (c_len > 1) {
      utf16buf[out++] = 65533;
      continue;
    }
    if (c < 65536) {
      utf16buf[out++] = c;
    } else {
      c -= 65536;
      utf16buf[out++] = 55296 | c >> 10 & 1023;
      utf16buf[out++] = 56320 | c & 1023;
    }
  }
  return _buf2binstring(utf16buf, out);
}
function utf8border(buf, max) {
  var pos;
  max = max || buf.length;
  if (max > buf.length) {
    max = buf.length;
  }
  pos = max - 1;
  while (pos >= 0 && (buf[pos] & 192) === 128) {
    pos--;
  }
  if (pos < 0) {
    return max;
  }
  if (pos === 0) {
    return max;
  }
  return pos + utf8len(buf[pos]) > max ? pos : max;
}
function adler32(adler, buf, len, pos) {
  var s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
  while (len !== 0) {
    n = len > 2e3 ? 2e3 : len;
    len -= n;
    do {
      s1 = s1 + buf[pos++] | 0;
      s2 = s2 + s1 | 0;
    } while (--n);
    s1 %= 65521;
    s2 %= 65521;
  }
  return s1 | s2 << 16 | 0;
}
function makeTable() {
  var c, table = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}
var crcTable = function() {
  var table = makeTable();
  crcTable = function() {
    return table;
  };
  return table;
};
function crc32(crc, buf, len, pos) {
  var t = crcTable(), end = pos + len;
  crc ^= -1;
  for (var i = pos; i < end; i++) {
    crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
  }
  return crc ^ -1;
}
var BAD = 30;
var TYPE = 12;
function inflate_fast(strm, start) {
  var state;
  var _in;
  var last;
  var _out;
  var beg;
  var end;
  var dmax;
  var wsize;
  var whave;
  var wnext;
  var s_window;
  var hold;
  var bits;
  var lcode;
  var dcode;
  var lmask;
  var dmask;
  var here;
  var op;
  var len;
  var dist;
  var from;
  var from_source;
  var input, output;
  state = strm.state;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
  dmax = state.dmax;
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;
  top:
    do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }
      here = lcode[hold & lmask];
      dolen:
        for (; ; ) {
          op = here >>> 24;
          hold >>>= op;
          bits -= op;
          op = here >>> 16 & 255;
          if (op === 0) {
            output[_out++] = here & 65535;
          } else if (op & 16) {
            len = here & 65535;
            op &= 15;
            if (op) {
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
              len += hold & (1 << op) - 1;
              hold >>>= op;
              bits -= op;
            }
            if (bits < 15) {
              hold += input[_in++] << bits;
              bits += 8;
              hold += input[_in++] << bits;
              bits += 8;
            }
            here = dcode[hold & dmask];
            dodist:
              for (; ; ) {
                op = here >>> 24;
                hold >>>= op;
                bits -= op;
                op = here >>> 16 & 255;
                if (op & 16) {
                  dist = here & 65535;
                  op &= 15;
                  if (bits < op) {
                    hold += input[_in++] << bits;
                    bits += 8;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                    }
                  }
                  dist += hold & (1 << op) - 1;
                  if (dist > dmax) {
                    strm.msg = "invalid distance too far back";
                    state.mode = BAD;
                    break top;
                  }
                  hold >>>= op;
                  bits -= op;
                  op = _out - beg;
                  if (dist > op) {
                    op = dist - op;
                    if (op > whave) {
                      if (state.sane) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break top;
                      }
                    }
                    from = 0;
                    from_source = s_window;
                    if (wnext === 0) {
                      from += wsize - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    } else if (wnext < op) {
                      from += wsize + wnext - op;
                      op -= wnext;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = 0;
                        if (wnext < len) {
                          op = wnext;
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                    } else {
                      from += wnext - op;
                      if (op < len) {
                        len -= op;
                        do {
                          output[_out++] = s_window[from++];
                        } while (--op);
                        from = _out - dist;
                        from_source = output;
                      }
                    }
                    while (len > 2) {
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      output[_out++] = from_source[from++];
                      len -= 3;
                    }
                    if (len) {
                      output[_out++] = from_source[from++];
                      if (len > 1) {
                        output[_out++] = from_source[from++];
                      }
                    }
                  } else {
                    from = _out - dist;
                    do {
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      output[_out++] = output[from++];
                      len -= 3;
                    } while (len > 2);
                    if (len) {
                      output[_out++] = output[from++];
                      if (len > 1) {
                        output[_out++] = output[from++];
                      }
                    }
                  }
                } else if ((op & 64) === 0) {
                  here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                  continue dodist;
                } else {
                  strm.msg = "invalid distance code";
                  state.mode = BAD;
                  break top;
                }
                break;
              }
          } else if ((op & 64) === 0) {
            here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
            continue dolen;
          } else if (op & 32) {
            state.mode = TYPE;
            break top;
          } else {
            strm.msg = "invalid literal/length code";
            state.mode = BAD;
            break top;
          }
          break;
        }
    } while (_in < last && _out < end);
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
  strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  return;
}
var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
var CODES = 0;
var LENS = 1;
var DISTS = 2;
var lbase = [
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
];
var lext = [
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
];
var dbase = [
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
];
var dext = [
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
];
function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts) {
  var bits = opts.bits;
  var len = 0;
  var sym = 0;
  var min = 0, max = 0;
  var root = 0;
  var curr = 0;
  var drop = 0;
  var left = 0;
  var used = 0;
  var huff = 0;
  var incr;
  var fill;
  var low;
  var mask;
  var next;
  var base = null;
  var base_index = 0;
  var end;
  var count = Buf16(MAXBITS + 1);
  var offs = Buf16(MAXBITS + 1);
  var extra = null;
  var extra_index = 0;
  var here_bits, here_op, here_val;
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) {
      break;
    }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    table[table_index++] = 1 << 24 | 64 << 16 | 0;
    opts.bits = 1;
    return 0;
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) {
      break;
    }
  }
  if (root < min) {
    root = min;
  }
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;
  }
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }
  if (type === CODES) {
    base = extra = work;
    end = 19;
  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;
  } else {
    base = dbase;
    extra = dext;
    end = -1;
  }
  huff = 0;
  sym = 0;
  len = min;
  next = table_index;
  curr = root;
  drop = 0;
  low = -1;
  used = 1 << root;
  mask = used - 1;
  if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
    return 1;
  }
  for (; ; ) {
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    } else {
      here_op = 32 + 64;
      here_val = 0;
    }
    incr = 1 << len - drop;
    fill = 1 << curr;
    min = fill;
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
    } while (fill !== 0);
    incr = 1 << len - 1;
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }
    sym++;
    if (--count[len] === 0) {
      if (len === max) {
        break;
      }
      len = lens[lens_index + work[sym]];
    }
    if (len > root && (huff & mask) !== low) {
      if (drop === 0) {
        drop = root;
      }
      next += min;
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) {
          break;
        }
        curr++;
        left <<= 1;
      }
      used += 1 << curr;
      if (type === LENS && used > ENOUGH_LENS || type === DISTS && used > ENOUGH_DISTS) {
        return 1;
      }
      low = huff & mask;
      table[low] = root << 24 | curr << 16 | next - table_index | 0;
    }
  }
  if (huff !== 0) {
    table[next + huff] = len - drop << 24 | 64 << 16 | 0;
  }
  opts.bits = root;
  return 0;
}
var CODES$1 = 0;
var LENS$1 = 1;
var DISTS$1 = 2;
var Z_FINISH$1 = 4;
var Z_BLOCK$1 = 5;
var Z_TREES$1 = 6;
var Z_OK$1 = 0;
var Z_STREAM_END$1 = 1;
var Z_NEED_DICT$1 = 2;
var Z_STREAM_ERROR$1 = -2;
var Z_DATA_ERROR$1 = -3;
var Z_MEM_ERROR = -4;
var Z_BUF_ERROR$1 = -5;
var Z_DEFLATED$1 = 8;
var HEAD = 1;
var FLAGS = 2;
var TIME = 3;
var OS = 4;
var EXLEN = 5;
var EXTRA = 6;
var NAME = 7;
var COMMENT = 8;
var HCRC = 9;
var DICTID = 10;
var DICT = 11;
var TYPE$1 = 12;
var TYPEDO = 13;
var STORED = 14;
var COPY_ = 15;
var COPY = 16;
var TABLE = 17;
var LENLENS = 18;
var CODELENS = 19;
var LEN_ = 20;
var LEN = 21;
var LENEXT = 22;
var DIST = 23;
var DISTEXT = 24;
var MATCH = 25;
var LIT = 26;
var CHECK = 27;
var LENGTH = 28;
var DONE = 29;
var BAD$1 = 30;
var MEM = 31;
var SYNC = 32;
var ENOUGH_LENS$1 = 852;
var ENOUGH_DISTS$1 = 592;
function zswap32(q) {
  return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
}
function InflateState() {
  this.mode = 0;
  this.last = false;
  this.wrap = 0;
  this.havedict = false;
  this.flags = 0;
  this.dmax = 0;
  this.check = 0;
  this.total = 0;
  this.head = null;
  this.wbits = 0;
  this.wsize = 0;
  this.whave = 0;
  this.wnext = 0;
  this.window = null;
  this.hold = 0;
  this.bits = 0;
  this.length = 0;
  this.offset = 0;
  this.extra = 0;
  this.lencode = null;
  this.distcode = null;
  this.lenbits = 0;
  this.distbits = 0;
  this.ncode = 0;
  this.nlen = 0;
  this.ndist = 0;
  this.have = 0;
  this.next = null;
  this.lens = Buf16(320);
  this.work = Buf16(288);
  this.lendyn = null;
  this.distdyn = null;
  this.sane = 0;
  this.back = 0;
  this.was = 0;
}
function inflateResetKeep(strm) {
  var state;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = "";
  if (state.wrap) {
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null;
  state.hold = 0;
  state.bits = 0;
  state.lencode = state.lendyn = Buf32(ENOUGH_LENS$1);
  state.distcode = state.distdyn = Buf32(ENOUGH_DISTS$1);
  state.sane = 1;
  state.back = -1;
  return Z_OK$1;
}
function inflateReset(strm) {
  var state;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
}
function inflateReset2(strm, windowBits) {
  var wrap;
  var state;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = (windowBits >> 4) + 1;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR$1;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}
function inflateInit2(strm, windowBits) {
  var ret;
  var state;
  if (!strm) {
    return Z_STREAM_ERROR$1;
  }
  state = new InflateState();
  strm.state = state;
  state.window = null;
  ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK$1) {
    strm.state = null;
  }
  return ret;
}
var virgin = true;
var lenfix;
var distfix;
function fixedtables(state) {
  if (virgin) {
    var sym;
    lenfix = Buf32(512);
    distfix = Buf32(32);
    sym = 0;
    while (sym < 144) {
      state.lens[sym++] = 8;
    }
    while (sym < 256) {
      state.lens[sym++] = 9;
    }
    while (sym < 280) {
      state.lens[sym++] = 7;
    }
    while (sym < 288) {
      state.lens[sym++] = 8;
    }
    inflate_table(LENS$1, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
    sym = 0;
    while (sym < 32) {
      state.lens[sym++] = 5;
    }
    inflate_table(DISTS$1, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
    virgin = false;
  }
  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}
function updatewindow(strm, src, end, copy) {
  var dist;
  var state = strm.state;
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;
    state.window = Buf8(state.wsize);
  }
  if (copy >= state.wsize) {
    arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    arraySet(state.window, src, end - copy, dist, state.wnext);
    copy -= dist;
    if (copy) {
      arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) {
        state.wnext = 0;
      }
      if (state.whave < state.wsize) {
        state.whave += dist;
      }
    }
  }
  return 0;
}
function inflate(strm, flush) {
  var state;
  var input, output;
  var next;
  var put;
  var have, left;
  var hold;
  var bits;
  var _in, _out;
  var copy;
  var from;
  var from_source;
  var here = 0;
  var here_bits, here_op, here_val;
  var last_bits, last_op, last_val;
  var len;
  var ret;
  var hbuf = Buf8(4);
  var opts;
  var n;
  var order = (
    /* permutation of code lengths */
    [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
  );
  if (!strm || !strm.state || !strm.output || !strm.input && strm.avail_in !== 0) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.mode === TYPE$1) {
    state.mode = TYPEDO;
  }
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  _in = have;
  _out = left;
  ret = Z_OK$1;
  inf_leave:
    for (; ; ) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.wrap & 2 && hold === 35615) {
            state.check = 0;
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32(state.check, hbuf, 2, 0);
            hold = 0;
            bits = 0;
            state.mode = FLAGS;
            break;
          }
          state.flags = 0;
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) || /* check if zlib header allowed */
          (((hold & 255) << 8) + (hold >> 8)) % 31) {
            strm.msg = "incorrect header check";
            state.mode = BAD$1;
            break;
          }
          if ((hold & 15) !== Z_DEFLATED$1) {
            strm.msg = "unknown compression method";
            state.mode = BAD$1;
            break;
          }
          hold >>>= 4;
          bits -= 4;
          len = (hold & 15) + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          } else if (len > state.wbits) {
            strm.msg = "invalid window size";
            state.mode = BAD$1;
            break;
          }
          state.dmax = 1 << len;
          strm.adler = state.check = 1;
          state.mode = hold & 512 ? DICTID : TYPE$1;
          hold = 0;
          bits = 0;
          break;
        case FLAGS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.flags = hold;
          if ((state.flags & 255) !== Z_DEFLATED$1) {
            strm.msg = "unknown compression method";
            state.mode = BAD$1;
            break;
          }
          if (state.flags & 57344) {
            strm.msg = "unknown header flags set";
            state.mode = BAD$1;
            break;
          }
          if (state.head) {
            state.head.text = hold >> 8 & 1;
          }
          if (state.flags & 512) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = TIME;
        case TIME:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.time = hold;
          }
          if (state.flags & 512) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            hbuf[2] = hold >>> 16 & 255;
            hbuf[3] = hold >>> 24 & 255;
            state.check = crc32(state.check, hbuf, 4, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = OS;
        case OS:
          while (bits < 16) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (state.head) {
            state.head.xflags = hold & 255;
            state.head.os = hold >> 8;
          }
          if (state.flags & 512) {
            hbuf[0] = hold & 255;
            hbuf[1] = hold >>> 8 & 255;
            state.check = crc32(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
          state.mode = EXLEN;
        case EXLEN:
          if (state.flags & 1024) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if (state.flags & 512) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
          } else if (state.head) {
            state.head.extra = null;
          }
          state.mode = EXTRA;
        case EXTRA:
          if (state.flags & 1024) {
            copy = state.length;
            if (copy > have) {
              copy = have;
            }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  state.head.extra = new Array(state.head.extra_len);
                }
                arraySet(
                  state.head.extra,
                  input,
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  copy,
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
              }
              if (state.flags & 512) {
                state.check = crc32(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) {
              break inf_leave;
            }
          }
          state.length = 0;
          state.mode = NAME;
        case NAME:
          if (state.flags & 2048) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
        case COMMENT:
          if (state.flags & 4096) {
            if (have === 0) {
              break inf_leave;
            }
            copy = 0;
            do {
              len = input[next + copy++];
              if (state.head && len && state.length < 65536) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if (state.flags & 512) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) {
              break inf_leave;
            }
          } else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
        case HCRC:
          if (state.flags & 512) {
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (hold !== (state.check & 65535)) {
              strm.msg = "header crc mismatch";
              state.mode = BAD$1;
              break;
            }
            hold = 0;
            bits = 0;
          }
          if (state.head) {
            state.head.hcrc = state.flags >> 9 & 1;
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE$1;
          break;
        case DICTID:
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          strm.adler = state.check = zswap32(hold);
          hold = 0;
          bits = 0;
          state.mode = DICT;
        case DICT:
          if (state.havedict === 0) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1;
          state.mode = TYPE$1;
        case TYPE$1:
          if (flush === Z_BLOCK$1 || flush === Z_TREES$1) {
            break inf_leave;
          }
        case TYPEDO:
          if (state.last) {
            hold >>>= bits & 7;
            bits -= bits & 7;
            state.mode = CHECK;
            break;
          }
          while (bits < 3) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.last = hold & 1;
          hold >>>= 1;
          bits -= 1;
          switch (hold & 3) {
            case 0:
              state.mode = STORED;
              break;
            case 1:
              fixedtables(state);
              state.mode = LEN_;
              if (flush === Z_TREES$1) {
                hold >>>= 2;
                bits -= 2;
                break inf_leave;
              }
              break;
            case 2:
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = "invalid block type";
              state.mode = BAD$1;
          }
          hold >>>= 2;
          bits -= 2;
          break;
        case STORED:
          hold >>>= bits & 7;
          bits -= bits & 7;
          while (bits < 32) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
            strm.msg = "invalid stored block lengths";
            state.mode = BAD$1;
            break;
          }
          state.length = hold & 65535;
          hold = 0;
          bits = 0;
          state.mode = COPY_;
          if (flush === Z_TREES$1) {
            break inf_leave;
          }
        case COPY_:
          state.mode = COPY;
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) {
              copy = have;
            }
            if (copy > left) {
              copy = left;
            }
            if (copy === 0) {
              break inf_leave;
            }
            arraySet(output, input, next, copy, put);
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          state.mode = TYPE$1;
          break;
        case TABLE:
          while (bits < 14) {
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.nlen = (hold & 31) + 257;
          hold >>>= 5;
          bits -= 5;
          state.ndist = (hold & 31) + 1;
          hold >>>= 5;
          bits -= 5;
          state.ncode = (hold & 15) + 4;
          hold >>>= 4;
          bits -= 4;
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = "too many length or distance symbols";
            state.mode = BAD$1;
            break;
          }
          state.have = 0;
          state.mode = LENLENS;
        case LENLENS:
          while (state.have < state.ncode) {
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.lens[order[state.have++]] = hold & 7;
            hold >>>= 3;
            bits -= 3;
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          state.lencode = state.lendyn;
          state.lenbits = 7;
          opts = { bits: state.lenbits };
          ret = inflate_table(CODES$1, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid code lengths set";
            state.mode = BAD$1;
            break;
          }
          state.have = 0;
          state.mode = CODELENS;
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_val < 16) {
              hold >>>= here_bits;
              bits -= here_bits;
              state.lens[state.have++] = here_val;
            } else {
              if (here_val === 16) {
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                if (state.have === 0) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD$1;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 3);
                hold >>>= 2;
                bits -= 2;
              } else if (here_val === 17) {
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 3 + (hold & 7);
                hold >>>= 3;
                bits -= 3;
              } else {
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) {
                    break inf_leave;
                  }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                hold >>>= here_bits;
                bits -= here_bits;
                len = 0;
                copy = 11 + (hold & 127);
                hold >>>= 7;
                bits -= 7;
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = "invalid bit length repeat";
                state.mode = BAD$1;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }
          if (state.mode === BAD$1) {
            break;
          }
          if (state.lens[256] === 0) {
            strm.msg = "invalid code -- missing end-of-block";
            state.mode = BAD$1;
            break;
          }
          state.lenbits = 9;
          opts = { bits: state.lenbits };
          ret = inflate_table(LENS$1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;
          if (ret) {
            strm.msg = "invalid literal/lengths set";
            state.mode = BAD$1;
            break;
          }
          state.distbits = 6;
          state.distcode = state.distdyn;
          opts = { bits: state.distbits };
          ret = inflate_table(DISTS$1, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          state.distbits = opts.bits;
          if (ret) {
            strm.msg = "invalid distances set";
            state.mode = BAD$1;
            break;
          }
          state.mode = LEN_;
          if (flush === Z_TREES$1) {
            break inf_leave;
          }
        case LEN_:
          state.mode = LEN;
        case LEN:
          if (have >= 6 && left >= 258) {
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            inflate_fast(strm, _out);
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            if (state.mode === TYPE$1) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (; ; ) {
            here = state.lencode[hold & (1 << state.lenbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (here_op && (here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            state.back = -1;
            state.mode = TYPE$1;
            break;
          }
          if (here_op & 64) {
            strm.msg = "invalid literal/length code";
            state.mode = BAD$1;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
        case LENEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.length += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          state.was = state.length;
          state.mode = DIST;
        case DIST:
          for (; ; ) {
            here = state.distcode[hold & (1 << state.distbits) - 1];
            here_bits = here >>> 24;
            here_op = here >>> 16 & 255;
            here_val = here & 65535;
            if (here_bits <= bits) {
              break;
            }
            if (have === 0) {
              break inf_leave;
            }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if ((here_op & 240) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (; ; ) {
              here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (last_bits + here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            hold >>>= last_bits;
            bits -= last_bits;
            state.back += last_bits;
          }
          hold >>>= here_bits;
          bits -= here_bits;
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = "invalid distance code";
            state.mode = BAD$1;
            break;
          }
          state.offset = here_val;
          state.extra = here_op & 15;
          state.mode = DISTEXT;
        case DISTEXT:
          if (state.extra) {
            n = state.extra;
            while (bits < n) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.offset += hold & (1 << state.extra) - 1;
            hold >>>= state.extra;
            bits -= state.extra;
            state.back += state.extra;
          }
          if (state.offset > state.dmax) {
            strm.msg = "invalid distance too far back";
            state.mode = BAD$1;
            break;
          }
          state.mode = MATCH;
        case MATCH:
          if (left === 0) {
            break inf_leave;
          }
          copy = _out - left;
          if (state.offset > copy) {
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = "invalid distance too far back";
                state.mode = BAD$1;
                break;
              }
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            } else {
              from = state.wnext - copy;
            }
            if (copy > state.length) {
              copy = state.length;
            }
            from_source = state.window;
          } else {
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) {
            copy = left;
          }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) {
            state.mode = LEN;
          }
          break;
        case LIT:
          if (left === 0) {
            break inf_leave;
          }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold |= input[next++] << bits;
              bits += 8;
            }
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if (_out) {
              strm.adler = state.check = /*UPDATE(state.check, put - _out, _out);*/
              state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out);
            }
            _out = left;
            if ((state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = "incorrect data check";
              state.mode = BAD$1;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = LENGTH;
        case LENGTH:
          if (state.wrap && state.flags) {
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (hold !== (state.total & 4294967295)) {
              strm.msg = "incorrect length check";
              state.mode = BAD$1;
              break;
            }
            hold = 0;
            bits = 0;
          }
          state.mode = DONE;
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD$1:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR;
        case SYNC:
        default:
          return Z_STREAM_ERROR$1;
      }
    }
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  if (state.wsize || _out !== strm.avail_out && state.mode < BAD$1 && (state.mode < CHECK || flush !== Z_FINISH$1)) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out) {
    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
    state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out);
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE$1 ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
    ret = Z_BUF_ERROR$1;
  }
  return ret;
}
function inflateEnd(strm) {
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  var state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK$1;
}
function inflateGetHeader(strm, head) {
  var state;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if ((state.wrap & 2) === 0) {
    return Z_STREAM_ERROR$1;
  }
  state.head = head;
  head.done = false;
  return Z_OK$1;
}
function inflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;
  var state;
  var dictid;
  var ret;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR$1;
  }
  state = strm.state;
  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR$1;
  }
  if (state.mode === DICT) {
    dictid = 1;
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR$1;
    }
  }
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  return Z_OK$1;
}
var msg = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
};
function ZStream() {
  this.input = null;
  this.next_in = 0;
  this.avail_in = 0;
  this.total_in = 0;
  this.output = null;
  this.next_out = 0;
  this.avail_out = 0;
  this.total_out = 0;
  this.msg = "";
  this.state = null;
  this.data_type = 2;
  this.adler = 0;
}
function GZheader() {
  this.text = 0;
  this.time = 0;
  this.xflags = 0;
  this.os = 0;
  this.extra = null;
  this.extra_len = 0;
  this.name = "";
  this.comment = "";
  this.hcrc = 0;
  this.done = false;
}
var toString = Object.prototype.toString;
var Inflate = function Inflate2(options) {
  if (!(this instanceof Inflate2)) {
    return new Inflate2(options);
  }
  this.options = assign({
    chunkSize: 16384,
    windowBits: 0,
    to: ""
  }, options || {});
  var opt = this.options;
  if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) {
      opt.windowBits = -15;
    }
  }
  if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
    opt.windowBits += 32;
  }
  if (opt.windowBits > 15 && opt.windowBits < 48) {
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new ZStream();
  this.strm.avail_out = 0;
  var status = inflateInit2(
    this.strm,
    opt.windowBits
  );
  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }
  this.header = new GZheader();
  inflateGetHeader(this.strm, this.header);
  if (opt.dictionary) {
    if (typeof opt.dictionary === "string") {
      opt.dictionary = string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) {
      status = inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
    }
  }
};
Inflate.prototype.push = function push(data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var dictionary = this.options.dictionary;
  var status, _mode;
  var next_out_utf8, tail, utf8str;
  var dict;
  var allowBufError = false;
  if (this.ended) {
    return false;
  }
  _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
  if (typeof data === "string") {
    strm.input = binstring2buf(data);
  } else if (toString.call(data) === "[object ArrayBuffer]") {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }
  strm.next_in = 0;
  strm.avail_in = strm.input.length;
  do {
    if (strm.avail_out === 0) {
      strm.output = Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = inflate(strm, Z_NO_FLUSH);
    if (status === Z_NEED_DICT && dictionary) {
      if (typeof dictionary === "string") {
        dict = string2buf(dictionary);
      } else if (toString.call(dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(dictionary);
      } else {
        dict = dictionary;
      }
      status = inflateSetDictionary(this.strm, dict);
    }
    if (status === Z_BUF_ERROR && allowBufError === true) {
      status = Z_OK;
      allowBufError = false;
    }
    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
        if (this.options.to === "string") {
          next_out_utf8 = utf8border(strm.output, strm.next_out);
          tail = strm.next_out - next_out_utf8;
          utf8str = buf2string(strm.output, next_out_utf8);
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) {
            arraySet(strm.output, strm.output, next_out_utf8, tail, 0);
          }
          this.onData(utf8str);
        } else {
          this.onData(shrinkBuf(strm.output, strm.next_out));
        }
      }
    }
    if (strm.avail_in === 0 && strm.avail_out === 0) {
      allowBufError = true;
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
  if (status === Z_STREAM_END) {
    _mode = Z_FINISH;
  }
  if (_mode === Z_FINISH) {
    status = inflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }
  return true;
};
Inflate.prototype.onData = function onData(chunk) {
  this.chunks.push(chunk);
};
Inflate.prototype.onEnd = function onEnd(status) {
  if (status === Z_OK) {
    if (this.options.to === "string") {
      this.result = this.chunks.join("");
    } else {
      this.result = flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};
function inflate$1(input, options) {
  var inflator = new Inflate(options);
  inflator.push(input, true);
  if (inflator.err) {
    throw inflator.msg || msg[inflator.err];
  }
  return inflator.result;
}
var ungzip = inflate$1;
function zero(buf) {
  var len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}
var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
var MIN_MATCH = 3;
var MAX_MATCH = 258;
var LENGTH_CODES = 29;
var LITERALS = 256;
var L_CODES = LITERALS + 1 + LENGTH_CODES;
var D_CODES = 30;
var BL_CODES = 19;
var HEAP_SIZE = 2 * L_CODES + 1;
var MAX_BITS = 15;
var Buf_size = 16;
var MAX_BL_BITS = 7;
var END_BLOCK = 256;
var REP_3_6 = 16;
var REPZ_3_10 = 17;
var REPZ_11_138 = 18;
var extra_lbits = (
  /* extra bits for each length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
);
var extra_dbits = (
  /* extra bits for each distance code */
  [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
);
var extra_blbits = (
  /* extra bits for each bit length code */
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
);
var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
var DIST_CODE_LEN = 512;
var static_ltree;
var static_dtree;
var _dist_code;
var _length_code;
var base_length;
var base_dist;
function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
  this.static_tree = static_tree;
  this.extra_bits = extra_bits;
  this.extra_base = extra_base;
  this.elems = elems;
  this.max_length = max_length;
  this.has_stree = static_tree && static_tree.length;
}
var static_l_desc;
var static_d_desc;
var static_bl_desc;
function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;
  this.max_code = 0;
  this.stat_desc = stat_desc;
}
function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}
function put_short(s, w) {
  s.pending_buf[s.pending++] = w & 255;
  s.pending_buf[s.pending++] = w >>> 8 & 255;
}
function send_bits(s, value, length) {
  if (s.bi_valid > Buf_size - length) {
    s.bi_buf |= value << s.bi_valid & 65535;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> Buf_size - s.bi_valid;
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= value << s.bi_valid & 65535;
    s.bi_valid += length;
  }
}
function send_code(s, c, tree) {
  send_bits(
    s,
    tree[c * 2],
    tree[c * 2 + 1]
    /*.Len*/
  );
}
function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}
function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;
  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 255;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}
function gen_bitlen(s, desc) {
  var tree = desc.dyn_tree;
  var max_code = desc.max_code;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var extra = desc.stat_desc.extra_bits;
  var base = desc.stat_desc.extra_base;
  var max_length = desc.stat_desc.max_length;
  var h;
  var n, m;
  var bits;
  var xbits;
  var f;
  var overflow = 0;
  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }
  tree[s.heap[s.heap_max] * 2 + 1] = 0;
  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1] = bits;
    if (n > max_code) {
      continue;
    }
    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2];
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1] + xbits);
    }
  }
  if (overflow === 0) {
    return;
  }
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) {
      bits--;
    }
    s.bl_count[bits]--;
    s.bl_count[bits + 1] += 2;
    s.bl_count[max_length]--;
    overflow -= 2;
  } while (overflow > 0);
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) {
        continue;
      }
      if (tree[m * 2 + 1] !== bits) {
        s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
        tree[m * 2 + 1] = bits;
      }
      n--;
    }
  }
}
function gen_codes(tree, max_code, bl_count) {
  var next_code = new Array(MAX_BITS + 1);
  var code = 0;
  var bits;
  var n;
  for (bits = 1; bits <= MAX_BITS; bits++) {
    next_code[bits] = code = code + bl_count[bits - 1] << 1;
  }
  for (n = 0; n <= max_code; n++) {
    var len = tree[n * 2 + 1];
    if (len === 0) {
      continue;
    }
    tree[n * 2] = bi_reverse(next_code[len]++, len);
  }
}
function tr_static_init() {
  var n;
  var bits;
  var length;
  var code;
  var dist;
  var bl_count = new Array(MAX_BITS + 1);
  static_ltree = new Array((L_CODES + 2) * 2);
  zero(static_ltree);
  static_dtree = new Array(D_CODES * 2);
  zero(static_dtree);
  _dist_code = new Array(DIST_CODE_LEN);
  zero(_dist_code);
  _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
  zero(_length_code);
  base_length = new Array(LENGTH_CODES);
  zero(base_length);
  base_dist = new Array(D_CODES);
  zero(base_dist);
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < 1 << extra_lbits[code]; n++) {
      _length_code[length++] = code;
    }
  }
  _length_code[length - 1] = code;
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < 1 << extra_dbits[code]; n++) {
      _dist_code[dist++] = code;
    }
  }
  dist >>= 7;
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }
  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1] = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1] = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1] = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1] = 8;
    n++;
    bl_count[8]++;
  }
  gen_codes(static_ltree, L_CODES + 1, bl_count);
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1] = 5;
    static_dtree[n * 2] = bi_reverse(n, 5);
  }
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
}
function init_block(s) {
  var n;
  for (n = 0; n < L_CODES; n++) {
    s.dyn_ltree[n * 2] = 0;
  }
  for (n = 0; n < D_CODES; n++) {
    s.dyn_dtree[n * 2] = 0;
  }
  for (n = 0; n < BL_CODES; n++) {
    s.bl_tree[n * 2] = 0;
  }
  s.dyn_ltree[END_BLOCK * 2] = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}
function bi_windup(s) {
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
}
function copy_block(s, buf, len, header) {
  bi_windup(s);
  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
  arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}
function smaller(tree, n, m, depth) {
  var _n2 = n * 2;
  var _m2 = m * 2;
  return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
}
function pqdownheap(s, tree, k) {
  var v = s.heap[k];
  var j = k << 1;
  while (j <= s.heap_len) {
    if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    if (smaller(tree, v, s.heap[j], s.depth)) {
      break;
    }
    s.heap[k] = s.heap[j];
    k = j;
    j <<= 1;
  }
  s.heap[k] = v;
}
function compress_block(s, ltree, dtree) {
  var dist;
  var lc;
  var lx = 0;
  var code;
  var extra;
  if (s.last_lit !== 0) {
    do {
      dist = s.pending_buf[s.d_buf + lx * 2] << 8 | s.pending_buf[s.d_buf + lx * 2 + 1];
      lc = s.pending_buf[s.l_buf + lx];
      lx++;
      if (dist === 0) {
        send_code(s, lc, ltree);
      } else {
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree);
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);
        }
        dist--;
        code = d_code(dist);
        send_code(s, code, dtree);
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);
        }
      }
    } while (lx < s.last_lit);
  }
  send_code(s, END_BLOCK, ltree);
}
function build_tree(s, desc) {
  var tree = desc.dyn_tree;
  var stree = desc.stat_desc.static_tree;
  var has_stree = desc.stat_desc.has_stree;
  var elems = desc.stat_desc.elems;
  var n, m;
  var max_code = -1;
  var node;
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;
  for (n = 0; n < elems; n++) {
    if (tree[n * 2] !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;
    } else {
      tree[n * 2 + 1] = 0;
    }
  }
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
    tree[node * 2] = 1;
    s.depth[node] = 0;
    s.opt_len--;
    if (has_stree) {
      s.static_len -= stree[node * 2 + 1];
    }
  }
  desc.max_code = max_code;
  for (n = s.heap_len >> 1; n >= 1; n--) {
    pqdownheap(s, tree, n);
  }
  node = elems;
  do {
    n = s.heap[
      1
      /*SMALLEST*/
    ];
    s.heap[
      1
      /*SMALLEST*/
    ] = s.heap[s.heap_len--];
    pqdownheap(
      s,
      tree,
      1
      /*SMALLEST*/
    );
    m = s.heap[
      1
      /*SMALLEST*/
    ];
    s.heap[--s.heap_max] = n;
    s.heap[--s.heap_max] = m;
    tree[node * 2] = tree[n * 2] + tree[m * 2];
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1] = tree[m * 2 + 1] = node;
    s.heap[
      1
      /*SMALLEST*/
    ] = node++;
    pqdownheap(
      s,
      tree,
      1
      /*SMALLEST*/
    );
  } while (s.heap_len >= 2);
  s.heap[--s.heap_max] = s.heap[
    1
    /*SMALLEST*/
  ];
  gen_bitlen(s, desc);
  gen_codes(tree, max_code, s.bl_count);
}
function scan_tree(s, tree, max_code) {
  var n;
  var prevlen = -1;
  var curlen;
  var nextlen = tree[0 * 2 + 1];
  var count = 0;
  var max_count = 7;
  var min_count = 4;
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1] = 65535;
  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1];
    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      s.bl_tree[curlen * 2] += count;
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        s.bl_tree[curlen * 2]++;
      }
      s.bl_tree[REP_3_6 * 2]++;
    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]++;
    } else {
      s.bl_tree[REPZ_11_138 * 2]++;
    }
    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}
function send_tree(s, tree, max_code) {
  var n;
  var prevlen = -1;
  var curlen;
  var nextlen = tree[0 * 2 + 1];
  var count = 0;
  var max_count = 7;
  var min_count = 4;
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1];
    if (++count < max_count && curlen === nextlen) {
      continue;
    } else if (count < min_count) {
      do {
        send_code(s, curlen, s.bl_tree);
      } while (--count !== 0);
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);
    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);
    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }
    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}
function build_bl_tree(s) {
  var max_blindex;
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
  build_tree(s, s.bl_desc);
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
      break;
    }
  }
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  return max_blindex;
}
function send_all_trees(s, lcodes, dcodes, blcodes) {
  var rank2;
  send_bits(s, lcodes - 257, 5);
  send_bits(s, dcodes - 1, 5);
  send_bits(s, blcodes - 4, 4);
  for (rank2 = 0; rank2 < blcodes; rank2++) {
    send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
  }
  send_tree(s, s.dyn_ltree, lcodes - 1);
  send_tree(s, s.dyn_dtree, dcodes - 1);
}
function detect_data_type(s) {
  var black_mask = 4093624447;
  var n;
  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
    if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
      return Z_BINARY;
    }
  }
  if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2] !== 0) {
      return Z_TEXT;
    }
  }
  return Z_BINARY;
}
var static_init_done = false;
function _tr_init(s) {
  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }
  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
  s.bi_buf = 0;
  s.bi_valid = 0;
  init_block(s);
}
function _tr_stored_block(s, buf, stored_len, last) {
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
  copy_block(s, buf, stored_len, true);
}
function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}
function _tr_flush_block(s, buf, stored_len, last) {
  var opt_lenb, static_lenb;
  var max_blindex = 0;
  if (s.level > 0) {
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }
    build_tree(s, s.l_desc);
    build_tree(s, s.d_desc);
    max_blindex = build_bl_tree(s);
    opt_lenb = s.opt_len + 3 + 7 >>> 3;
    static_lenb = s.static_len + 3 + 7 >>> 3;
    if (static_lenb <= opt_lenb) {
      opt_lenb = static_lenb;
    }
  } else {
    opt_lenb = static_lenb = stored_len + 5;
  }
  if (stored_len + 4 <= opt_lenb && buf !== -1) {
    _tr_stored_block(s, buf, stored_len, last);
  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);
  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  init_block(s);
  if (last) {
    bi_windup(s);
  }
}
function _tr_tally(s, dist, lc) {
  s.pending_buf[s.d_buf + s.last_lit * 2] = dist >>> 8 & 255;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 255;
  s.pending_buf[s.l_buf + s.last_lit] = lc & 255;
  s.last_lit++;
  if (dist === 0) {
    s.dyn_ltree[lc * 2]++;
  } else {
    s.matches++;
    dist--;
    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
    s.dyn_dtree[d_code(dist) * 2]++;
  }
  return s.last_lit === s.lit_bufsize - 1;
}
var MAX_MEM_LEVEL = 9;
var LENGTH_CODES$1 = 29;
var LITERALS$1 = 256;
var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
var D_CODES$1 = 30;
var BL_CODES$1 = 19;
var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
var MAX_BITS$1 = 15;
var MIN_MATCH$1 = 3;
var MAX_MATCH$1 = 258;
var MIN_LOOKAHEAD = MAX_MATCH$1 + MIN_MATCH$1 + 1;
var PRESET_DICT = 32;
var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;
var BS_NEED_MORE = 1;
var BS_BLOCK_DONE = 2;
var BS_FINISH_STARTED = 3;
var BS_FINISH_DONE = 4;
var OS_CODE = 3;
function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}
function rank(f) {
  return (f << 1) - (f > 4 ? 9 : 0);
}
function zero$1(buf) {
  var len = buf.length;
  while (--len >= 0) {
    buf[len] = 0;
  }
}
function flush_pending(strm) {
  var s = strm.state;
  var len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) {
    return;
  }
  arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
}
function flush_block_only(s, last) {
  _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}
function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}
function putShortMSB(s, b) {
  s.pending_buf[s.pending++] = b >>> 8 & 255;
  s.pending_buf[s.pending++] = b & 255;
}
function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;
  if (len > size) {
    len = size;
  }
  if (len === 0) {
    return 0;
  }
  strm.avail_in -= len;
  arraySet(buf, strm.input, strm.next_in, len, start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  } else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }
  strm.next_in += len;
  strm.total_in += len;
  return len;
}
function longest_match(s, cur_match) {
  var chain_length = s.max_chain_length;
  var scan = s.strstart;
  var match;
  var len;
  var best_len = s.prev_length;
  var nice_match = s.nice_match;
  var limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
  var _win = s.window;
  var wmask = s.w_mask;
  var prev = s.prev;
  var strend = s.strstart + MAX_MATCH$1;
  var scan_end1 = _win[scan + best_len - 1];
  var scan_end = _win[scan + best_len];
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  if (nice_match > s.lookahead) {
    nice_match = s.lookahead;
  }
  do {
    match = cur_match;
    if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
      continue;
    }
    scan += 2;
    match++;
    do {
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
    len = MAX_MATCH$1 - (strend - scan);
    scan = strend - MAX_MATCH$1;
    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1 = _win[scan + best_len - 1];
      scan_end = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
}
function fill_window(s) {
  var _w_size = s.w_size;
  var p, n, m, more, str;
  do {
    more = s.window_size - s.lookahead - s.strstart;
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
      arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      s.block_start -= _w_size;
      n = s.hash_size;
      p = n;
      do {
        m = s.head[--p];
        s.head[p] = m >= _w_size ? m - _w_size : 0;
      } while (--n);
      n = _w_size;
      p = n;
      do {
        m = s.prev[--p];
        s.prev[p] = m >= _w_size ? m - _w_size : 0;
      } while (--n);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;
    if (s.lookahead + s.insert >= MIN_MATCH$1) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + 1]) & s.hash_mask;
      while (s.insert) {
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH$1 - 1]) & s.hash_mask;
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH$1) {
          break;
        }
      }
    }
  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
}
function deflate_stored(s, flush) {
  var max_block_size = 65535;
  if (max_block_size > s.pending_buf_size - 5) {
    max_block_size = s.pending_buf_size - 5;
  }
  for (; ; ) {
    if (s.lookahead <= 1) {
      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    s.strstart += s.lookahead;
    s.lookahead = 0;
    var max_start = s.block_start + max_block_size;
    if (s.strstart === 0 || s.strstart >= max_start) {
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.strstart > s.block_start) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_NEED_MORE;
}
function deflate_fast(s, flush) {
  var hash_head;
  var bflush;
  for (; ; ) {
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    hash_head = 0;
    if (s.lookahead >= MIN_MATCH$1) {
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
    }
    if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      s.match_length = longest_match(s, hash_head);
    }
    if (s.match_length >= MIN_MATCH$1) {
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH$1);
      s.lookahead -= s.match_length;
      if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH$1) {
        s.match_length--;
        do {
          s.strstart++;
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        } while (--s.match_length !== 0);
        s.strstart++;
      } else {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + 1]) & s.hash_mask;
      }
    } else {
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = s.strstart < MIN_MATCH$1 - 1 ? s.strstart : MIN_MATCH$1 - 1;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
}
function deflate_slow(s, flush) {
  var hash_head;
  var bflush;
  var max_insert;
  for (; ; ) {
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    hash_head = 0;
    if (s.lookahead >= MIN_MATCH$1) {
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
    }
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH$1 - 1;
    if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      s.match_length = longest_match(s, hash_head);
      if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH$1 && s.strstart - s.match_start > 4096)) {
        s.match_length = MIN_MATCH$1 - 1;
      }
    }
    if (s.prev_length >= MIN_MATCH$1 && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH$1;
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH$1);
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          s.ins_h = (s.ins_h << s.hash_shift ^ s.window[s.strstart + MIN_MATCH$1 - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH$1 - 1;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    } else if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      if (bflush) {
        flush_block_only(s, false);
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  if (s.match_available) {
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH$1 - 1 ? s.strstart : MIN_MATCH$1 - 1;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
}
function deflate_rle(s, flush) {
  var bflush;
  var prev;
  var scan, strend;
  var _win = s.window;
  for (; ; ) {
    if (s.lookahead <= MAX_MATCH$1) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH$1 && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break;
      }
    }
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH$1 && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH$1;
        do {
        } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
        s.match_length = MAX_MATCH$1 - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
    }
    if (s.match_length >= MIN_MATCH$1) {
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH$1);
      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
}
function deflate_huff(s, flush) {
  var bflush;
  for (; ; ) {
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;
      }
    }
    s.match_length = 0;
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    return BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
  }
  return BS_BLOCK_DONE;
}
function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}
var configurationTable = function() {
  var table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),
    /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),
    /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),
    /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),
    /* 3 */
    new Config(4, 4, 16, 16, deflate_slow),
    /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),
    /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),
    /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),
    /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),
    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)
    /* 9 max compression */
  ];
  configurationTable = function() {
    return table;
  };
  return table;
};
function lm_init(s) {
  s.window_size = 2 * s.w_size;
  zero$1(s.head);
  var table = configurationTable();
  s.max_lazy_match = table[s.level].max_lazy;
  s.good_match = table[s.level].good_length;
  s.nice_match = table[s.level].nice_length;
  s.max_chain_length = table[s.level].max_chain;
  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH$1 - 1;
  s.match_available = 0;
  s.ins_h = 0;
}
function DeflateState() {
  this.strm = null;
  this.status = 0;
  this.pending_buf = null;
  this.pending_buf_size = 0;
  this.pending_out = 0;
  this.pending = 0;
  this.wrap = 0;
  this.gzhead = null;
  this.gzindex = 0;
  this.method = Z_DEFLATED;
  this.last_flush = -1;
  this.w_size = 0;
  this.w_bits = 0;
  this.w_mask = 0;
  this.window = null;
  this.window_size = 0;
  this.prev = null;
  this.head = null;
  this.ins_h = 0;
  this.hash_size = 0;
  this.hash_bits = 0;
  this.hash_mask = 0;
  this.hash_shift = 0;
  this.block_start = 0;
  this.match_length = 0;
  this.prev_match = 0;
  this.match_available = 0;
  this.strstart = 0;
  this.match_start = 0;
  this.lookahead = 0;
  this.prev_length = 0;
  this.max_chain_length = 0;
  this.max_lazy_match = 0;
  this.level = 0;
  this.strategy = 0;
  this.good_match = 0;
  this.nice_match = 0;
  this.dyn_ltree = Buf16(HEAP_SIZE$1 * 2);
  this.dyn_dtree = Buf16((2 * D_CODES$1 + 1) * 2);
  this.bl_tree = Buf16((2 * BL_CODES$1 + 1) * 2);
  zero$1(this.dyn_ltree);
  zero$1(this.dyn_dtree);
  zero$1(this.bl_tree);
  this.l_desc = null;
  this.d_desc = null;
  this.bl_desc = null;
  this.bl_count = Buf16(MAX_BITS$1 + 1);
  this.heap = Buf16(2 * L_CODES$1 + 1);
  zero$1(this.heap);
  this.heap_len = 0;
  this.heap_max = 0;
  this.depth = Buf16(2 * L_CODES$1 + 1);
  zero$1(this.depth);
  this.l_buf = 0;
  this.lit_bufsize = 0;
  this.last_lit = 0;
  this.d_buf = 0;
  this.opt_len = 0;
  this.static_len = 0;
  this.matches = 0;
  this.insert = 0;
  this.bi_buf = 0;
  this.bi_valid = 0;
}
function deflateResetKeep(strm) {
  var s;
  if (!strm || !strm.state) {
    return err(strm, Z_STREAM_ERROR);
  }
  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;
  s = strm.state;
  s.pending = 0;
  s.pending_out = 0;
  if (s.wrap < 0) {
    s.wrap = -s.wrap;
  }
  s.status = s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = s.wrap === 2 ? 0 : 1;
  s.last_flush = Z_NO_FLUSH;
  _tr_init(s);
  return Z_OK;
}
function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
}
function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  if (strm.state.wrap !== 2) {
    return Z_STREAM_ERROR;
  }
  strm.state.gzhead = head;
  return Z_OK;
}
function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) {
    return Z_STREAM_ERROR;
  }
  var wrap = 1;
  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else if (windowBits > 15) {
    wrap = 2;
    windowBits -= 16;
  }
  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED) {
    return err(strm, Z_STREAM_ERROR);
  }
  if (windowBits === 8) {
    windowBits = 9;
  }
  var s = new DeflateState();
  strm.state = s;
  s.strm = strm;
  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;
  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH$1 - 1) / MIN_MATCH$1);
  s.window = Buf8(s.w_size * 2);
  s.head = Buf16(s.hash_size);
  s.prev = Buf16(s.w_size);
  s.lit_bufsize = 1 << memLevel + 6;
  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = Buf8(s.pending_buf_size);
  s.d_buf = 1 * s.lit_bufsize;
  s.l_buf = (1 + 2) * s.lit_bufsize;
  s.level = level;
  s.strategy = strategy;
  s.method = method;
  return deflateReset(strm);
}
function deflate(strm, flush) {
  var old_flush, s;
  var beg, val;
  if (!strm || !strm.state || flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }
  s = strm.state;
  if (!strm.output || !strm.input && strm.avail_in !== 0 || s.status === FINISH_STATE && flush !== Z_FINISH) {
    return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }
  s.strm = strm;
  old_flush = s.last_flush;
  s.last_flush = flush;
  if (s.status === INIT_STATE) {
    if (s.wrap === 2) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      } else {
        put_byte(
          s,
          (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    } else {
      var header = Z_DEFLATED + (s.w_bits - 8 << 4) << 8;
      var level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      s.status = BUSY_STATE;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra) {
      beg = s.pending;
      while (s.gzindex < (s.gzhead.extra.length & 65535)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            break;
          }
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 255);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    } else {
      s.status = NAME_STATE;
    }
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name) {
      beg = s.pending;
      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    } else {
      s.status = COMMENT_STATE;
    }
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment) {
      beg = s.pending;
      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      if (val === 0) {
        s.status = HCRC_STATE;
      }
    } else {
      s.status = HCRC_STATE;
    }
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
      }
      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
        s.status = BUSY_STATE;
      }
    } else {
      s.status = BUSY_STATE;
    }
  }
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      s.last_flush = -1;
      return Z_OK;
    }
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }
  if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH && s.status !== FINISH_STATE) {
    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configurationTable()[s.level].func(s, flush);
    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
      }
      return Z_OK;
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      } else if (flush !== Z_BLOCK) {
        _tr_stored_block(s, 0, 0, false);
        if (flush === Z_FULL_FLUSH) {
          zero$1(s.head);
          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK;
      }
    }
  }
  if (flush !== Z_FINISH) {
    return Z_OK;
  }
  if (s.wrap <= 0) {
    return Z_STREAM_END;
  }
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 255);
    put_byte(s, strm.adler >> 8 & 255);
    put_byte(s, strm.adler >> 16 & 255);
    put_byte(s, strm.adler >> 24 & 255);
    put_byte(s, strm.total_in & 255);
    put_byte(s, strm.total_in >> 8 & 255);
    put_byte(s, strm.total_in >> 16 & 255);
    put_byte(s, strm.total_in >> 24 & 255);
  } else {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 65535);
  }
  flush_pending(strm);
  if (s.wrap > 0) {
    s.wrap = -s.wrap;
  }
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}
function deflateEnd(strm) {
  var status;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  status = strm.state.status;
  if (status !== INIT_STATE && status !== EXTRA_STATE && status !== NAME_STATE && status !== COMMENT_STATE && status !== HCRC_STATE && status !== BUSY_STATE && status !== FINISH_STATE) {
    return err(strm, Z_STREAM_ERROR);
  }
  strm.state = null;
  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}
function deflateSetDictionary(strm, dictionary) {
  var dictLength = dictionary.length;
  var s;
  var str, n;
  var wrap;
  var avail;
  var next;
  var input;
  var tmpDict;
  if (!strm || !strm.state) {
    return Z_STREAM_ERROR;
  }
  s = strm.state;
  wrap = s.wrap;
  if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
    return Z_STREAM_ERROR;
  }
  if (wrap === 1) {
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }
  s.wrap = 0;
  if (dictLength >= s.w_size) {
    if (wrap === 0) {
      zero$1(s.head);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    tmpDict = Buf8(s.w_size);
    arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH$1) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH$1 - 1);
    do {
      s.ins_h = (s.ins_h << s.hash_shift ^ s.window[str + MIN_MATCH$1 - 1]) & s.hash_mask;
      s.prev[str & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH$1 - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH$1 - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}
var toString$1 = Object.prototype.toString;
var Deflate = function Deflate2(options) {
  this.options = assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY,
    to: ""
  }, options || {});
  var opt = this.options;
  if (opt.raw && opt.windowBits > 0) {
    opt.windowBits = -opt.windowBits;
  } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
    opt.windowBits += 16;
  }
  this.err = 0;
  this.msg = "";
  this.ended = false;
  this.chunks = [];
  this.strm = new ZStream();
  this.strm.avail_out = 0;
  var status = deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );
  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }
  if (opt.header) {
    deflateSetHeader(this.strm, opt.header);
  }
  if (opt.dictionary) {
    var dict;
    if (typeof opt.dictionary === "string") {
      dict = string2buf(opt.dictionary);
    } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }
    status = deflateSetDictionary(this.strm, dict);
    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }
    this._dict_set = true;
  }
};
Deflate.prototype.push = function push2(data, mode) {
  var strm = this.strm;
  var chunkSize = this.options.chunkSize;
  var status, _mode;
  if (this.ended) {
    return false;
  }
  _mode = mode === ~~mode ? mode : mode === true ? Z_FINISH : Z_NO_FLUSH;
  if (typeof data === "string") {
    strm.input = string2buf(data);
  } else if (toString$1.call(data) === "[object ArrayBuffer]") {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }
  strm.next_in = 0;
  strm.avail_in = strm.input.length;
  do {
    if (strm.avail_out === 0) {
      strm.output = Buf8(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }
    status = deflate(strm, _mode);
    if (status !== Z_STREAM_END && status !== Z_OK) {
      this.onEnd(status);
      this.ended = true;
      return false;
    }
    if (strm.avail_out === 0 || strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH)) {
      if (this.options.to === "string") {
        this.onData(buf2binstring(shrinkBuf(strm.output, strm.next_out)));
      } else {
        this.onData(shrinkBuf(strm.output, strm.next_out));
      }
    }
  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
  if (_mode === Z_FINISH) {
    status = deflateEnd(this.strm);
    this.onEnd(status);
    this.ended = true;
    return status === Z_OK;
  }
  if (_mode === Z_SYNC_FLUSH) {
    this.onEnd(Z_OK);
    strm.avail_out = 0;
    return true;
  }
  return true;
};
Deflate.prototype.onData = function onData2(chunk) {
  this.chunks.push(chunk);
};
Deflate.prototype.onEnd = function onEnd2(status) {
  if (status === Z_OK) {
    if (this.options.to === "string") {
      this.result = this.chunks.join("");
    } else {
      this.result = flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};
function deflate$1(input, options) {
  var deflator = new Deflate(options);
  deflator.push(input, true);
  if (deflator.err) {
    throw deflator.msg || msg[deflator.err];
  }
  return deflator.result;
}
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate$1(input, options);
}

// ../ptcg-server/dist/game/store/state/state.js
var GamePhase;
(function(GamePhase2) {
  GamePhase2[GamePhase2["WAITING_FOR_PLAYERS"] = 0] = "WAITING_FOR_PLAYERS";
  GamePhase2[GamePhase2["SETUP"] = 1] = "SETUP";
  GamePhase2[GamePhase2["PLAYER_TURN"] = 2] = "PLAYER_TURN";
  GamePhase2[GamePhase2["ATTACK"] = 3] = "ATTACK";
  GamePhase2[GamePhase2["AFTER_ATTACK"] = 4] = "AFTER_ATTACK";
  GamePhase2[GamePhase2["CHOOSE_PRIZES"] = 5] = "CHOOSE_PRIZES";
  GamePhase2[GamePhase2["BETWEEN_TURNS"] = 6] = "BETWEEN_TURNS";
  GamePhase2[GamePhase2["FINISHED"] = 7] = "FINISHED";
})(GamePhase || (GamePhase = {}));
var GameWinner;
(function(GameWinner2) {
  GameWinner2[GameWinner2["NONE"] = -1] = "NONE";
  GameWinner2[GameWinner2["PLAYER_1"] = 0] = "PLAYER_1";
  GameWinner2[GameWinner2["PLAYER_2"] = 1] = "PLAYER_2";
  GameWinner2[GameWinner2["DRAW"] = 3] = "DRAW";
})(GameWinner || (GameWinner = {}));
var State = class {
  constructor() {
    this.cardNames = [];
    this.logs = [];
    this.rules = new Rules();
    this.prompts = [];
    this.phase = GamePhase.WAITING_FOR_PLAYERS;
    this.turn = 0;
    this.activePlayer = 0;
    this.winner = GameWinner.NONE;
    this.players = [];
    this.skipOpponentTurn = false;
    this.lastAttack = null;
    this.playerLastAttack = {};
    this.benchSizeChangeHandled = false;
  }
};

// ../ptcg-server/dist/game/serializer/generic.serializer.js
var GenericSerializer = class {
  constructor(creatorClass, constructorName) {
    this.creatorClass = creatorClass;
    this.constructorName = constructorName;
    this.types = [constructorName];
    this.classes = [creatorClass];
  }
  serialize(state) {
    const constructorName = this.constructorName;
    return Object.assign({ _type: constructorName }, state);
  }
  deserialize(data, context) {
    const instance = new this.creatorClass();
    delete data._type;
    return Object.assign(instance, data);
  }
};

// ../ptcg-server/dist/game/store/actions/play-card-action.js
var PlayerType;
(function(PlayerType2) {
  PlayerType2[PlayerType2["ANY"] = 0] = "ANY";
  PlayerType2[PlayerType2["TOP_PLAYER"] = 1] = "TOP_PLAYER";
  PlayerType2[PlayerType2["BOTTOM_PLAYER"] = 2] = "BOTTOM_PLAYER";
})(PlayerType || (PlayerType = {}));
var SlotType;
(function(SlotType2) {
  SlotType2[SlotType2["BOARD"] = 0] = "BOARD";
  SlotType2[SlotType2["ACTIVE"] = 1] = "ACTIVE";
  SlotType2[SlotType2["BENCH"] = 2] = "BENCH";
  SlotType2[SlotType2["HAND"] = 3] = "HAND";
  SlotType2[SlotType2["DISCARD"] = 4] = "DISCARD";
  SlotType2[SlotType2["LOSTZONE"] = 5] = "LOSTZONE";
  SlotType2[SlotType2["DECK"] = 6] = "DECK";
})(SlotType || (SlotType = {}));
var PlayCardAction = class {
  constructor(id, handIndex, target) {
    this.id = id;
    this.handIndex = handIndex;
    this.target = target;
    this.type = "PLAY_CARD_ACTION";
  }
};

// ../ptcg-server/dist/game/store/state-utils.js
var StateUtils = class _StateUtils {
  static getStadium(state) {
    throw new Error("Method not implemented.");
  }
  static checkEnoughEnergy(energy, cost) {
    if (cost.length === 0) {
      return true;
    }
    const provides = [];
    energy.forEach((e) => {
      e.provides.forEach((cardType) => provides.push(cardType));
    });
    let colorless = 0;
    let rainbow = 0;
    const needsProviding = [];
    cost.forEach((costType) => {
      switch (costType) {
        case CardType.ANY:
        case CardType.NONE:
          break;
        case CardType.COLORLESS:
          colorless += 1;
          break;
        default: {
          const index = provides.findIndex((energy2) => energy2 === costType);
          if (index !== -1) {
            provides.splice(index, 1);
          } else {
            needsProviding.push(costType);
            rainbow += 1;
          }
        }
      }
    });
    const blendProvides = [];
    const blendCards = [];
    energy.forEach((energyMap, index) => {
      const card = energyMap.card;
      if (card instanceof EnergyCard) {
        let blendTypes;
        switch (card.name) {
          case "Blend Energy WLFM":
            blendTypes = [CardType.WATER, CardType.LIGHTNING, CardType.FIGHTING, CardType.METAL];
            break;
          case "Blend Energy GRPD":
            blendTypes = [CardType.GRASS, CardType.FIRE, CardType.PSYCHIC, CardType.DARK];
            break;
          case "Unit Energy GRW":
            blendTypes = [CardType.GRASS, CardType.FIRE, CardType.WATER];
            break;
          case "Unit Energy LPM":
            blendTypes = [CardType.LIGHTNING, CardType.PSYCHIC, CardType.METAL];
            break;
          case "Unit Energy FDY":
            blendTypes = [CardType.FIGHTING, CardType.DARK, CardType.FAIRY];
            break;
        }
        if (blendTypes) {
          blendProvides.push(blendTypes);
          blendCards.push(energyMap);
        }
      }
    });
    const matchedBlends = /* @__PURE__ */ new Set();
    for (let i = 0; i < needsProviding.length; i++) {
      const neededType = needsProviding[i];
      for (let j = 0; j < blendProvides.length; j++) {
        if (!matchedBlends.has(j) && blendProvides[j].includes(neededType)) {
          const index = provides.findIndex((energy2) => energy2 === blendCards[j].provides[0]);
          if (index !== -1) {
            provides.splice(index, 1);
          }
          matchedBlends.add(j);
          rainbow--;
          needsProviding.splice(i, 1);
          i--;
          break;
        }
      }
    }
    for (let i = 0; i < rainbow; i++) {
      const index = provides.findIndex((energy2) => energy2 === CardType.ANY);
      if (index !== -1) {
        provides.splice(index, 1);
      } else {
        return false;
      }
    }
    return provides.length >= colorless;
  }
  static getCombinations(arr, n) {
    const l = arr.length;
    const ret = [];
    let i, j, k, childperm;
    let elem = [];
    if (n == 1) {
      for (i = 0; i < arr.length; i++) {
        for (j = 0; j < arr[i].length; j++) {
          ret.push([arr[i][j]]);
        }
      }
      return ret;
    } else {
      for (i = 0; i < l; i++) {
        elem = arr.shift();
        for (j = 0; j < elem.length; j++) {
          childperm = this.getCombinations(arr.slice(), n - 1);
          for (k = 0; k < childperm.length; k++) {
            ret.push([elem[j]].concat(childperm[k]));
          }
        }
      }
      return ret;
    }
  }
  static checkExactEnergy(energy, cost) {
    let enough = _StateUtils.checkEnoughEnergy(energy, cost);
    if (!enough) {
      return false;
    }
    for (let i = 0; i < energy.length; i++) {
      const tempCards = energy.slice();
      tempCards.splice(i, 1);
      enough = _StateUtils.checkEnoughEnergy(tempCards, cost);
      if (enough) {
        return false;
      }
    }
    return true;
  }
  static getPlayerById(state, playerId) {
    const player = state.players.find((p) => p.id === playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return player;
  }
  static getOpponent(state, player) {
    const opponent = state.players.find((p) => p.id !== player.id);
    if (opponent === void 0) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return opponent;
  }
  static getTarget(state, player, target) {
    if (target.player === PlayerType.TOP_PLAYER) {
      player = _StateUtils.getOpponent(state, player);
    }
    if (target.slot === SlotType.ACTIVE) {
      return player.active;
    }
    if (target.slot !== SlotType.BENCH) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (player.bench[target.index] === void 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    return player.bench[target.index];
  }
  static findCardList(state, card) {
    const cardLists = [];
    for (const player of state.players) {
      cardLists.push(player.active);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.lostzone);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach((item) => cardLists.push(item));
      player.prizes.forEach((item) => cardLists.push(item));
    }
    const cardList = cardLists.find((c) => c.cards.includes(card));
    if (cardList === void 0) {
      throw new GameError(GameMessage.INVALID_GAME_STATE);
    }
    return cardList;
  }
  static findOwner(state, cardList) {
    for (const player of state.players) {
      const cardLists = [];
      cardLists.push(player.active);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.lostzone);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach((item) => cardLists.push(item));
      player.prizes.forEach((item) => cardLists.push(item));
      if (cardLists.includes(cardList)) {
        return player;
      }
    }
    throw new GameError(GameMessage.INVALID_GAME_STATE);
  }
  static isPokemonInPlay(player, pokemon, location) {
    let inPlay = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      if (card === pokemon) {
        if (location === SlotType.BENCH && cardList === player.active || location === SlotType.ACTIVE && cardList !== player.active) {
          inPlay = false;
        } else {
          inPlay = true;
        }
      }
    });
    return inPlay;
  }
  static getStadiumCard(state) {
    for (const player of state.players) {
      if (player.stadium.cards.length > 0) {
        return player.stadium.cards[0];
      }
    }
    return void 0;
  }
};

// ../ptcg-server/dist/game/store/state/pokemon-card-list.js
var PokemonCardList = class _PokemonCardList extends CardList {
  constructor() {
    super(...arguments);
    this.damage = 0;
    this.hp = 0;
    this.specialConditions = [];
    this.poisonDamage = 10;
    this.burnDamage = 20;
    this.marker = new Marker();
    this.pokemonPlayedTurn = 0;
    this.sleepFlips = 1;
    this.boardEffect = [];
    this.hpBonus = 0;
    this.energyCards = [];
    this.isActivatingCard = false;
    this.showAllStageAbilities = false;
    this.triggerAnimation = false;
    this.showBasicAnimation = false;
    this.triggerAttackAnimation = false;
  }
  getPokemons() {
    const result = [];
    for (const card of this.cards) {
      if (card.superType === SuperType.POKEMON && card !== this.tool && !this.energyCards.includes(card)) {
        result.push(card);
      } else if (card.name === "Lillie's Poké Doll") {
        result.push(card);
      } else if (card.name === "Clefairy Doll") {
        result.push(card);
      } else if (card.name === "Rare Fossil") {
        result.push(card);
      } else if (card.name === "Robo Substitute") {
        result.push(card);
      } else if (card.name === "Mysterious Fossil") {
        result.push(card);
      } else if (card.name === "Unidentified Fossil") {
        result.push(card);
      }
    }
    return result;
  }
  getPokemonCard() {
    const pokemons = this.getPokemons();
    if (pokemons.length > 0) {
      return pokemons[pokemons.length - 1];
    }
  }
  isStage(stage) {
    const pokemonCard = this.getPokemonCard();
    if (pokemonCard === void 0) {
      return false;
    }
    return pokemonCard.stage === stage;
  }
  clearAttackEffects() {
    this.marker.markers = [];
  }
  clearEffects() {
    this.marker.removeMarker(_PokemonCardList.ATTACK_USED_MARKER);
    this.marker.removeMarker(_PokemonCardList.ATTACK_USED_2_MARKER);
    this.marker.removeMarker(_PokemonCardList.CLEAR_KNOCKOUT_MARKER);
    this.marker.removeMarker(_PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
    this.marker.removeMarker(_PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
    this.marker.removeMarker(_PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
    this.marker.removeMarker(_PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
    this.marker.removeMarker(_PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(_PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(_PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
    this.marker.removeMarker(_PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.marker.removeMarker(_PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.marker.removeMarker(_PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(_PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(_PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER);
    this.marker.removeMarker(_PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
    this.marker.removeMarker(_PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
    this.marker.removeMarker(_PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER);
    this.marker.removeMarker(_PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(_PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.marker.markers = [];
    this.removeSpecialCondition(SpecialCondition.POISONED);
    this.removeSpecialCondition(SpecialCondition.ASLEEP);
    this.removeSpecialCondition(SpecialCondition.BURNED);
    this.removeSpecialCondition(SpecialCondition.CONFUSED);
    this.removeSpecialCondition(SpecialCondition.PARALYZED);
    this.poisonDamage = 10;
    this.burnDamage = 20;
  }
  clearAllSpecialConditions() {
    this.removeSpecialCondition(SpecialCondition.POISONED);
    this.removeSpecialCondition(SpecialCondition.ASLEEP);
    this.removeSpecialCondition(SpecialCondition.BURNED);
    this.removeSpecialCondition(SpecialCondition.CONFUSED);
    this.removeSpecialCondition(SpecialCondition.PARALYZED);
  }
  removeSpecialCondition(sp) {
    if (!this.specialConditions.includes(sp)) {
      return;
    }
    this.specialConditions = this.specialConditions.filter((s) => s !== sp);
  }
  addSpecialCondition(sp) {
    if (sp === SpecialCondition.POISONED) {
      this.poisonDamage = 10;
    }
    if (sp === SpecialCondition.BURNED) {
      this.burnDamage = 20;
    }
    if (this.specialConditions.includes(sp)) {
      return;
    }
    if (sp === SpecialCondition.POISONED || sp === SpecialCondition.BURNED) {
      this.specialConditions.push(sp);
      return;
    }
    this.specialConditions = this.specialConditions.filter((s) => [
      SpecialCondition.PARALYZED,
      SpecialCondition.CONFUSED,
      SpecialCondition.ASLEEP,
      SpecialCondition.ABILITY_USED
    ].includes(s) === false);
    this.specialConditions.push(sp);
  }
  removeBoardEffect(sp) {
    if (!this.boardEffect.includes(sp)) {
      return;
    }
    this.boardEffect = this.boardEffect.filter((s) => s !== sp);
  }
  addBoardEffect(sp) {
    if (this.boardEffect.includes(sp)) {
      return;
    }
    this.boardEffect = this.boardEffect.filter((s) => [
      BoardEffect.ABILITY_USED,
      BoardEffect.POWER_GLOW,
      BoardEffect.POWER_NEGATED_GLOW,
      BoardEffect.POWER_RETURN
    ].includes(s) === false);
    this.boardEffect.push(sp);
  }
  // Add a Pokemon card as energy
  addPokemonAsEnergy(card) {
    if (!this.energyCards.includes(card) && this.cards.includes(card)) {
      this.energyCards.push(card);
    }
  }
  // Remove a Pokemon card from energy list
  removePokemonAsEnergy(card) {
    const index = this.energyCards.indexOf(card);
    if (index !== -1) {
      this.energyCards.splice(index, 1);
    }
  }
  //Rule-Box Pokemon
  hasRuleBox() {
    return this.cards.some((c) => c.tags.includes(CardTag.POKEMON_ex) || c.tags.includes(CardTag.RADIANT) || c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_GX) || c.tags.includes(CardTag.PRISM_STAR) || c.tags.includes(CardTag.BREAK) || c.tags.includes(CardTag.POKEMON_SV_MEGA));
  }
  vPokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.POKEMON_V) || c.tags.includes(CardTag.POKEMON_VMAX) || c.tags.includes(CardTag.POKEMON_VSTAR) || c.tags.includes(CardTag.POKEMON_VUNION));
  }
  exPokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.POKEMON_ex));
  }
  isTera() {
    return this.cards.some((c) => c.tags.includes(CardTag.POKEMON_TERA));
  }
  //Single/Rapid/Fusion Strike
  singleStrikePokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.SINGLE_STRIKE));
  }
  rapidStrikePokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.RAPID_STRIKE));
  }
  fusionStrikePokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.FUSION_STRIKE));
  }
  //Future/Ancient
  futurePokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.FUTURE));
  }
  ancientPokemon() {
    return this.cards.some((c) => c.tags.includes(CardTag.ANCIENT));
  }
  //Trainer Pokemon
  isLillies() {
    return this.cards.some((c) => c.tags.includes(CardTag.LILLIES));
  }
  isNs() {
    return this.cards.some((c) => c.tags.includes(CardTag.NS));
  }
  isIonos() {
    return this.cards.some((c) => c.tags.includes(CardTag.IONOS));
  }
  isHops() {
    return this.cards.some((c) => c.tags.includes(CardTag.HOPS));
  }
  isEthans() {
    return this.cards.some((c) => c.tags.includes(CardTag.ETHANS));
  }
  getToolEffect() {
    if (!this.tool) {
      return;
    }
    const toolCard = this.tool.cards;
    if (toolCard instanceof PokemonCard) {
      return toolCard.powers[0] || toolCard.attacks[0];
    }
  }
  isPlayerActive(state) {
    const player = state.players[state.activePlayer];
    return player.active === this;
  }
  isOpponentActive(state) {
    const opponent = StateUtils.getOpponent(state, state.players[state.activePlayer]);
    return opponent.active === this;
  }
  isPlayerBench(state) {
    const player = state.players[state.activePlayer];
    return player.bench.includes(this);
  }
  isOpponentBench(state) {
    const opponent = StateUtils.getOpponent(state, state.players[state.activePlayer]);
    return opponent.bench.includes(this);
  }
  // Override the parent CardList's moveTo method to properly handle Pokemon acting as energy
  moveTo(destination, count) {
    if (this.energyCards.length > 0) {
      this.energyCards = [];
    }
    super.moveTo(destination, count);
  }
};
PokemonCardList.ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
PokemonCardList.ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
PokemonCardList.CLEAR_KNOCKOUT_MARKER = "CLEAR_KNOCKOUT_MARKER";
PokemonCardList.CLEAR_KNOCKOUT_MARKER_2 = "CLEAR_KNOCKOUT_MARKER_2";
PokemonCardList.KNOCKOUT_MARKER = "KNOCKOUT_MARKER";
PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = "PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN";
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = "CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN";
PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = "PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN";
PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = "CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN";
PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = "OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER";
PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = "DEFENDING_POKEMON_CANNOT_RETREAT_MARKER";
PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER";
PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER";
PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER";
PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER";
PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = "PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER";
PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = "OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER";
PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = "PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER";
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = "CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER";
PokemonCardList.UNRELENTING_ONSLAUGHT_MARKER = "UNRELENTING_ONSLAUGHT_MARKER";
PokemonCardList.UNRELENTING_ONSLAUGHT_2_MARKER = "UNRELENTING_ONSLAUGHT_2_MARKER";

// ../ptcg-server/dist/game/store/state/player.js
var Player = class {
  constructor() {
    this.id = 0;
    this.name = "";
    this.deck = new CardList();
    this.hand = new CardList();
    this.discard = new CardList();
    this.lostzone = new CardList();
    this.stadium = new CardList();
    this.supporter = new CardList();
    this.active = new PokemonCardList();
    this.bench = [];
    this.prizes = [];
    this.supporterTurn = 0;
    this.ancientSupporter = false;
    this.retreatedTurn = 0;
    this.energyPlayedTurn = 0;
    this.stadiumPlayedTurn = 0;
    this.stadiumUsedTurn = 0;
    this.marker = new Marker();
    this.avatarName = "";
    this.usedVSTAR = false;
    this.usedGX = false;
    this.assembledVUNIONs = [];
    this.showAllStageAbilities = false;
    this.DAMAGE_DEALT_MARKER = "DAMAGE_DEALT_MARKER";
    this.ATTACK_USED_MARKER = "ATTACK_USED_MARKER";
    this.ATTACK_USED_2_MARKER = "ATTACK_USED_2_MARKER";
    this.CLEAR_KNOCKOUT_MARKER = "CLEAR_KNOCKOUT_MARKER";
    this.KNOCKOUT_MARKER = "KNOCKOUT_MARKER";
    this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = "OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER";
    this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = "DEFENDING_POKEMON_CANNOT_RETREAT_MARKER";
    this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = "PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER";
    this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER";
    this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER";
    this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER";
    this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = "DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER";
    this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = "CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER";
    this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER";
    this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = "CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER";
    this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = "PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES";
    this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = "PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER";
    this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = "CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER";
    this.UNRELENTING_ONSLAUGHT_MARKER = "UNRELENTING_ONSLAUGHT_MARKER";
    this.UNRELENTING_ONSLAUGHT_2_MARKER = "UNRELENTING_ONSLAUGHT_2_MARKER";
    this.usedDragonsWish = false;
    this.pecharuntexIsInPlay = false;
    this.usedFanCall = false;
    this.canEvolve = false;
    this.supportersForDetour = new CardList();
    this.usedAlteredCreation = false;
    this.alteredCreationDamage = false;
    this.usedFullMetalWall = false;
    this.prizesTaken = 0;
  }
  getPrizeLeft() {
    return this.prizes.reduce((left, p) => left + p.cards.length, 0);
  }
  forEachPokemon(player, handler) {
    let pokemonCard = this.active.getPokemonCard();
    let target;
    if (pokemonCard !== void 0) {
      target = { player, slot: SlotType.ACTIVE, index: 0 };
      handler(this.active, pokemonCard, target);
    }
    for (let i = 0; i < this.bench.length; i++) {
      pokemonCard = this.bench[i].getPokemonCard();
      if (pokemonCard !== void 0) {
        target = { player, slot: SlotType.BENCH, index: i };
        handler(this.bench[i], pokemonCard, target);
      }
    }
  }
  removePokemonEffects(target) {
    this.marker.removeMarker(this.ATTACK_USED_MARKER);
    this.marker.removeMarker(this.ATTACK_USED_2_MARKER);
    this.marker.removeMarker(this.KNOCKOUT_MARKER);
    this.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
    this.marker.removeMarker(this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
    this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
    this.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
    this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
    this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES);
    this.marker.removeMarker(this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_MARKER);
    this.marker.removeMarker(this.UNRELENTING_ONSLAUGHT_2_MARKER);
    target.clearEffects();
  }
  getPokemonInPlay() {
    const list = [];
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.cards.length !== 0)
        list.push(cardList);
    });
    return list;
  }
  vPokemon() {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.vPokemon()) {
        result = true;
      }
    });
    return result;
  }
  singleStrike() {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some((pokemon) => pokemon.tags.includes(CardTag.SINGLE_STRIKE))) {
        result = true;
      }
    });
    return result;
  }
  fusionStrike() {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some((pokemon) => pokemon.tags.includes(CardTag.FUSION_STRIKE))) {
        result = true;
      }
    });
    return result;
  }
  rapidStrike() {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some((pokemon) => pokemon.tags.includes(CardTag.RAPID_STRIKE))) {
        result = true;
      }
    });
    return result;
  }
  getSlot(slotType) {
    switch (slotType) {
      case SlotType.DISCARD:
        return this.discard;
      case SlotType.HAND:
        return this.hand;
      case SlotType.LOSTZONE:
        return this.lostzone;
      case SlotType.DECK:
        return this.deck;
      default:
        throw new GameError(GameMessage.INVALID_TARGET);
    }
  }
  switchPokemon(target) {
    const benchIndex = this.bench.indexOf(target);
    if (benchIndex !== -1) {
      const temp = this.active;
      this.marker.removeMarker(this.ATTACK_USED_MARKER);
      this.marker.removeMarker(this.ATTACK_USED_2_MARKER);
      this.marker.removeMarker(this.KNOCKOUT_MARKER);
      this.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
      this.marker.removeMarker(this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
      this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
      this.marker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
      this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
      this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
      this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
      this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
      this.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
      this.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
      this.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
      this.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
      this.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
      this.marker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES);
      this.active.clearEffects();
      this.active = this.bench[benchIndex];
      this.bench[benchIndex] = temp;
      this.active.getPokemonCard().movedToActiveThisTurn = true;
    }
  }
};

// ../ptcg-server/dist/game/serializer/card.serializer.js
var CardSerializer = class {
  constructor() {
    this.types = ["Card"];
    this.classes = [Card];
  }
  serialize(card) {
    const index = card.id;
    if (index === -1) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found '${card.fullName}'.`);
    }
    return { _type: "Card", index };
  }
  deserialize(data, context) {
    const index = data.index;
    const card = context.cards[index];
    if (card === void 0) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }
    return card;
  }
};

// ../ptcg-server/dist/game/serializer/card-list.serializer.js
var CardListSerializer = class {
  constructor() {
    this.types = ["CardList", "PokemonCardList"];
    this.classes = [CardList, PokemonCardList];
  }
  serialize(cardList) {
    const data = Object.assign({}, cardList);
    let constructorName = "CardList";
    if (cardList instanceof PokemonCardList) {
      constructorName = "PokemonCardList";
      if (cardList.tool !== void 0) {
        data.tool = cardList.tool.id;
      }
    }
    return Object.assign(Object.assign({}, data), { _type: constructorName, cards: cardList.cards.map((card) => card.id) });
  }
  deserialize(data, context) {
    const instance = data._type === "PokemonCardList" ? new PokemonCardList() : new CardList();
    delete data._type;
    if (data.tool !== void 0) {
      data.tool = this.fromIndex(data.tool, context);
    }
    const indexes = data.cards;
    data.cards = indexes.map((index) => this.fromIndex(index, context));
    if (instance instanceof PokemonCardList) {
      instance.showBasicAnimation = data.showBasicAnimation || false;
      instance.triggerAnimation = data.triggerAnimation || false;
      instance.triggerAttackAnimation = data.triggerAttackAnimation || false;
    }
    return Object.assign(instance, data);
  }
  fromIndex(index, context) {
    const card = context.cards[index];
    if (card === void 0) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }
    return card;
  }
};

// ../ptcg-server/dist/game/store/state/state-log.js
var StateLog = class {
  constructor(message, params = {}, client = 0) {
    this.id = 0;
    this.message = message;
    this.params = params;
    this.client = client;
  }
};

// ../ptcg-server/dist/game/serializer/state-log.serializer.js
var StateLogSerializer = class {
  constructor() {
    this.types = ["StateLog"];
    this.classes = [StateLog];
  }
  serialize(stateLog) {
    return Object.assign(Object.assign({}, stateLog), { _type: "StateLog" });
  }
  deserialize(data, context) {
    delete data._type;
    const instance = new StateLog(data.message, data.params, data.client);
    return Object.assign(instance, data);
  }
};

// ../ptcg-server/dist/game/store/prompts/prompt.js
var Prompt = class {
  constructor(playerId) {
    this.playerId = playerId;
    this.id = 0;
  }
  decode(result, state) {
    return result;
  }
  validate(result, state) {
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/alert-prompt.js
var AlertPrompt = class extends Prompt {
  constructor(playerId, message) {
    super(playerId);
    this.message = message;
    this.type = "Alert";
  }
};

// ../ptcg-server/dist/game/store/prompts/attach-energy-prompt.js
var AttachEnergyPromptType = "Attach energy";
var AttachEnergyPrompt = class extends Prompt {
  constructor(playerId, message, cardList, playerType, slots, filter, options) {
    super(playerId);
    this.message = message;
    this.cardList = cardList;
    this.playerType = playerType;
    this.slots = slots;
    this.filter = filter;
    this.type = AttachEnergyPromptType;
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: cardList.cards.length,
      blocked: [],
      blockedTo: [],
      differentTypes: false,
      sameTarget: false,
      differentTargets: false
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers = [];
    result.forEach((t) => {
      const cardList = this.cardList;
      const card = cardList.cards[t.index];
      if (!(card instanceof Card)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      if (card.superType !== SuperType.ENERGY) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      if (this.options.blocked.includes(t.index)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      transfers.push({ to: t.to, card });
    });
    return transfers;
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }
    if (result.some((r) => this.options.blocked.includes(this.cardList.cards.indexOf(r.card)))) {
      return false;
    }
    if (this.options.maxPerType) {
      const typeCounts = /* @__PURE__ */ new Map();
      for (const assign2 of result) {
        const energyCard = assign2.card;
        const type = energyCard.provides[0];
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
        if (typeCounts.get(type) > this.options.maxPerType) {
          return false;
        }
      }
    }
    if (this.options.sameTarget && result.length > 1) {
      const t = result[0].to;
      const different = result.some((r) => {
        return r.to.player !== t.player || r.to.slot !== t.slot || r.to.index !== t.index;
      });
      if (different) {
        return false;
      }
    }
    if (this.options.validCardTypes) {
      let onlyValidTypes = true;
      for (const assign2 of result) {
        const energyCard = assign2.card;
        if (energyCard.provides.every((p) => !this.options.validCardTypes.includes(p))) {
          onlyValidTypes = false;
        }
      }
      return onlyValidTypes;
    }
    if (this.options.differentTypes) {
      const typeMap = {};
      for (const assign2 of result) {
        const cardType = this.getCardType(assign2.card);
        if (typeMap[cardType] === true) {
          return false;
        } else {
          typeMap[cardType] = true;
        }
      }
    }
    if (this.options.differentTargets && result.length > 1) {
      for (let i = 0; i < result.length; i++) {
        const t = result[i].to;
        const index = result.findIndex((r) => {
          return r.to.player === t.player && r.to.slot === t.slot && r.to.index === t.index;
        });
        if (index !== i) {
          return false;
        }
      }
    }
    return result.every((r) => r.card !== void 0);
  }
  getCardType(card) {
    if (card.superType === SuperType.ENERGY) {
      const energyCard = card;
      return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
    }
    if (card.superType === SuperType.POKEMON) {
      const pokemonCard = card;
      return pokemonCard.cardType;
    }
    return CardType.NONE;
  }
};

// ../ptcg-server/dist/game/store/prompts/choose-attack-prompt.js
var ChooseAttackPromptType = "Choose attack";
var ChooseAttackPrompt = class extends Prompt {
  constructor(playerId, message, cards, options) {
    super(playerId);
    this.message = message;
    this.cards = cards;
    this.type = ChooseAttackPromptType;
    this.options = Object.assign({}, {
      allowCancel: false,
      blockedMessage: GameMessage.NOT_ENOUGH_ENERGY,
      blocked: []
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const index = result.index;
    if (index < 0 || index >= this.cards.length) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const card = this.cards[index];
    const attack = card.attacks.find((a) => a.name === result.attack);
    if (attack === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return attack;
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    const blocked = this.options.blocked.map((b) => {
      const card = this.cards[b.index];
      if (card && card.attacks) {
        return card.attacks.find((a) => a.name === b.attack);
      }
    });
    if (blocked.includes(result)) {
      return false;
    }
    return this.cards.some((c) => c.attacks.includes(result));
  }
};

// ../ptcg-server/dist/game/store/prompts/choose-cards-prompt.js
var ChooseCardsPromptType = "Choose cards";
var ChooseCardsPrompt = class _ChooseCardsPrompt extends Prompt {
  constructor(player, message, cards, filter, options) {
    super(player.id);
    this.message = message;
    this.cards = cards;
    this.filter = filter;
    this.type = ChooseCardsPromptType;
    this.blockedCardNames = [];
    this.player = player;
    this.options = Object.assign({}, {
      min: 0,
      max: cards.cards.length,
      allowCancel: true,
      blocked: [],
      isSecret: false,
      differentTypes: false,
      allowDifferentSuperTypes: true,
      maxPokemons: void 0,
      maxBasicEnergies: void 0,
      maxEnergies: void 0,
      maxTrainers: void 0,
      maxTools: void 0,
      maxStadiums: void 0,
      maxSupporters: void 0,
      maxSpecialEnergies: void 0,
      maxItems: void 0
    }, options);
    if (this.options.blocked.length > 0) {
      for (let i = 0; i < this.cards.cards.length; i++) {
        if (this.options.blocked.indexOf(i) !== -1) {
          if (this.blockedCardNames.indexOf(this.cards.cards[i].name) === -1) {
            this.blockedCardNames.push(this.cards.cards[i].name);
          }
        }
      }
    }
    if (!this.options.isSecret) {
      if (this.cards === this.player.deck || this.cards === this.player.discard) {
        this.cards.sort();
      }
    }
    if (this.options.blocked.length > 0) {
      this.options.blocked = [];
      this.cards.cards.forEach((card, index) => {
        if (this.blockedCardNames.indexOf(card.name) !== -1) {
          this.options.blocked.push(index);
        }
      });
    }
  }
  decode(result) {
    if (result === null) {
      return null;
    }
    const cards = this.cards.cards;
    return result.map((index) => cards[index]);
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }
    if (!this.options.allowDifferentSuperTypes) {
      const set = new Set(result.map((r) => r.superType));
      if (set.size > 1) {
        return false;
      }
    }
    if (this.options.differentTypes) {
      const typeMap = {};
      for (const card of result) {
        const cardType = _ChooseCardsPrompt.getCardType(card);
        if (typeMap[cardType] === true) {
          return false;
        } else {
          typeMap[cardType] = true;
        }
      }
    }
    const countMap = {};
    for (const card of result) {
      const count = countMap[card.superType.toString()] || 0;
      countMap[card.superType.toString()] = count + 1;
      if (card.superType === SuperType.TRAINER) {
        const trainerTypeCount = countMap[`${card.superType}-${card.trainerType}`] || 0;
        countMap[`${card.superType}-${card.trainerType}`] = trainerTypeCount + 1;
      }
      if (card.superType === SuperType.ENERGY) {
        const energyTypeCount = countMap[`${card.superType}-${card.energyType}`] || 0;
        countMap[`${card.superType}-${card.energyType}`] = energyTypeCount + 1;
      }
    }
    const { maxPokemons, maxBasicEnergies, maxTrainers, maxItems, maxTools, maxStadiums, maxSupporters, maxSpecialEnergies, maxEnergies } = this.options;
    if (maxPokemons !== void 0 && maxPokemons < countMap[`${SuperType.POKEMON}`] || maxBasicEnergies !== void 0 && maxBasicEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.BASIC}`] || maxEnergies !== void 0 && maxEnergies < countMap[`${SuperType.ENERGY}`] || maxTrainers !== void 0 && maxTrainers < countMap[`${SuperType.TRAINER}-${SuperType.TRAINER}`] || maxItems !== void 0 && maxItems < countMap[`${SuperType.TRAINER}-${TrainerType.ITEM}`] || maxStadiums !== void 0 && maxStadiums < countMap[`${SuperType.TRAINER}-${TrainerType.STADIUM}`] || maxSupporters !== void 0 && maxSupporters < countMap[`${SuperType.TRAINER}-${TrainerType.SUPPORTER}`] || maxSpecialEnergies !== void 0 && maxSpecialEnergies < countMap[`${SuperType.ENERGY}-${EnergyType.SPECIAL}`] || maxTools !== void 0 && maxTools < countMap[`${SuperType.TRAINER}-${TrainerType.TOOL}`]) {
      return false;
    }
    const blocked = this.options.blocked;
    return result.every((r) => {
      const index = this.cards.cards.indexOf(r);
      return index !== -1 && !blocked.includes(index) && this.matchesFilter(r);
    });
  }
  static getCardType(card) {
    if (card.superType === SuperType.ENERGY) {
      const energyCard = card;
      return energyCard.provides.length > 0 ? energyCard.provides[0] : CardType.NONE;
    }
    if (card.superType === SuperType.POKEMON) {
      const pokemonCard = card;
      return pokemonCard.cardType;
    }
    return CardType.NONE;
  }
  matchesFilter(card) {
    for (const key in this.filter) {
      if (Object.prototype.hasOwnProperty.call(this.filter, key)) {
        if (this.filter[key] !== card[key]) {
          return false;
        }
      }
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/choose-energy-prompt.js
var ChooseEnergyPromptType = "Choose energy";
var ChooseEnergyPrompt = class extends Prompt {
  constructor(playerId, message, energy, cost, options) {
    super(playerId);
    this.message = message;
    this.energy = energy;
    this.cost = cost;
    this.type = ChooseEnergyPromptType;
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);
    if (this.options.allowCancel === false) {
      this.cost = this.getCostThatCanBePaid();
    }
  }
  decode(result) {
    if (result === null) {
      return null;
    }
    const energy = this.energy;
    return result.map((index) => energy[index]);
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (!StateUtils.checkExactEnergy(result, this.cost)) {
      return false;
    }
    return true;
  }
  getCostThatCanBePaid() {
    const result = this.cost.slice();
    const provides = this.energy.slice();
    const costs = this.cost.filter((c) => c !== CardType.COLORLESS);
    const colorlessCount = result.length - costs.length;
    while (costs.length > 0 && provides.length > 0) {
      const cost = costs[0];
      let index = provides.findIndex((p) => p.provides.includes(cost));
      if (index === -1) {
        index = provides.findIndex((p) => p.provides.includes(CardType.ANY));
      }
      if (index !== -1) {
        const provide = provides[index];
        provides.splice(index, 1);
        provide.provides.forEach((c) => {
          if (c === CardType.ANY && costs.length > 0) {
            costs.shift();
          } else {
            const i = costs.indexOf(c);
            if (i !== -1) {
              costs.splice(i, 1);
            }
          }
        });
      } else {
        costs.shift();
        const costToDelete = result.indexOf(cost);
        if (costToDelete !== -1) {
          result.splice(costToDelete, 1);
        }
      }
    }
    let energyLeft = 0;
    for (const energy of provides) {
      energyLeft += energy.provides.length;
    }
    const colorlessToDelete = Math.max(0, colorlessCount - energyLeft);
    for (let i = 0; i < colorlessToDelete; i++) {
      const costToDelete = result.indexOf(CardType.COLORLESS);
      if (costToDelete !== -1) {
        result.splice(costToDelete, 1);
      }
    }
    return result;
  }
};

// ../ptcg-server/dist/game/store/prompts/choose-pokemon-prompt.js
var ChoosePokemonPromptType = "Choose pokemon";
var ChoosePokemonPrompt = class extends Prompt {
  constructor(playerId, message, playerType, slots, options) {
    super(playerId);
    this.message = message;
    this.playerType = playerType;
    this.slots = slots;
    this.type = ChoosePokemonPromptType;
    this.options = Object.assign({}, {
      min: 1,
      max: 1,
      allowCancel: true,
      blocked: []
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    const opponent = state.players.find((p) => p.id !== this.playerId);
    if (player === void 0 || opponent === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result.map((target) => {
      const p = target.player === PlayerType.BOTTOM_PLAYER ? player : opponent;
      return target.slot === SlotType.ACTIVE ? p.active : p.bench[target.index];
    });
  }
  validate(result, state) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }
    if (result.some((cardList) => cardList.cards.length === 0)) {
      return false;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      return false;
    }
    const blocked = this.options.blocked.map((b) => StateUtils.getTarget(state, player, b));
    if (result.some((r) => blocked.includes(r))) {
      return false;
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/choose-prize-prompt.js
var ChoosePrizePromptType = "Choose prize";
var ChoosePrizePrompt = class extends Prompt {
  constructor(playerId, message, options) {
    super(playerId);
    this.message = message;
    this.type = ChoosePrizePromptType;
    this.options = Object.assign({}, {
      count: 1,
      max: 1,
      blocked: [],
      allowCancel: false,
      isSecret: false,
      useOpponentPrizes: false
    }, options);
    this.options.max = this.options.count;
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const targetPlayer = this.options.useOpponentPrizes ? state.players.find((p) => p.id !== this.playerId) : player;
    if (targetPlayer === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const prizes = targetPlayer.prizes.filter((p) => p.cards.length > 0);
    return result.map((index) => prizes[index]);
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length !== this.options.count) {
      return false;
    }
    const hasDuplicates = result.some((p, index) => {
      return result.indexOf(p) !== index;
    });
    if (hasDuplicates) {
      return false;
    }
    const hasEmpty = result.some((p) => p.cards.length === 0);
    if (hasEmpty) {
      return false;
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/coin-flip-prompt.js
var CoinFlipPrompt = class extends Prompt {
  constructor(playerId, message) {
    super(playerId);
    this.message = message;
    this.type = "Coin flip";
  }
};

// ../ptcg-server/dist/game/store/prompts/confirm-prompt.js
var ConfirmPrompt = class extends Prompt {
  constructor(playerId, message) {
    super(playerId);
    this.message = message;
    this.type = "Confirm";
  }
};

// ../ptcg-server/dist/game/store/prompts/invite-player-prompt.js
var InvitePlayerPrompt = class extends Prompt {
  constructor(playerId, message) {
    super(playerId);
    this.message = message;
    this.type = "Invite player";
  }
};

// ../ptcg-server/dist/game/store/prompts/move-damage-prompt.js
var MoveDamagePromptType = "Move damage";
var MoveDamagePrompt = class extends Prompt {
  constructor(playerId, message, playerType, slots, maxAllowedDamage, options) {
    super(playerId);
    this.message = message;
    this.playerType = playerType;
    this.slots = slots;
    this.maxAllowedDamage = maxAllowedDamage;
    this.type = MoveDamagePromptType;
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: void 0,
      blockedFrom: [],
      blockedTo: [],
      singleSourceTarget: false,
      singleDestinationTarget: false
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result;
  }
  validate(result, state) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (this.options.singleSourceTarget) {
      const sources = new Set(result.map((r) => JSON.stringify(r.from)));
      if (sources.size > 1) {
        return false;
      }
    }
    if (this.options.singleDestinationTarget) {
      const destinations = new Set(result.map((r) => JSON.stringify(r.to)));
      if (destinations.size > 1) {
        return false;
      }
    }
    if (result.length < this.options.min) {
      return false;
    }
    if (this.options.max !== void 0 && result.length > this.options.max) {
      return false;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      return false;
    }
    const blockedFrom = this.options.blockedFrom.map((b) => StateUtils.getTarget(state, player, b));
    const blockedTo = this.options.blockedTo.map((b) => StateUtils.getTarget(state, player, b));
    for (const r of result) {
      const from = StateUtils.getTarget(state, player, r.from);
      if (from === void 0 || blockedFrom.includes(from)) {
        return false;
      }
      const to = StateUtils.getTarget(state, player, r.to);
      if (to === void 0 || blockedTo.includes(to)) {
        return false;
      }
    }
    if (this.playerType !== PlayerType.ANY) {
      if (result.some((r) => r.from.player !== this.playerType) || result.some((r) => r.to.player !== this.playerType)) {
        return false;
      }
    }
    if (result.some((r) => !this.slots.includes(r.from.slot)) || result.some((r) => !this.slots.includes(r.to.slot))) {
      return false;
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/move-energy-prompt.js
var MoveEnergyPromptType = "Move energy";
var MoveEnergyPrompt = class extends Prompt {
  constructor(playerId, message, playerType, slots, filter, options) {
    super(playerId);
    this.message = message;
    this.playerType = playerType;
    this.slots = slots;
    this.filter = filter;
    this.type = MoveEnergyPromptType;
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: void 0,
      blockedFrom: [],
      blockedTo: [],
      blockedMap: []
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers = [];
    result.forEach((t) => {
      const cardList = StateUtils.getTarget(state, player, t.from);
      const card = cardList.cards[t.index];
      if (!(card instanceof Card)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      transfers.push({ from: t.from, to: t.to, card });
    });
    return transfers;
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    return result.every((r) => r.card !== void 0);
  }
};

// ../ptcg-server/dist/game/store/prompts/order-cards-prompt.js
var OrderCardsPromptType = "Order cards";
var OrderCardsPrompt = class extends Prompt {
  constructor(playerId, message, cards, options) {
    super(playerId);
    this.message = message;
    this.cards = cards;
    this.type = OrderCardsPromptType;
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length !== this.cards.cards.length) {
      return false;
    }
    const s = result.slice();
    s.sort();
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== i) {
        return false;
      }
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/put-damage-prompt.js
var PutDamagePromptType = "Put damage";
var PutDamagePrompt = class extends Prompt {
  constructor(playerId, message, playerType, slots, damage, maxAllowedDamage, options) {
    super(playerId);
    this.message = message;
    this.playerType = playerType;
    this.slots = slots;
    this.damage = damage;
    this.maxAllowedDamage = maxAllowedDamage;
    this.type = PutDamagePromptType;
    this.options = Object.assign({}, {
      allowCancel: true,
      blocked: [],
      allowPlacePartialDamage: false,
      damageMultiple: 10
    }, options);
  }
  decode(result, state) {
    return result;
  }
  validate(result, state) {
    if (result === null) {
      return this.options.allowCancel;
    }
    let damage = 0;
    result.forEach((r) => {
      damage += r.damage;
    });
    if (this.damage !== damage && !this.options.allowPlacePartialDamage) {
      return false;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      return false;
    }
    const blocked = this.options.blocked.map((b) => StateUtils.getTarget(state, player, b));
    for (const r of result) {
      const target = StateUtils.getTarget(state, player, r.target);
      if (target === void 0 || blocked.includes(target)) {
        return false;
      }
    }
    if (this.playerType !== PlayerType.ANY) {
      if (result.some((r) => r.target.player !== this.playerType)) {
        return false;
      }
    }
    if (result.some((r) => !this.slots.includes(r.target.slot))) {
      return false;
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/select-prompt.js
var SelectPrompt = class extends Prompt {
  constructor(playerId, message, values, options) {
    super(playerId);
    this.message = message;
    this.values = values;
    this.type = "Select";
    this.options = Object.assign({}, {
      allowCancel: true,
      defaultValue: 0
    }, options);
  }
};

// ../ptcg-server/dist/game/store/prompts/show-cards-prompt.js
var ShowCardsPrompt = class extends Prompt {
  constructor(playerId, message, cards, options) {
    super(playerId);
    this.message = message;
    this.cards = cards;
    this.type = "Show cards";
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }
};

// ../ptcg-server/dist/game/store/prompts/shuffle-prompt.js
var ShuffleDeckPrompt = class extends Prompt {
  constructor(playerId) {
    super(playerId);
    this.type = "Shuffle deck";
  }
  validate(result, state) {
    if (result === null) {
      return false;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      return false;
    }
    if (result.length !== player.deck.cards.length) {
      return false;
    }
    const s = result.slice();
    s.sort();
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== i) {
        return false;
      }
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/shuffle-hand-prompt.js
var ShuffleHandPrompt = class extends Prompt {
  constructor(playerId) {
    super(playerId);
    this.type = "Shuffle deck";
  }
  validate(result, state) {
    if (result === null) {
      return false;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      return false;
    }
    if (result.length !== player.prizes.length) {
      return false;
    }
    const s = result.slice();
    s.sort();
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== i) {
        return false;
      }
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/remove-damage-prompt.js
var RemoveDamagePromptType = "Remove damage";
var RemoveDamagePrompt = class extends Prompt {
  constructor(playerId, message, playerType, slots, maxAllowedDamage, options) {
    super(playerId);
    this.message = message;
    this.playerType = playerType;
    this.slots = slots;
    this.maxAllowedDamage = maxAllowedDamage;
    this.type = RemoveDamagePromptType;
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: void 0,
      blockedFrom: [],
      blockedTo: [],
      sameTarget: false
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result;
  }
  validate(result, state) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min) {
      return false;
    }
    if (this.options.max !== void 0 && result.length > this.options.max) {
      return false;
    }
    if (this.options.sameTarget && result.length > 1) {
      const t = result[0].to;
      const different = result.some((r) => {
        return r.to.player !== t.player || r.to.slot !== t.slot || r.to.index !== t.index;
      });
      if (different) {
        return false;
      }
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      return false;
    }
    const blockedFrom = this.options.blockedFrom.map((b) => StateUtils.getTarget(state, player, b));
    const blockedTo = this.options.blockedTo.map((b) => StateUtils.getTarget(state, player, b));
    for (const r of result) {
      const from = StateUtils.getTarget(state, player, r.from);
      if (from === void 0 || blockedFrom.includes(from)) {
        return false;
      }
      const to = StateUtils.getTarget(state, player, r.to);
      if (to === void 0 || blockedTo.includes(to)) {
        return false;
      }
    }
    if (this.playerType !== PlayerType.ANY) {
      if (result.some((r) => r.from.player !== this.playerType) || result.some((r) => r.to.player !== this.playerType)) {
        return false;
      }
    }
    if (result.some((r) => !this.slots.includes(r.from.slot)) || result.some((r) => !this.slots.includes(r.to.slot))) {
      return false;
    }
    return true;
  }
};

// ../ptcg-server/dist/game/store/prompts/discard-energy-prompt.js
var DiscardEnergyPromptType = "Discard energy";
var DiscardEnergyPrompt = class extends Prompt {
  constructor(playerId, message, playerType, slots, filter, options) {
    super(playerId);
    this.message = message;
    this.playerType = playerType;
    this.slots = slots;
    this.filter = filter;
    this.type = DiscardEnergyPromptType;
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: void 0,
      blockedFrom: [],
      blockedMap: []
    }, options);
  }
  decode(result, state) {
    if (result === null) {
      return result;
    }
    const player = state.players.find((p) => p.id === this.playerId);
    if (player === void 0) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers = [];
    const processedCards = /* @__PURE__ */ new Set();
    result.forEach((t) => {
      const cardList = StateUtils.getTarget(state, player, t.from);
      const key = `${t.from.player}-${t.from.slot}-${t.from.index}-${t.index}`;
      if (processedCards.has(key)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      processedCards.add(key);
      const card = cardList.cards[t.index];
      if (!(card instanceof Card)) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      if (card.superType !== SuperType.ENERGY) {
        throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
      }
      transfers.push({ from: t.from, card });
    });
    return transfers;
  }
  validate(result) {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min || this.options.max !== void 0 && result.length > this.options.max) {
      return false;
    }
    return result.every((r) => r.card !== void 0);
  }
};

// ../ptcg-server/dist/game/store/prompts/confirm-cards-prompt.js
var ConfirmCardsPrompt = class extends Prompt {
  constructor(playerId, message, cards, options) {
    super(playerId);
    this.message = message;
    this.cards = cards;
    this.type = "Confirm cards";
    this.options = Object.assign({}, {
      allowCancel: false
    }, options);
  }
};

// ../ptcg-server/dist/game/store/prompts/select-option-prompt.js
var SelectOptionPrompt = class extends Prompt {
  constructor(playerId, message, values, options) {
    super(playerId);
    this.message = message;
    this.values = values;
    this.type = "SelectOption";
    this.options = Object.assign({}, {
      allowCancel: true,
      defaultValue: 0
    }, options);
  }
};

// ../ptcg-server/dist/game/serializer/prompt.serializer.js
var PromptSerializer = class {
  constructor() {
    this.rows = [
      { classValue: AlertPrompt, type: "AlertPrompt" },
      { classValue: AttachEnergyPrompt, type: "AttachEnergyPrompt" },
      { classValue: ChooseAttackPrompt, type: "ChooseAttackPrompt" },
      { classValue: ChooseCardsPrompt, type: "ChooseCardsPrompt" },
      { classValue: ChooseEnergyPrompt, type: "ChooseEnergyPrompt" },
      { classValue: ChoosePokemonPrompt, type: "ChoosePokemonPrompt" },
      { classValue: ChoosePrizePrompt, type: "ChoosePrizePrompt" },
      { classValue: CoinFlipPrompt, type: "CoinFlipPrompt" },
      { classValue: ConfirmPrompt, type: "ConfirmPrompt" },
      { classValue: InvitePlayerPrompt, type: "InvitePlayerPrompt" },
      { classValue: MoveDamagePrompt, type: "MoveDamagePrompt" },
      { classValue: MoveEnergyPrompt, type: "MoveEnergyPrompt" },
      { classValue: OrderCardsPrompt, type: "OrderCardsPrompt" },
      { classValue: PutDamagePrompt, type: "PutDamagePrompt" },
      { classValue: SelectPrompt, type: "SelectPrompt" },
      { classValue: ShowCardsPrompt, type: "ShowCardsPrompt" },
      { classValue: ShuffleDeckPrompt, type: "ShuffleDeckPrompt" },
      { classValue: ShuffleHandPrompt, type: "ShuffleHandPrompt" },
      { classValue: RemoveDamagePrompt, type: "RemoveDamagePrompt" },
      { classValue: DiscardEnergyPrompt, type: "DiscardEnergyPrompt" },
      { classValue: ConfirmCardsPrompt, type: "ConfirmCardsPrompt" },
      { classValue: SelectOptionPrompt, type: "SelectOptionPrompt" }
    ];
    this.types = this.rows.map((p) => p.type);
    this.classes = this.rows.map((p) => p.classValue);
  }
  serialize(prompt) {
    const data = Object.assign({}, prompt);
    const row = this.rows.find((r) => prompt instanceof r.classValue);
    if (row === void 0) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown prompt type '${prompt.type}'.`);
    }
    return Object.assign(Object.assign({}, data), { _type: row.type });
  }
  deserialize(data, context) {
    const row = this.rows.find((p) => p.type === data._type);
    if (row === void 0) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown prompt type '${data._type}'.`);
    }
    const prompt = Object.create(row.classValue.prototype);
    delete data._type;
    return Object.assign(prompt, data);
  }
};

// ../ptcg-server/dist/game/serializer/path-builder.js
var PathBuilder = class {
  constructor() {
    this.parents = [];
  }
  goTo(node, key) {
    const parentIndex = this.parents.findIndex((p) => p.node === node);
    if (parentIndex !== -1) {
      this.parents.length = parentIndex;
    }
    this.parents.push({ node, key });
  }
  getPath() {
    const parts = this.parents.map((p) => p.key).filter((key) => !!key);
    return parts.join(".");
  }
  getValue(root, path) {
    const parts = path.split(".");
    let value = root;
    try {
      for (const part of parts) {
        value = value[part];
      }
    } catch (error) {
      return;
    }
    return value;
  }
};

// ../ptcg-server/dist/utils/base64.js
var Base64 = class {
  constructor() {
    this.padchar = "=";
    this.alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  }
  getByte64(s, i) {
    const idx = this.alpha.indexOf(s.charAt(i));
    if (idx === -1) {
      throw new Error("Cannot decode base64");
    }
    return idx;
  }
  decode(s) {
    s = String(s);
    let pads = 0;
    let imax = s.length;
    if (imax === 0) {
      return s;
    }
    if (imax % 4 !== 0) {
      throw new Error("Cannot decode base64");
    }
    if (s.charAt(imax - 1) === this.padchar) {
      pads = 1;
      if (s.charAt(imax - 2) === this.padchar) {
        pads = 2;
      }
      imax -= 4;
    }
    const x = [];
    let b10;
    let i;
    for (i = 0; i < imax; i += 4) {
      b10 = this.getByte64(s, i) << 18 | this.getByte64(s, i + 1) << 12 | this.getByte64(s, i + 2) << 6 | this.getByte64(s, i + 3);
      x.push(String.fromCharCode(b10 >> 16, b10 >> 8 & 255, b10 & 255));
    }
    switch (pads) {
      case 1:
        b10 = this.getByte64(s, i) << 18 | this.getByte64(s, i + 1) << 12 | this.getByte64(s, i + 2) << 6;
        x.push(String.fromCharCode(b10 >> 16, b10 >> 8 & 255));
        break;
      case 2:
        b10 = this.getByte64(s, i) << 18 | this.getByte64(s, i + 1) << 12;
        x.push(String.fromCharCode(b10 >> 16));
        break;
      default:
    }
    return x.join("");
  }
  getByte(s, i) {
    const x = s.charCodeAt(i);
    if (x > 255) {
      throw new Error("INVALID_CHARACTER_ERR: DOM Exception 5");
    }
    return x;
  }
  encode(s) {
    s = String(s);
    const imax = s.length - s.length % 3;
    if (s.length === 0) {
      return s;
    }
    const x = [];
    let b10;
    let i;
    for (i = 0; i < imax; i += 3) {
      b10 = this.getByte(s, i) << 16 | this.getByte(s, i + 1) << 8 | this.getByte(s, i + 2);
      x.push(this.alpha.charAt(b10 >> 18));
      x.push(this.alpha.charAt(b10 >> 12 & 63));
      x.push(this.alpha.charAt(b10 >> 6 & 63));
      x.push(this.alpha.charAt(b10 & 63));
    }
    switch (s.length - imax) {
      case 1:
        b10 = this.getByte(s, i) << 16;
        x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt(b10 >> 12 & 63) + this.padchar + this.padchar);
        break;
      case 2:
        b10 = this.getByte(s, i) << 16 | this.getByte(s, i + 1) << 8;
        x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt(b10 >> 12 & 63) + this.alpha.charAt(b10 >> 6 & 63) + this.padchar);
        break;
      default:
    }
    return x.join("");
  }
};

// ../ptcg-server/dist/config.js
var config = {
  backend: {
    address: "https://play-server.twinleaf.gg",
    port: 8080,
    registrationEnabled: true,
    allowCors: true,
    tokenExpire: 21600,
    defaultPageSize: 50,
    avatarsDir: "",
    avatarsUrl: "/avatars/{name}",
    avatarFileSize: 256 * 1024,
    avatarMinSize: 64,
    avatarMaxSize: 512,
    replayFileSize: 512 * 1024,
    rateLimitCount: 1e3,
    wsRateLimitCount: 2e3,
    rateLimitTime: 6e4
    // Keeping this at 1 minute
  },
  core: {
    debug: false,
    // How often should we execute the background tasks
    schedulerInterval: 24 * 60 * 60 * 1e3,
    // Wait till next hour before running tasks
    schedulerStartNextHour: false,
    // Decrease players' ranking every day
    // If you wish to disable this feature set IntervalCount to 0
    rankingDecraseRate: 0.975,
    rankingDecraseTime: 7 * 24 * 60 * 60 * 1e3,
    rankingDecreaseIntervalCount: 0,
    // Deletes matches older than `keepMatchTike` from the database, to keep it small.
    // If you wish to disable this feature set IntervalCount to 0
    keepMatchTime: 14 * 24 * 60 * 60 * 1e3,
    keepMatchIntervalCount: 0,
    // Deletes users that doesn't log in in the `keepUserTime` and their ranking is 0
    // If you wish to disable this feature set IntervalCount to 0
    keepUserTime: 14 * 24 * 60 * 60 * 1e3,
    keepUserIntervalCount: 0
  },
  bots: {
    // Default password for bot user
    defaultPassword: "bot",
    // Delay between every action that bot is making
    actionDelay: 1500,
    // Simulate matches every X ticks of the scheduler
    // If set to 0, the bot matches are disabled
    botGamesIntervalCount: 0
  },
  sets: {
    scansDir: "",
    scansUrl: "{cardImage}"
  },
  email: {
    transporter: {
      sendmail: true,
      newline: "unix",
      path: "/usr/sbin/sendmail"
    },
    sender: "no-reply@twinleaf.gg",
    appName: "twinleaf",
    publicAddress: "http://play.twinleaf.gg"
    // Address inside the e-mail messages
  }
};

// ../ptcg-server/dist/utils/logger.js
var Logger = class {
  log(message) {
    if (!config.core.debug) {
      return;
    }
    console.log(message);
  }
};
var logger = new Logger();

// ../ptcg-server/dist/utils/scheduler.js
var Scheduler = class _Scheduler {
  constructor() {
    this.jobs = [];
  }
  static getInstance() {
    return _Scheduler.instance;
  }
  run(callback, counter = 1) {
    if (counter === 0) {
      return;
    }
    this.jobs.push({ counter, callback, value: 0 });
    if (this.intervalRef !== void 0 || this.timeoutRef !== void 0) {
      return;
    }
    if (!config.core.schedulerStartNextHour) {
      this.startInterval();
      return;
    }
    const msInHour = 60 * 60 * 1e3;
    const msToNextHour = msInHour - (/* @__PURE__ */ new Date()).getTime() % msInHour;
    this.timeoutRef = setTimeout(() => {
      this.timeoutRef = void 0;
      this.startInterval();
    }, msToNextHour);
  }
  startInterval() {
    if (this.jobs.length === 0 || this.intervalRef !== void 0) {
      return;
    }
    this.intervalRef = setInterval(() => {
      this.jobs.forEach((job) => {
        job.value += 1;
        if (job.value >= job.counter) {
          job.value = 0;
          job.callback();
        }
      });
    }, config.core.schedulerInterval);
  }
  stop(callback) {
    const index = this.jobs.findIndex((job) => job.callback === callback);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      if (this.jobs.length === 0) {
        if (this.timeoutRef !== void 0) {
          clearTimeout(this.timeoutRef);
          this.timeoutRef = void 0;
        }
        if (this.intervalRef !== void 0) {
          clearInterval(this.intervalRef);
          this.intervalRef = void 0;
        }
      }
    }
  }
};
Scheduler.instance = new Scheduler();

// ../ptcg-server/dist/game/serializer/json-patch.js
var JsonPatch = class {
  diff(src, dest) {
    const deltas = this.delta(src, dest, [], []);
    return deltas.map((d) => ({
      op: d.op,
      path: d.path.join("."),
      val: d.val
    }));
  }
  apply(src, patch) {
    let result = src;
    for (const delta of patch) {
      if (delta.path === "") {
        result = this.applyToObject(result, delta);
      } else {
        const item = this.fromPath(result, delta.path);
        if (item !== void 0) {
          const newValue = this.applyToObject(item.value, delta);
          item.holder[item.key] = newValue;
        }
      }
    }
    return result;
  }
  delta(src, dest, path, results) {
    if (src instanceof Object && dest instanceof Object) {
      if (src.constructor !== dest.constructor) {
        results.push({ op: "set", path, val: dest });
        return results;
      }
      if (src instanceof Array && dest instanceof Array) {
        return this.deltaArray(src, dest, path, results);
      }
      return this.deltaObject(src, dest, path, results);
    }
    if (src !== dest) {
      results.push({ op: "set", path, val: dest });
      return results;
    }
    return results;
  }
  deltaArray(src, dest, path, results) {
    const results1 = [];
    const results2 = [];
    src = src.slice();
    let i = 0;
    let j = 0;
    while (i < dest.length && j < src.length) {
      if (this.isEqual(src[j], dest[i])) {
        i += 1;
        j += 1;
      } else {
        let fromIndex = src.findIndex((value, index) => {
          return index > j && this.isEqual(value, dest[i]);
        });
        if (fromIndex !== -1) {
          const temp = src[fromIndex];
          src[fromIndex] = src[j];
          src[j] = temp;
          results1.push({ op: "move", path, val: [fromIndex, i] });
          j += 1;
          i += 1;
        } else {
          fromIndex = dest.findIndex((value, index) => {
            return index > i && this.isEqual(value, src[j]);
          });
          if (fromIndex === -1) {
            this.delta(src[j], dest[i], [...path, String(i)], results1);
          } else {
            src.splice(j, 0, dest[i]);
            results1.push({ op: "add", path, val: [i, dest[i]] });
          }
          j += 1;
          i += 1;
        }
      }
    }
    while (i < dest.length) {
      results1.push({ op: "add", path, val: [i, dest[i]] });
      i += 1;
    }
    const toDelete = [];
    while (j < src.length) {
      toDelete.push(j);
      j += 1;
    }
    if (toDelete.length > 0) {
      results1.push({ op: "del", path, val: toDelete });
    }
    results2.push({ op: "set", path, val: dest });
    const option1 = JSON.stringify(results1);
    const option2 = JSON.stringify(results2);
    results.push(...option1.length < option2.length ? results1 : results2);
    return results;
  }
  deltaObject(src, dest, path, results) {
    const srcKeys = Object.keys(src);
    const destKeys = Object.keys(dest);
    for (const key of destKeys) {
      if (!this.isEqual(src[key], dest[key])) {
        this.delta(src[key], dest[key], [...path, key], results);
      }
    }
    const toDelete = [];
    for (const key of srcKeys) {
      if (!destKeys.includes(key)) {
        toDelete.push(key);
      }
    }
    if (toDelete.length > 0) {
      results.push({ op: "del", path, val: toDelete });
    }
    return results;
  }
  isEqual(src, dest) {
    return deepCompare(src, dest);
  }
  applyToObject(root, delta) {
    switch (delta.op) {
      case "add": {
        const index = delta.val[0];
        const value = delta.val[1];
        root.splice(index, 0, value);
        break;
      }
      case "set":
        root = delta.val;
        break;
      case "del": {
        const toDelete = delta.val.slice();
        if (root instanceof Array) {
          toDelete.sort((a, b) => b - a);
          toDelete.forEach((idx) => {
            root.splice(idx, 1);
          });
        } else {
          toDelete.forEach((key) => {
            delete root[key];
          });
        }
        break;
      }
      case "move": {
        const arr = root;
        const fromKey = delta.val[0];
        const toKey = delta.val[1];
        const temp = arr[fromKey];
        arr[fromKey] = arr[toKey];
        arr[toKey] = temp;
        break;
      }
    }
    return root;
  }
  fromPath(root, path) {
    const parts = path.split(".");
    const result = { holder: root, key: "", value: root };
    try {
      for (const part of parts) {
        result.holder = result.value;
        result.value = result.value[part];
        result.key = part;
      }
    } catch (error) {
      return;
    }
    return result;
  }
};

// ../ptcg-server/dist/game/serializer/state-serializer.js
var StateSerializer = class _StateSerializer {
  constructor() {
    this.serializers = [
      new GenericSerializer(State, "State"),
      new GenericSerializer(Rules, "Rules"),
      new GenericSerializer(Player, "Player"),
      new GenericSerializer(Marker, "Marker"),
      new CardSerializer(),
      new CardListSerializer(),
      new StateLogSerializer(),
      new PromptSerializer()
    ];
  }
  serialize(state) {
    const serializers = this.serializers;
    const refs = [];
    const pathBuilder = new PathBuilder();
    const replacer = function(key, value) {
      pathBuilder.goTo(this, key);
      const path = pathBuilder.getPath();
      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object && value._type !== "Ref") {
        const ref = refs.find((r) => r.node === value);
        if (ref !== void 0) {
          return { _type: "Ref", path: ref.path };
        }
        refs.push({ node: value, path });
        const name = value.constructor.name;
        if (name === "Object") {
          return value;
        }
        const serializer = serializers.find((s) => s.classes.some((c) => value instanceof c));
        if (serializer !== void 0) {
          return serializer.serialize(value);
        }
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown serializer for '${name}'.`);
      }
      return value;
    };
    return JSON.stringify([state.players, state], replacer);
  }
  deserialize(serializedState) {
    const serializers = this.serializers;
    const context = this.restoreContext(serializedState);
    const reviver = function(key, value) {
      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object) {
        const name = value._type;
        if (typeof name === "string") {
          if (name === "Ref") {
            return value;
          }
          const serializer = serializers.find((s) => s.types.includes(name));
          if (serializer !== void 0) {
            return serializer.deserialize(value, context);
          }
          throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown deserializer for '${name}'.`);
        }
      }
      return value;
    };
    const parsed = JSON.parse(serializedState, reviver);
    const pathBuilder = new PathBuilder();
    deepIterate(parsed, (holder, key, value) => {
      if (value instanceof Object && value._type === "Ref") {
        const reference = pathBuilder.getValue(parsed, value.path);
        if (reference === void 0) {
          throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown reference '${value.path}'.`);
        }
        holder[key] = reference;
      }
    });
    const state = parsed[1];
    return state;
  }
  serializeDiff(base, state) {
    if (base === void 0) {
      return this.serialize(state);
    }
    const parsedBase = JSON.parse(base);
    const players1 = parsedBase[0];
    const state1 = parsedBase[1];
    const serialized2 = this.serialize(state);
    const parsed2 = JSON.parse(serialized2);
    const players2 = parsed2[0];
    const state2 = parsed2[1];
    const jsonPatch = new JsonPatch();
    const diff = jsonPatch.diff([players1, state1], [players2, state2]);
    return JSON.stringify([diff]);
  }
  deserializeDiff(base, data) {
    const updatedData = this.applyDiff(base, data);
    return this.deserialize(updatedData);
  }
  applyDiff(base, data) {
    if (base === void 0) {
      return data;
    }
    const parsed = JSON.parse(data);
    if (parsed.length > 1) {
      return data;
    }
    let [players, state] = JSON.parse(base);
    const diff = parsed[0];
    const jsonPatch = new JsonPatch();
    [players, state] = jsonPatch.apply([players, state], diff);
    return JSON.stringify([players, state]);
  }
  static setKnownCards(cards) {
    _StateSerializer.knownCards = cards;
  }
  restoreContext(serializedState) {
    const parsed = JSON.parse(serializedState);
    const names = parsed[1].cardNames;
    const cards = [];
    names.forEach((name, index) => {
      let card = _StateSerializer.knownCards.find((c) => c.fullName === name);
      if (card === void 0) {
        throw new GameError(GameCoreError.ERROR_SERIALIZER, `Unknown card '${name}'.`);
      }
      card = deepClone(card);
      card.id = index;
      cards.push(card);
    });
    return { cards };
  }
};
StateSerializer.knownCards = [];

// ../ptcg-server/dist/game/core/replay.js
var Replay = class {
  constructor(options = {}) {
    this.indexJumpSize = 16;
    this.turnMap = [];
    this.diffs = [];
    this.indexes = [];
    this.serializer = new StateSerializer();
    this.player1 = { name: "", userId: 0, ranking: 0 };
    this.player2 = { name: "", userId: 0, ranking: 0 };
    this.winner = GameWinner.NONE;
    this.created = 0;
    this.options = Object.assign({
      indexEnabled: true,
      appendEnabled: false
    }, options);
  }
  getStateCount() {
    return this.diffs.length;
  }
  getState(position) {
    if (position < 0 || position >= this.diffs.length) {
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }
    let stateData = this.diffs[0];
    const jumps = this.indexJumps(position);
    let i = 0;
    while (i !== position) {
      if (this.options.indexEnabled && jumps.length > 0) {
        const jump = jumps.shift() || 0;
        const index = this.indexes[jump / this.indexJumpSize - 1];
        stateData = this.serializer.applyDiff(stateData, index);
        i = jump;
      } else {
        i++;
        stateData = this.serializer.applyDiff(stateData, this.diffs[i]);
      }
    }
    return this.serializer.deserialize(stateData);
  }
  getTurnCount() {
    return this.turnMap.length;
  }
  getTurnPosition(turn) {
    if (turn < 0 || turn >= this.turnMap.length) {
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }
    return this.turnMap[turn];
  }
  setCreated(created) {
    this.created = created;
  }
  appendState(state) {
    const full = this.serializer.serialize(state);
    const diff = this.serializer.serializeDiff(this.prevState, state);
    if (diff === "[[]]") {
      return;
    }
    this.prevState = full;
    this.diffs.push(diff);
    if (this.options.indexEnabled) {
      this.rebuildIndex(this.diffs);
    }
    while (this.turnMap.length <= state.turn) {
      this.turnMap.push(this.diffs.length - 1);
    }
  }
  serialize() {
    const json = {
      player1: this.player1,
      player2: this.player2,
      winner: this.winner,
      created: this.created,
      turnMap: this.turnMap,
      states: this.swapQuotes(this.diffs)
    };
    return this.compress(JSON.stringify(json));
  }
  deserialize(replayData) {
    try {
      const data = JSON.parse(this.decompress(replayData));
      this.player1 = data.player1;
      this.player2 = data.player2;
      this.winner = data.winner;
      this.created = data.created;
      this.diffs = this.swapQuotes(data.states);
      this.turnMap = data.turnMap;
      if (this.options.indexEnabled) {
        this.rebuildIndex(this.diffs);
      }
      if (this.options.appendEnabled) {
        const lastState = this.getState(this.diffs.length - 1);
        this.prevState = this.serializer.serialize(lastState);
      }
    } catch (error) {
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }
  }
  swapQuotes(diffs) {
    return diffs.map((diff) => diff.replace(/["']/g, (c) => c === '"' ? "'" : '"'));
  }
  compress(data) {
    const compressed = gzip(data, { to: "string" });
    return compressed;
  }
  decompress(data) {
    const text = ungzip(data, { to: "string" });
    return text;
  }
  rebuildIndex(diffs) {
    if (diffs.length === 0) {
      this.indexes = [];
      return;
    }
    this.indexes = [];
    let i = this.indexJumpSize;
    while (i < diffs.length) {
      const jumps = this.indexJumps(i);
      let stateData = diffs[0];
      let pos = 0;
      for (let j = 0; j < jumps.length - 1; j++) {
        pos = jumps[j];
        const index = this.indexes[pos / this.indexJumpSize - 1];
        stateData = this.serializer.applyDiff(stateData, index);
      }
      let indexData = stateData;
      while (pos < i) {
        pos++;
        indexData = this.serializer.applyDiff(indexData, diffs[pos]);
      }
      const indexState = this.serializer.deserialize(indexData);
      const indexDiff = this.serializer.serializeDiff(stateData, indexState);
      this.indexes.push(indexDiff);
      i += this.indexJumpSize;
    }
  }
  indexJumps(position) {
    if (position < this.indexJumpSize) {
      return [];
    }
    const jumps = [this.indexJumpSize];
    if (position < this.indexJumpSize * 2) {
      return jumps;
    }
    const n = Math.floor(Math.log2(position));
    let jumpSize = Math.pow(2, n);
    let pos = 0;
    while (jumpSize >= this.indexJumpSize) {
      if (pos + jumpSize <= position) {
        jumps.push(pos + jumpSize);
        pos += jumpSize;
      }
      jumpSize = jumpSize / 2;
    }
    return jumps;
  }
};

// ../ptcg-server/dist/game/store/actions/add-player-action.js
var AddPlayerAction = class {
  constructor(clientId, name, deck) {
    this.clientId = clientId;
    this.name = name;
    this.deck = deck;
    this.type = "ADD_PLAYER";
  }
};

// ../ptcg-server/dist/game/store/actions/append-log-action.js
var AppendLogAction = class {
  constructor(id, message, params) {
    this.id = id;
    this.message = message;
    this.params = params;
    this.type = "APPEND_LOG_ACTION";
  }
};

// ../ptcg-server/dist/game/store/actions/change-avatar-action.js
var ChangeAvatarAction = class {
  constructor(id, avatarName, log) {
    this.id = id;
    this.avatarName = avatarName;
    this.log = log;
    this.type = "CHANGE_AVATAR";
  }
};

// ../ptcg-server/dist/game/store/actions/game-actions.js
var AttackAction = class {
  constructor(clientId, name) {
    this.clientId = clientId;
    this.name = name;
    this.type = "ATTACK_ACTION";
  }
};
var UseAbilityAction = class {
  constructor(clientId, name, target) {
    this.clientId = clientId;
    this.name = name;
    this.target = target;
    this.type = "USE_ABILITY_ACTION";
  }
};
var UseTrainerAbilityAction = class {
  constructor(clientId, name, target) {
    this.clientId = clientId;
    this.name = name;
    this.target = target;
    this.type = "USE_TRAINER_ABILITY_ACTION";
  }
};
var UseStadiumAction = class {
  constructor(clientId) {
    this.clientId = clientId;
    this.type = "USE_STADIUM_ACTION";
  }
};
var RetreatAction = class {
  constructor(clientId, benchIndex) {
    this.clientId = clientId;
    this.benchIndex = benchIndex;
    this.type = "RETREAT_ACTION";
  }
};
var PassTurnAction = class {
  constructor(clientId) {
    this.clientId = clientId;
    this.type = "PASS_TURN";
  }
};

// ../ptcg-server/dist/game/store/actions/invite-player-action.js
var InvitePlayerAction = class {
  constructor(clientId, name) {
    this.clientId = clientId;
    this.name = name;
    this.type = "INVITE_PLAYER";
  }
};

// ../ptcg-server/dist/game/store/actions/reorder-actions.js
var ReorderBenchAction = class {
  constructor(id, from, to) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.type = "REORDER_BENCH_ACTION";
  }
};
var ReorderHandAction = class {
  constructor(id, order) {
    this.id = id;
    this.order = order;
    this.type = "REORDER_HAND_ACTION";
  }
};

// ../ptcg-server/dist/game/store/actions/resolve-prompt-action.js
var ResolvePromptAction = class {
  constructor(id, result, log) {
    this.id = id;
    this.result = result;
    this.log = log;
    this.type = "RESOLVE_PROMPT";
  }
};

// ../ptcg-server/dist/game/store/card/pokemon-types.js
var PowerType;
(function(PowerType2) {
  PowerType2[PowerType2["POKEBODY"] = 0] = "POKEBODY";
  PowerType2[PowerType2["POKEPOWER"] = 1] = "POKEPOWER";
  PowerType2[PowerType2["ABILITY"] = 2] = "ABILITY";
  PowerType2[PowerType2["ANCIENT_TRAIT"] = 3] = "ANCIENT_TRAIT";
  PowerType2[PowerType2["HELD_ITEM"] = 4] = "HELD_ITEM";
  PowerType2[PowerType2["POKEMON_POWER"] = 5] = "POKEMON_POWER";
  PowerType2[PowerType2["VUNION_ASSEMBLY"] = 6] = "VUNION_ASSEMBLY";
  PowerType2[PowerType2["LEGEND_ASSEMBLY"] = 7] = "LEGEND_ASSEMBLY";
  PowerType2[PowerType2["TRAINER_ABILITY"] = 8] = "TRAINER_ABILITY";
  PowerType2[PowerType2["HOLONS_SPECIAL_ENERGY_EFFECT"] = 9] = "HOLONS_SPECIAL_ENERGY_EFFECT";
  PowerType2[PowerType2["MEGA_EVOLUTION_RULE"] = 10] = "MEGA_EVOLUTION_RULE";
  PowerType2[PowerType2["LV_X_RULE"] = 11] = "LV_X_RULE";
  PowerType2[PowerType2["BREAK_RULE"] = 12] = "BREAK_RULE";
  PowerType2[PowerType2["ARCEUS_RULE"] = 13] = "ARCEUS_RULE";
})(PowerType || (PowerType = {}));

// ../ptcg-server/dist/game/store/effects/game-effects.js
var GameEffects;
(function(GameEffects2) {
  GameEffects2["RETREAT_EFFECT"] = "RETREAT_EFFECT";
  GameEffects2["USE_ATTACK_EFFECT"] = "USE_ATTACK_EFFECT";
  GameEffects2["USE_STADIUM_EFFECT"] = "USE_STADIUM_EFFECT";
  GameEffects2["USE_POWER_EFFECT"] = "USE_POWER_EFFECT";
  GameEffects2["POWER_EFFECT"] = "POWER_EFFECT";
  GameEffects2["ATTACK_EFFECT"] = "ATTACK_EFFECT";
  GameEffects2["KNOCK_OUT_EFFECT"] = "KNOCK_OUT_EFFECT";
  GameEffects2["HEAL_EFFECT"] = "HEAL_EFFECT";
  GameEffects2["EVOLVE_EFFECT"] = "EVOLVE_EFFECT";
  GameEffects2["DRAW_PRIZES_EFFECT"] = "DRAW_PRIZES_EFFECT";
  GameEffects2["MOVE_CARDS_EFFECT"] = "MOVE_CARDS_EFFECT";
  GameEffects2["EFFECT_OF_ABILITY_EFFECT"] = "EFFECT_OF_ABILITY_EFFECT";
})(GameEffects || (GameEffects = {}));
var RetreatEffect = class {
  constructor(player, benchIndex) {
    this.type = GameEffects.RETREAT_EFFECT;
    this.preventDefault = false;
    this.ignoreStatusConditions = false;
    this.player = player;
    this.benchIndex = benchIndex;
    this.moveRetreatCostTo = player.discard;
  }
};
var UsePowerEffect = class {
  constructor(player, power, card, target) {
    this.type = GameEffects.USE_POWER_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
};
var UseTrainerPowerEffect = class {
  constructor(player, power, card, target) {
    this.type = GameEffects.USE_POWER_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
};
var PowerEffect = class {
  constructor(player, power, card, target) {
    this.type = GameEffects.POWER_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
};
var TrainerPowerEffect = class {
  constructor(player, power, card) {
    this.type = GameEffects.POWER_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.power = power;
    this.card = card;
  }
};
var UseAttackEffect = class {
  constructor(player, attack) {
    this.type = GameEffects.USE_ATTACK_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.attack = attack;
    this.source = player.active;
  }
};
var UseStadiumEffect = class {
  constructor(player, stadium) {
    this.type = GameEffects.USE_STADIUM_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.stadium = stadium;
  }
};
var AttackEffect = class {
  constructor(player, opponent, attack) {
    this.type = GameEffects.ATTACK_EFFECT;
    this.preventDefault = false;
    this.ignoreWeakness = false;
    this.ignoreResistance = false;
    this.invisibleTentacles = false;
    this.player = player;
    this.opponent = opponent;
    this.attack = attack;
    this.damage = attack.damage;
    this.source = player.active;
  }
};
var KnockOutEffect = class {
  constructor(player, target) {
    this.type = GameEffects.KNOCK_OUT_EFFECT;
    this.preventDefault = false;
    this.isLostCity = false;
    this.player = player;
    this.target = target;
    this.prizeCount = 1;
  }
};
var HealEffect = class {
  constructor(player, target, damage) {
    this.type = GameEffects.HEAL_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.target = target;
    this.damage = damage;
  }
};
var EvolveEffect = class {
  constructor(player, target, pokemonCard) {
    this.type = GameEffects.EVOLVE_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.target = target;
    this.pokemonCard = pokemonCard;
    this.target.triggerAnimation = true;
  }
};
var DrawPrizesEffect = class {
  constructor(player, prizes, destination) {
    this.type = GameEffects.DRAW_PRIZES_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.prizes = prizes;
    this.destination = destination;
  }
};
var MoveCardsEffect = class {
  constructor(source, destination, options = {}) {
    this.type = GameEffects.MOVE_CARDS_EFFECT;
    this.preventDefault = false;
    this.source = source;
    this.destination = destination;
    this.cards = options.cards;
    this.count = options.count;
    this.toTop = options.toTop;
    this.toBottom = options.toBottom;
    this.skipCleanup = options.skipCleanup;
  }
};

// ../ptcg-server/dist/game/store/card/trainer-card.js
var TrainerCard = class extends Card {
  constructor() {
    super(...arguments);
    this.superType = SuperType.TRAINER;
    this.trainerType = TrainerType.ITEM;
    this.format = Format.NONE;
    this.text = "";
    this.attacks = [];
    this.powers = [];
    this.firstTurn = false;
    this.stadiumDirection = "up";
  }
  reduceEffect(store, state, effect) {
    if (effect instanceof AttackEffect) {
      for (let i = 0; i < this.attacks.length; i++) {
        const attackEffect = this.attacks[i].effect;
        if (effect.attack === this.attacks[i] && attackEffect !== void 0 && typeof attackEffect === "function") {
          attackEffect(store, state, effect);
        }
      }
    } else if (effect instanceof PowerEffect) {
      for (let i = 0; i < this.powers.length; i++) {
        if (effect.power === this.powers[i] && effect.power.effect !== void 0) {
          return effect.power.effect(store, state, effect);
        }
      }
    }
    return state;
  }
};

// ../ptcg-server/dist/game/store/actions/abort-game-action.js
var AbortGameReason;
(function(AbortGameReason2) {
  AbortGameReason2[AbortGameReason2["TIME_ELAPSED"] = 0] = "TIME_ELAPSED";
  AbortGameReason2[AbortGameReason2["ILLEGAL_MOVES"] = 1] = "ILLEGAL_MOVES";
  AbortGameReason2[AbortGameReason2["DISCONNECTED"] = 2] = "DISCONNECTED";
})(AbortGameReason || (AbortGameReason = {}));
var AbortGameAction = class {
  constructor(culpritId, reason) {
    this.culpritId = culpritId;
    this.reason = reason;
    this.type = "ABORT_GAME";
  }
};

// ../ptcg-server/dist/game/store/effects/attack-effects.js
var AttackEffects;
(function(AttackEffects2) {
  AttackEffects2["APPLY_WEAKNESS_EFFECT"] = "APPLY_WEAKNESS_EFFECT";
  AttackEffects2["DEAL_DAMAGE_EFFECT"] = "DEAL_DAMAGE_EFFECT";
  AttackEffects2["PUT_DAMAGE_EFFECT"] = "PUT_DAMAGE_EFFECT";
  AttackEffects2["KNOCK_OUT_OPPONENT_EFFECT"] = "KNOCK_OUT_OPPONENT_EFFECT";
  AttackEffects2["AFTER_DAMAGE_EFFECT"] = "AFTER_DAMAGE_EFFECT";
  AttackEffects2["PUT_COUNTERS_EFFECT"] = "PUT_COUNTERS_EFFECT";
  AttackEffects2["DISCARD_CARD_EFFECT"] = "DISCARD_CARD_EFFECT";
  AttackEffects2["CARDS_TO_HAND_EFFECT"] = "CARDS_TO_HAND_EFFECT";
  AttackEffects2["GUST_OPPONENT_BENCH_EFFECT"] = "GUST_OPPONENT_BENCH_EFFECT";
  AttackEffects2["ADD_MARKER_EFFECT"] = "ADD_MARKER_EFFECT";
  AttackEffects2["ADD_SPECIAL_CONDITIONS_EFFECT"] = "ADD_SPECIAL_CONDITIONS_EFFECT";
  AttackEffects2["MOVED_TO_ACTIVE_BONUS_EFFECT"] = "MOVED_TO_ACTIVE_BONUS_EFFECT";
  AttackEffects2["LOST_ZONED_CARDS_EFFECT"] = "LOST_ZONED_CARDS_EFFECT";
})(AttackEffects || (AttackEffects = {}));
var AbstractAttackEffect = class {
  constructor(base) {
    this.attackEffect = base;
    this.player = base.player;
    this.opponent = base.opponent;
    this.attack = base.attack;
    this.source = base.player.active;
    this.target = base.opponent.active;
  }
};
var ApplyWeaknessEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.APPLY_WEAKNESS_EFFECT;
    this.preventDefault = false;
    this.ignoreResistance = false;
    this.ignoreWeakness = false;
    this.damage = damage;
  }
};
var DealDamageEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
    this.preventDefault = false;
    this.damageIncreased = false;
    this.damage = damage;
  }
};
var PutDamageEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.PUT_DAMAGE_EFFECT;
    this.preventDefault = false;
    this.damageReduced = false;
    this.damageIncreased = true;
    this.wasKnockedOutFromFullHP = false;
    this.weaknessApplied = false;
    this.damage = damage;
  }
};
var AfterDamageEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.AFTER_DAMAGE_EFFECT;
    this.preventDefault = false;
    this.damage = damage;
  }
};
var PutCountersEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.PUT_COUNTERS_EFFECT;
    this.preventDefault = false;
    this.damage = damage;
  }
};
var KOEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.PUT_DAMAGE_EFFECT;
    this.preventDefault = false;
    this.damageReduced = false;
    this.wasKnockedOutFromFullHP = false;
    this.damage = damage;
  }
};
var KnockOutOpponentEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.DEAL_DAMAGE_EFFECT;
    this.preventDefault = false;
    this.damage = damage;
  }
};
var DiscardCardsEffect = class extends AbstractAttackEffect {
  constructor(base, energyCards) {
    super(base);
    this.type = AttackEffects.DISCARD_CARD_EFFECT;
    this.preventDefault = false;
    this.cards = energyCards;
  }
};
var LostZoneCardsEffect = class extends AbstractAttackEffect {
  constructor(base, energyCards) {
    super(base);
    this.type = AttackEffects.LOST_ZONED_CARDS_EFFECT;
    this.preventDefault = false;
    this.cards = energyCards;
  }
};
var CardsToHandEffect = class extends AbstractAttackEffect {
  constructor(base, energyCards) {
    super(base);
    this.type = AttackEffects.DISCARD_CARD_EFFECT;
    this.preventDefault = false;
    this.cards = energyCards;
  }
};
var AddMarkerEffect = class extends AbstractAttackEffect {
  constructor(base, markerName, markerSource) {
    super(base);
    this.type = AttackEffects.ADD_MARKER_EFFECT;
    this.preventDefault = false;
    this.markerName = markerName;
    this.markerSource = markerSource;
  }
};
var AddSpecialConditionsEffect = class extends AbstractAttackEffect {
  constructor(base, specialConditions) {
    super(base);
    this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
    this.preventDefault = false;
    this.specialConditions = specialConditions;
  }
};
var RemoveSpecialConditionsEffect = class extends AbstractAttackEffect {
  constructor(base, specialConditions) {
    super(base);
    this.type = AttackEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
    this.preventDefault = false;
    if (specialConditions === void 0) {
      specialConditions = [
        SpecialCondition.PARALYZED,
        SpecialCondition.CONFUSED,
        SpecialCondition.ASLEEP,
        SpecialCondition.POISONED,
        SpecialCondition.BURNED
      ];
    }
    this.specialConditions = specialConditions;
  }
};
var HealTargetEffect = class extends AbstractAttackEffect {
  constructor(base, damage) {
    super(base);
    this.type = AttackEffects.ADD_MARKER_EFFECT;
    this.preventDefault = false;
    this.damage = damage;
  }
};

// ../ptcg-server/dist/game/store/effect-reducers/attack-effect.js
function attackReducer(store, state, effect) {
  if (effect instanceof PutDamageEffect) {
    const target = effect.target;
    const sourceOwner = StateUtils.findOwner(state, effect.source);
    const targetCard = target.getPokemonCard();
    if (targetCard === void 0) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    const opponent = StateUtils.getOpponent(state, effect.player);
    if (effect.attackEffect && target === opponent.active && !effect.weaknessApplied) {
      const applyWeakness = new ApplyWeaknessEffect(effect.attackEffect, effect.damage);
      applyWeakness.target = effect.target;
      applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
      applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
      state = store.reduceEffect(state, applyWeakness);
      effect.damage = applyWeakness.damage;
    }
    const damage = Math.max(0, effect.damage);
    target.damage += damage;
    const targetOwner = StateUtils.findOwner(state, target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
    if (damage > 0) {
      store.log(state, GameLog.LOG_PLAYER_DEALS_DAMAGE, {
        name: sourceOwner.name,
        damage,
        target: targetCard.name,
        effect: effect.attack.name
      });
      const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
      afterDamageEffect.target = effect.target;
      store.reduceEffect(state, afterDamageEffect);
    }
  }
  if (effect instanceof DealDamageEffect) {
    const base = effect.attackEffect;
    const applyWeakness = new ApplyWeaknessEffect(base, effect.damage);
    applyWeakness.target = effect.target;
    applyWeakness.ignoreWeakness = base.ignoreWeakness;
    applyWeakness.ignoreResistance = base.ignoreResistance;
    state = store.reduceEffect(state, applyWeakness);
    const dealDamage = new PutDamageEffect(base, applyWeakness.damage);
    dealDamage.target = effect.target;
    dealDamage.weaknessApplied = true;
    state = store.reduceEffect(state, dealDamage);
    return state;
  }
  if (effect instanceof KOEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === void 0) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    const opponent = StateUtils.getOpponent(state, effect.player);
    if (effect.attackEffect && target === opponent.active) {
      const applyWeakness = new ApplyWeaknessEffect(effect.attackEffect, effect.damage);
      applyWeakness.target = effect.target;
      applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
      applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
      state = store.reduceEffect(state, applyWeakness);
      effect.damage = applyWeakness.damage;
    }
    const damage = Math.max(0, effect.damage);
    target.damage += damage;
    const targetOwner = StateUtils.findOwner(state, target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
    if (damage > 0) {
      const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
      afterDamageEffect.target = effect.target;
      store.reduceEffect(state, afterDamageEffect);
    }
  }
  if (effect instanceof KnockOutOpponentEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === void 0) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    const damage = Math.max(0, effect.damage);
    target.damage += damage;
  }
  if (effect instanceof PutCountersEffect) {
    const target = effect.target;
    const sourceOwner = StateUtils.findOwner(state, effect.source);
    const targetCard = target.getPokemonCard();
    if (targetCard === void 0) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    const damage = Math.max(0, effect.damage);
    target.damage += damage;
    if (damage > 0) {
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
        name: sourceOwner.name,
        damage,
        target: targetCard.name,
        effect: effect.attack.name
      });
    }
  }
  if (effect instanceof AfterDamageEffect) {
    const targetOwner = StateUtils.findOwner(state, effect.target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
  }
  if (effect instanceof DiscardCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.discard);
    return state;
  }
  if (effect instanceof LostZoneCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.lostzone);
    return state;
  }
  if (effect instanceof CardsToHandEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.hand);
    return state;
  }
  if (effect instanceof AddMarkerEffect) {
    const target = effect.target;
    target.marker.addMarker(effect.markerName, effect.markerSource);
    return state;
  }
  if (effect instanceof HealTargetEffect) {
    const target = effect.target;
    const owner = StateUtils.findOwner(state, target);
    const healEffect = new HealEffect(owner, target, effect.damage);
    state = store.reduceEffect(state, healEffect);
    return state;
  }
  if (effect instanceof AddSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach((sp) => {
      target.addSpecialCondition(sp);
    });
    if (effect.poisonDamage !== void 0) {
      target.poisonDamage = effect.poisonDamage;
    }
    return state;
  }
  if (effect instanceof RemoveSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach((sp) => {
      target.removeSpecialCondition(sp);
    });
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/effects/play-card-effects.js
var PlayCardEffects;
(function(PlayCardEffects2) {
  PlayCardEffects2["ATTACH_ENERGY_EFFECT"] = "ATTACH_ENERGY_EFFECT";
  PlayCardEffects2["PLAY_POKEMON_EFFECT"] = "PLAY_POKEMON_EFFECT";
  PlayCardEffects2["PLAY_SUPPORTER_EFFECT"] = "PLAY_SUPPORTER_EFFECT";
  PlayCardEffects2["PLAY_STADIUM_EFFECT"] = "PLAY_STADIUM_EFFECT";
  PlayCardEffects2["PLAY_POKEMON_TOOL_EFFECT"] = "PLAY_POKEMON_TOOL_EFFECT";
  PlayCardEffects2["PLAY_ITEM_EFFECT"] = "PLAY_ITEM_EFFECT";
  PlayCardEffects2["TRAINER_EFFECT"] = "TRAINER_EFFECT";
  PlayCardEffects2["ENERGY_EFFECT"] = "ENERGY_EFFECT";
  PlayCardEffects2["TOOL_EFFECT"] = "TOOL_EFFECT";
  PlayCardEffects2["SUPPORTER_EFFECT"] = "SUPPORTER_EFFECT";
  PlayCardEffects2["COIN_FLIP_EFFECT"] = "COIN_FLIP_EFFECT";
  PlayCardEffects2["TRAINER_CARD_TO_DECK_EFFECT"] = "TRAINER_CARD_TO_DECK_EFFECT";
  PlayCardEffects2["DISCARD_TO_HAND_EFFECT"] = "DISCARD_TO_HAND_EFFECT";
  PlayCardEffects2["TRAINER_TARGET_EFFECT"] = "TRAINER_TARGET_EFFECT";
})(PlayCardEffects || (PlayCardEffects = {}));
var AttachEnergyEffect = class {
  constructor(player, energyCard, target) {
    this.type = PlayCardEffects.ATTACH_ENERGY_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.energyCard = energyCard;
    this.target = target;
  }
};
var PlayPokemonEffect = class {
  constructor(player, pokemonCard, target) {
    this.type = PlayCardEffects.PLAY_POKEMON_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
    if (pokemonCard.stage === Stage.BASIC) {
      this.target.showBasicAnimation = true;
    }
  }
};
var PlaySupporterEffect = class {
  constructor(player, trainerCard, target) {
    this.type = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
};
var PlayStadiumEffect = class {
  constructor(player, trainerCard) {
    this.type = PlayCardEffects.PLAY_STADIUM_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.trainerCard = trainerCard;
  }
};
var AttachPokemonToolEffect = class {
  constructor(player, trainerCard, target) {
    this.type = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
};
var PlayItemEffect = class {
  constructor(player, trainerCard, target) {
    this.type = PlayCardEffects.PLAY_ITEM_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
};
var TrainerEffect = class {
  constructor(player, trainerCard, target) {
    this.type = PlayCardEffects.TRAINER_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
};

// ../ptcg-server/dist/game/store/reducers/play-card-reducer.js
function findCardList(state, target) {
  const player = target.player === PlayerType.BOTTOM_PLAYER ? state.players[state.activePlayer] : state.players[state.activePlayer ? 0 : 1];
  switch (target.slot) {
    case SlotType.ACTIVE:
      return player.active;
    case SlotType.BENCH:
      return player.bench[target.index];
  }
}
function playCardReducer(store, state, action) {
  const player = state.players[state.activePlayer];
  if (state.phase === GamePhase.PLAYER_TURN) {
    if (action instanceof PlayCardAction) {
      if (player === void 0 || player.id !== action.id) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      const handCard = player.hand.cards[action.handIndex];
      if (handCard === void 0) {
        throw new GameError(GameMessage.UNKNOWN_CARD);
      }
      if (handCard instanceof EnergyCard) {
        const target = findCardList(state, action.target);
        if (!(target instanceof PokemonCardList) || target.cards.length === 0) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }
        if (player.usedDragonsWish === true || state.rules.unlimitedEnergyAttachments === true) {
          const effect = new AttachEnergyEffect(player, handCard, target);
          return store.reduceEffect(state, effect);
        } else {
          if (player.energyPlayedTurn === state.turn) {
            throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
          }
          player.energyPlayedTurn = state.turn;
          const effect = new AttachEnergyEffect(player, handCard, target);
          return store.reduceEffect(state, effect);
        }
      }
      if (handCard instanceof PokemonCard) {
        const target = findCardList(state, action.target);
        if (!(target instanceof PokemonCardList)) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }
        const effect = new PlayPokemonEffect(player, handCard, target);
        return store.reduceEffect(state, effect);
      }
      if (handCard instanceof TrainerCard) {
        const target = findCardList(state, action.target);
        let effect;
        switch (handCard.trainerType) {
          case TrainerType.SUPPORTER:
            if (state.turn === 1 && handCard.firstTurn !== true) {
              throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (player.supporter.cards.length > 0) {
              throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            effect = new PlaySupporterEffect(player, handCard, target);
            break;
          case TrainerType.STADIUM: {
            if (player.stadiumPlayedTurn === state.turn) {
              throw new GameError(GameMessage.STADIUM_ALREADY_PLAYED);
            }
            const stadium = StateUtils.getStadiumCard(state);
            if (stadium && stadium.name === handCard.name) {
              throw new GameError(GameMessage.SAME_STADIUM_ALREADY_IN_PLAY);
            }
            player.stadiumPlayedTurn = state.turn;
            effect = new PlayStadiumEffect(player, handCard);
            break;
          }
          case TrainerType.TOOL:
            if (!(target instanceof PokemonCardList)) {
              throw new GameError(GameMessage.INVALID_TARGET);
            }
            effect = new AttachPokemonToolEffect(player, handCard, target);
            break;
          default:
            effect = new PlayItemEffect(player, handCard, target);
            break;
        }
        return store.reduceEffect(state, effect);
      }
      player.hand.moveCardTo(handCard, player.supporter);
    }
  }
  return state;
}

// ../ptcg-server/dist/game/store/effect-reducers/play-energy-effect.js
function playEnergyReducer(store, state, effect) {
  if (effect instanceof AttachEnergyEffect) {
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === void 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    store.log(state, GameLog.LOG_PLAYER_ATTACHES_CARD, {
      name: effect.player.name,
      card: effect.energyCard.name,
      pokemon: pokemonCard.name
    });
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/effects/check-effects.js
var CheckEffects;
(function(CheckEffects2) {
  CheckEffects2["CHECK_HP_EFFECT"] = "CHECK_HP_EFFECT";
  CheckEffects2["CHECK_PRIZES_COUNT_EFFECT"] = "CHECK_PRIZE_COUNT_EFFECT";
  CheckEffects2["CHECK_POKEMON_STATS_EFFECT"] = "CHECK_POKEMON_STATS_EFFECT";
  CheckEffects2["CHECK_POKEMON_POWERS_EFFECT"] = "CHECK_POKEMON_POWERS_EFFECT";
  CheckEffects2["CHECK_POKEMON_ATTACKS_EFFECT"] = "CHECK_POKEMON_ATTACKS_EFFECT";
  CheckEffects2["CHECK_POKEMON_TYPE_EFFECT"] = "CHECK_POKEMON_TYPE_EFFECT";
  CheckEffects2["CHECK_RETREAT_COST_EFFECT"] = "CHECK_RETREAT_COST_EFFECT";
  CheckEffects2["CHECK_ATTACK_COST_EFFECT"] = "CHECK_ATTACK_COST_EFFECT";
  CheckEffects2["CHECK_ENOUGH_ENERGY_EFFECT"] = "CHECK_ENOUGH_ENERGY_EFFECT";
  CheckEffects2["CHECK_POKEMON_PLAYED_TURN_EFFECT"] = "CHECK_POKEMON_PLAYED_TURN_EFFECT";
  CheckEffects2["CHECK_TABLE_STATE_EFFECT"] = "CHECK_TABLE_STATE_EFFECT";
  CheckEffects2["ADD_SPECIAL_CONDITIONS_EFFECT"] = "ADD_SPECIAL_CONDITIONS_EFFECT";
  CheckEffects2["CHECK_PRIZES_DESTINATION_EFFECT"] = "CHECK_PRIZES_DESTINATION_EFFECT";
})(CheckEffects || (CheckEffects = {}));
var CheckPokemonPowersEffect = class {
  constructor(player, target) {
    this.type = CheckEffects.CHECK_POKEMON_POWERS_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.powers = pokemonCard ? pokemonCard.powers : [];
  }
};
var CheckPokemonAttacksEffect = class {
  constructor(player) {
    this.type = CheckEffects.CHECK_POKEMON_ATTACKS_EFFECT;
    this.preventDefault = false;
    this.player = player;
    const tool = player.active.tool;
    if (!!tool && tool.attacks.length > 0) {
      this.attacks = [...tool.attacks];
    } else {
      this.attacks = [];
    }
  }
};
var CheckHpEffect = class {
  constructor(player, target) {
    this.type = CheckEffects.CHECK_HP_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.hp = pokemonCard ? pokemonCard.hp : 0;
  }
};
var CheckPokemonPlayedTurnEffect = class {
  constructor(player, target) {
    this.type = CheckEffects.CHECK_POKEMON_PLAYED_TURN_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.target = target;
    this.pokemonPlayedTurn = target.pokemonPlayedTurn;
  }
};
var CheckPokemonStatsEffect = class {
  constructor(target) {
    this.type = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
    this.preventDefault = false;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.weakness = pokemonCard ? [...pokemonCard.weakness] : [];
    this.resistance = pokemonCard ? [...pokemonCard.resistance] : [];
  }
};
var CheckPokemonTypeEffect = class {
  constructor(target) {
    this.type = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
    this.preventDefault = false;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.cardTypes = pokemonCard ? [pokemonCard.cardType] : [];
    if (pokemonCard && pokemonCard.additionalCardTypes) {
      this.cardTypes = [...this.cardTypes, ...pokemonCard.additionalCardTypes];
    }
  }
};
var CheckRetreatCostEffect = class {
  constructor(player) {
    this.type = CheckEffects.CHECK_RETREAT_COST_EFFECT;
    this.preventDefault = false;
    this.player = player;
    const pokemonCard = player.active.getPokemonCard();
    this.cost = pokemonCard !== void 0 ? [...pokemonCard.retreat] : [];
  }
};
var CheckAttackCostEffect = class {
  constructor(player, attack) {
    this.type = CheckEffects.CHECK_ATTACK_COST_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.attack = attack;
    this.cost = [...attack.cost];
  }
};
var CheckProvidedEnergyEffect = class {
  constructor(player, source) {
    this.type = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
    this.preventDefault = false;
    this.energyMap = [];
    this.totalProvidedTypes = [];
    this.player = player;
    this.source = source === void 0 ? player.active : source;
  }
};
var CheckTableStateEffect = class {
  constructor(benchSizes) {
    this.type = CheckEffects.CHECK_TABLE_STATE_EFFECT;
    this.preventDefault = false;
    this.benchSizes = benchSizes;
  }
};
var AddSpecialConditionsPowerEffect = class {
  constructor(player, source, target, specialConditions, poisonDamage = 10, burnDamage = 20, sleepFlips = 1) {
    this.type = CheckEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.source = source;
    this.target = target;
    this.specialConditions = specialConditions;
    this.poisonDamage = poisonDamage;
    this.burnDamage = burnDamage;
    this.sleepFlips = sleepFlips;
  }
};
var CheckPrizesDestinationEffect = class {
  constructor(player, destination) {
    this.type = CheckEffects.CHECK_PRIZES_DESTINATION_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.destination = destination;
  }
};

// ../ptcg-server/dist/game/store/effect-reducers/play-pokemon-effect.js
function playPokemonReducer(store, state, effect) {
  if (effect instanceof PlayPokemonEffect) {
    const stage = effect.pokemonCard.stage;
    const isBasic = stage === Stage.BASIC;
    if (isBasic && effect.target.cards.length === 0) {
      store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, {
        name: effect.player.name,
        card: effect.pokemonCard.name
      });
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      effect.target.pokemonPlayedTurn = state.turn;
      effect.target.removeSpecialCondition(SpecialCondition.ABILITY_USED);
      return state;
    }
    const player = effect.player;
    const isEvolved = stage === Stage.STAGE_1 || Stage.STAGE_2;
    const evolvesFrom = effect.pokemonCard.evolvesFrom;
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === void 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) {
      const playedTurnEffect = new CheckPokemonPlayedTurnEffect(effect.player, effect.target);
      store.reduceEffect(state, playedTurnEffect);
      if (state.turn == 0 && player.canEvolve === false) {
        throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
      }
      if (state.turn == 1 && player.canEvolve === false) {
        throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
      }
      if (state.turn == 2 && player.canEvolve === false) {
        throw new GameError(GameMessage.CANNOT_EVOLVE_ON_YOUR_FIRST_TURN);
      }
      if (playedTurnEffect.pokemonPlayedTurn >= state.turn) {
        throw new GameError(GameMessage.POKEMON_CANT_EVOLVE_THIS_TURN);
      }
      const evolveEffect = new EvolveEffect(effect.player, effect.target, effect.pokemonCard);
      store.reduceEffect(state, evolveEffect);
      effect.target.specialConditions = [];
      effect.target.marker.markers = [];
      if (effect.target.specialConditions.includes(SpecialCondition.ABILITY_USED)) {
        effect.target.removeSpecialCondition(SpecialCondition.ABILITY_USED);
      }
      if (effect.target.boardEffect.includes(BoardEffect.ABILITY_USED)) {
        effect.target.removeBoardEffect(BoardEffect.ABILITY_USED);
      }
      return state;
    }
    throw new GameError(GameMessage.INVALID_TARGET);
  }
  return state;
}

// ../ptcg-server/dist/game/store/effect-reducers/play-trainer-effect.js
function playTrainerReducer(store, state, effect) {
  if (effect instanceof PlaySupporterEffect) {
    const player = effect.player;
    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);
    store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, {
      name: effect.player.name,
      card: effect.trainerCard.name
    });
    player.supporterTurn += 1;
    return state;
  }
  if (effect instanceof PlayStadiumEffect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    const stadiumCard = StateUtils.getStadiumCard(state);
    if (player.stadium.cards.length > 0) {
      if (stadiumCard && stadiumCard.tags.includes(CardTag.PRISM_STAR)) {
        player.stadium.moveTo(player.lostzone);
      } else {
        player.stadium.moveTo(player.discard);
      }
    }
    if (opponent.stadium.cards.length > 0) {
      if (stadiumCard && stadiumCard.tags.includes(CardTag.PRISM_STAR)) {
        opponent.stadium.moveTo(opponent.lostzone);
      } else {
        opponent.stadium.moveTo(opponent.discard);
      }
    }
    store.log(state, GameLog.LOG_PLAYER_PLAYS_STADIUM, {
      name: effect.player.name,
      card: effect.trainerCard.name
    });
    player.stadiumUsedTurn = 0;
    player.hand.moveCardTo(effect.trainerCard, player.stadium);
    return state;
  }
  if (effect instanceof AttachPokemonToolEffect) {
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === void 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (effect.target.tool !== void 0) {
      throw new GameError(GameMessage.POKEMON_TOOL_ALREADY_ATTACHED);
    }
    store.log(state, GameLog.LOG_PLAYER_PLAYS_TOOL, {
      name: effect.player.name,
      card: effect.trainerCard.name,
      pokemon: pokemonCard.name
    });
    effect.player.hand.moveCardTo(effect.trainerCard, effect.target);
    effect.target.tool = effect.trainerCard;
    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);
    return state;
  }
  if (effect instanceof PlayItemEffect) {
    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    effect.player.hand.moveCardTo(effect.trainerCard, effect.player.supporter);
    state = store.reduceEffect(state, playTrainer);
    store.log(state, GameLog.LOG_PLAYER_PLAYS_ITEM, {
      name: effect.player.name,
      card: effect.trainerCard.name
    });
    return state;
  }
  if (effect instanceof TrainerEffect) {
    if (effect.player.hand.cards.includes(effect.trainerCard)) {
      const isSupporter = effect.trainerCard.trainerType === TrainerType.SUPPORTER;
      const target = isSupporter ? effect.player.supporter : effect.player.discard;
      effect.player.hand.moveCardTo(effect.trainerCard, target);
    }
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/effects/game-phase-effects.js
var GamePhaseEffects;
(function(GamePhaseEffects2) {
  GamePhaseEffects2["BEGIN_TURN_EFFECT"] = "BEGIN_TURN_EFFECT";
  GamePhaseEffects2["END_TURN_EFFECT"] = "END_TURN_EFFECT";
  GamePhaseEffects2["WHO_BEGINS_EFFECT"] = "WHO_BEGINS_EFFECT";
  GamePhaseEffects2["BETWEEN_TURNS_EFFECT"] = "BETWEEN_TURNS_EFFECT";
  GamePhaseEffects2["CHOOSE_STARTING_POKEMON_EFFECT"] = "CHOOSE_STARTING_POKEMON_EFFECT";
  GamePhaseEffects2["DREW_TOPDECK_EFFECT"] = "DREW_TOPDECK_EFFECT";
  GamePhaseEffects2["CHOOSE_PRIZE_EFFECT"] = "CHOOSE_PRIZE_EFFECT";
  GamePhaseEffects2["AFTER_ATTACK_EFFECT"] = "AFTER_ATTACK_EFFECT";
})(GamePhaseEffects || (GamePhaseEffects = {}));
var BeginTurnEffect = class {
  constructor(player) {
    this.type = GamePhaseEffects.BEGIN_TURN_EFFECT;
    this.preventDefault = false;
    this.player = player;
  }
};
var DrewTopdeckEffect = class {
  constructor(player, handCard) {
    this.type = GamePhaseEffects.DREW_TOPDECK_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.handCard = handCard;
  }
};
var AfterAttackEffect = class {
  constructor(player) {
    this.type = GamePhaseEffects.AFTER_ATTACK_EFFECT;
    this.preventDefault = false;
    this.player = player;
  }
};
var EndTurnEffect = class {
  constructor(player) {
    this.type = GamePhaseEffects.END_TURN_EFFECT;
    this.preventDefault = false;
    this.player = player;
  }
};
var WhoBeginsEffect = class {
  constructor() {
    this.type = GamePhaseEffects.END_TURN_EFFECT;
    this.preventDefault = false;
  }
};
var BetweenTurnsEffect = class {
  constructor(player) {
    this.type = GamePhaseEffects.BETWEEN_TURNS_EFFECT;
    this.preventDefault = false;
    this.player = player;
    this.poisonDamage = player.active.poisonDamage;
    this.burnDamage = player.active.burnDamage;
    this.flipsForSleep = void 0;
    this.burnFlipResult = void 0;
    this.asleepFlipResult = void 0;
  }
};

// ../ptcg-server/dist/game/store/reducers/player-turn-reducer.js
function playerTurnReducer(store, state, action) {
  if (state.phase === GamePhase.PLAYER_TURN) {
    if (action instanceof PassTurnAction) {
      const player = state.players[state.activePlayer];
      if (player === void 0 || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      const endTurnEffect = new EndTurnEffect(player);
      state = store.reduceEffect(state, endTurnEffect);
      return state;
    }
    if (action instanceof RetreatAction) {
      const player = state.players[state.activePlayer];
      if (player === void 0 || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      const retreatEffect = new RetreatEffect(player, action.benchIndex);
      state = store.reduceEffect(state, retreatEffect);
      player.active.clearEffects();
      return state;
    }
    if (action instanceof AttackAction) {
      const player = state.players[state.activePlayer];
      if (player === void 0 || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      const pokemonCard = player.active.getPokemonCard();
      let attacks = [];
      if (pokemonCard) {
        attacks = [...pokemonCard.attacks];
      }
      player.bench.forEach((benchSlot) => {
        const benchPokemon = benchSlot.getPokemonCard();
        if (benchPokemon && benchPokemon.attacks.some((attack2) => attack2.useOnBench)) {
          const benchAttacks = benchPokemon.attacks.filter((attack2) => attack2.useOnBench);
          attacks.push(...benchAttacks);
          const attackEffect2 = new CheckPokemonAttacksEffect(player);
          state = store.reduceEffect(state, attackEffect2);
          attacks = [...attacks, ...attackEffect2.attacks];
        }
      });
      const attackEffect = new CheckPokemonAttacksEffect(player);
      state = store.reduceEffect(state, attackEffect);
      attacks = [...attacks, ...attackEffect.attacks];
      const attack = attacks.find((a) => a.name === action.name);
      if (attack === void 0) {
        throw new GameError(GameMessage.UNKNOWN_ATTACK);
      }
      const useAttackEffect = new UseAttackEffect(player, attack);
      state = store.reduceEffect(state, useAttackEffect);
      state.lastAttack = attack;
      if (!state.playerLastAttack) {
        state.playerLastAttack = {};
      }
      state.playerLastAttack[player.id] = attack;
      return state;
    }
    if (action instanceof UseAbilityAction) {
      const player = state.players[state.activePlayer];
      if (player === void 0 || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      let pokemonCard;
      switch (action.target.slot) {
        case SlotType.ACTIVE:
        case SlotType.BENCH: {
          const target = StateUtils.getTarget(state, player, action.target);
          pokemonCard = target.getPokemonCard();
          break;
        }
        case SlotType.DISCARD: {
          const discardCard = player.discard.cards[action.target.index];
          if (discardCard instanceof PokemonCard) {
            pokemonCard = discardCard;
          }
          break;
        }
        case SlotType.HAND: {
          const handCard = player.hand.cards[action.target.index];
          if (handCard instanceof PokemonCard) {
            pokemonCard = handCard;
          }
          break;
        }
      }
      if (pokemonCard !== void 0) {
        let power;
        if (action.target.slot === SlotType.ACTIVE || action.target.slot === SlotType.BENCH) {
          const target = StateUtils.getTarget(state, player, action.target);
          const powersEffect = new CheckPokemonPowersEffect(player, target);
          state = store.reduceEffect(state, powersEffect);
          power = [...pokemonCard.powers, ...powersEffect.powers].find((a) => a.name === action.name);
        } else {
          power = pokemonCard.powers.find((a) => a.name === action.name);
        }
        if (power === void 0) {
          throw new GameError(GameMessage.UNKNOWN_POWER);
        }
        const slot = action.target.slot;
        if (slot === SlotType.ACTIVE || slot === SlotType.BENCH) {
          if (!power.useWhenInPlay) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
        }
        if (slot === SlotType.HAND && !power.useFromHand) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
        if (slot === SlotType.DISCARD && !power.useFromDiscard) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
        state = store.reduceEffect(state, new UsePowerEffect(player, power, pokemonCard, action.target));
        return state;
      }
    }
    if (action instanceof UseTrainerAbilityAction) {
      const player = state.players[state.activePlayer];
      if (player === void 0 || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      let trainerCard;
      const discardCard = player.discard.cards[action.target.index];
      if (discardCard instanceof TrainerCard) {
        trainerCard = discardCard;
        if (trainerCard !== void 0) {
          let power;
          if (action.target.slot === SlotType.DISCARD) {
            power = trainerCard.powers.find((a) => a.name === action.name);
          }
          if (power === void 0) {
            throw new GameError(GameMessage.UNKNOWN_POWER);
          }
          const slot = action.target.slot;
          if (slot === SlotType.DISCARD && !power.useFromDiscard) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
          state = store.reduceEffect(state, new UseTrainerPowerEffect(player, power, trainerCard, action.target));
          return state;
        }
      }
    }
    if (action instanceof UseStadiumAction) {
      const player = state.players[state.activePlayer];
      if (player === void 0 || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }
      if (player.stadiumUsedTurn === state.turn) {
        throw new GameError(GameMessage.STADIUM_ALREADY_USED);
      }
      const stadium = StateUtils.getStadiumCard(state);
      if (stadium === void 0) {
        throw new GameError(GameMessage.NO_STADIUM_IN_PLAY);
      }
      state = store.reduceEffect(state, new UseStadiumEffect(player, stadium));
      return state;
    }
  }
  return state;
}

// ../ptcg-server/dist/game/store/prefabs/prefabs.js
function TAKE_SPECIFIC_PRIZES(store, state, player, prizes, options = {}) {
  let { destination = player.hand } = options;
  const { skipReduce = false } = options;
  let preventDefault = false;
  if (!skipReduce) {
    const drawPrizesEffect = new DrawPrizesEffect(player, prizes, destination);
    const prizesDestinationEffect = new CheckPrizesDestinationEffect(player, drawPrizesEffect.destination);
    store.reduceEffect(state, prizesDestinationEffect);
    if (!prizesDestinationEffect.preventDefault) {
      drawPrizesEffect.destination = prizesDestinationEffect.destination;
    }
    store.reduceEffect(state, drawPrizesEffect);
    preventDefault = drawPrizesEffect.preventDefault;
    destination = drawPrizesEffect.destination;
  } else {
    destination = player.hand;
  }
  if (!preventDefault) {
    prizes.forEach((prize) => {
      if (player.prizes.includes(prize)) {
        prize.moveTo(destination);
        if (destination === player.hand) {
          player.prizesTaken += 1;
        }
      }
    });
  }
}
function MOVE_CARDS(store, state, source, destination, options = {}) {
  return store.reduceEffect(state, new MoveCardsEffect(source, destination, options));
}

// ../ptcg-server/dist/game/store/reducers/setup-reducer.js
function putStartingPokemonsAndPrizes(player, cards, state) {
  if (cards.length === 0) {
    return;
  }
  player.hand.moveCardTo(cards[0], player.active);
  for (let i = 1; i < cards.length; i++) {
    player.hand.moveCardTo(cards[i], player.bench[i - 1]);
  }
  for (let i = 0; i < 6; i++) {
    player.deck.moveTo(player.prizes[i], 1);
  }
}
function* setupGame(next, store, state) {
  const player = state.players[0];
  const opponent = state.players[1];
  const basicPokemon = { superType: SuperType.POKEMON, stage: Stage.BASIC };
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };
  const whoBeginsEffect = new WhoBeginsEffect();
  store.reduceEffect(state, whoBeginsEffect);
  if (whoBeginsEffect.player) {
    state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
  } else {
    const coinFlipPrompt = new CoinFlipPrompt(player.id, GameMessage.SETUP_WHO_BEGINS_FLIP);
    yield store.prompt(state, coinFlipPrompt, (whoBegins) => {
      const goFirstPrompt = new SelectPrompt(whoBegins ? player.id : opponent.id, GameMessage.GO_FIRST, [GameMessage.YES, GameMessage.NO]);
      store.prompt(state, goFirstPrompt, (choice) => {
        if (choice === 0) {
          state.activePlayer = whoBegins ? 0 : 1;
        } else {
          state.activePlayer = whoBegins ? 1 : 0;
        }
        next();
      });
    });
  }
  let playerHasBasic = false;
  let opponentHasBasic = false;
  let playerCardsToDraw = 0;
  let opponentCardsToDraw = 0;
  while (!playerHasBasic || !opponentHasBasic) {
    if (!playerHasBasic) {
      player.hand.moveTo(player.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(player.id), (order) => {
        player.deck.applyOrder(order);
        player.deck.moveTo(player.hand, 7);
        playerHasBasic = player.hand.count(basicPokemon) > 0 || player.hand.cards.some((c) => c.tags.includes(CardTag.PLAY_DURING_SETUP));
        next();
      });
    }
    if (!opponentHasBasic) {
      opponent.hand.moveTo(opponent.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), (order) => {
        opponent.deck.applyOrder(order);
        opponent.deck.moveTo(opponent.hand, 7);
        opponentHasBasic = opponent.hand.count(basicPokemon) > 0 || opponent.hand.cards.some((c) => c.tags.includes(CardTag.PLAY_DURING_SETUP));
        next();
      });
    }
    if (playerHasBasic && !opponentHasBasic) {
      store.log(state, GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: opponent.name });
      yield store.prompt(state, [
        new ShowCardsPrompt(player.id, GameMessage.SETUP_OPPONENT_NO_BASIC, opponent.hand.cards, { allowCancel: false }),
        new AlertPrompt(opponent.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], (results) => {
        playerCardsToDraw++;
        next();
      });
    }
    if (!playerHasBasic && opponentHasBasic) {
      store.log(state, GameLog.LOG_SETUP_NO_BASIC_POKEMON, { name: player.name });
      yield store.prompt(state, [
        new ShowCardsPrompt(opponent.id, GameMessage.SETUP_OPPONENT_NO_BASIC, player.hand.cards, { allowCancel: false }),
        new AlertPrompt(player.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], (results) => {
        opponentCardsToDraw++;
        next();
      });
    }
  }
  const blocked = [];
  player.hand.cards.forEach((c, index) => {
    if (c.tags.includes(CardTag.PLAY_DURING_SETUP) || c instanceof PokemonCard && c.stage === Stage.BASIC) {
    } else {
      blocked.push(index);
    }
  });
  const blockedOpponent = [];
  opponent.hand.cards.forEach((c, index) => {
    if (c.tags.includes(CardTag.PLAY_DURING_SETUP) || c instanceof PokemonCard && c.stage === Stage.BASIC) {
    } else {
      blockedOpponent.push(index);
    }
  });
  yield store.prompt(state, [
    new ChooseCardsPrompt(player, GameMessage.CHOOSE_STARTING_POKEMONS, player.hand, {}, Object.assign(Object.assign({}, chooseCardsOptions), { blocked })),
    new ChooseCardsPrompt(opponent, GameMessage.CHOOSE_STARTING_POKEMONS, opponent.hand, {}, Object.assign(Object.assign({}, chooseCardsOptions), { blocked: blockedOpponent }))
  ], (choice) => {
    putStartingPokemonsAndPrizes(player, choice[0], state);
    putStartingPokemonsAndPrizes(opponent, choice[1], state);
    next();
  });
  const first = state.players[state.activePlayer];
  const second = state.players[state.activePlayer ? 0 : 1];
  first.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
    cardList.pokemonPlayedTurn = 1;
  });
  second.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
    cardList.pokemonPlayedTurn = 2;
  });
  if (playerCardsToDraw > 0) {
    const options = [];
    for (let i = playerCardsToDraw; i >= 0; i--) {
      options.push({ message: `Draw ${i} card(s)`, value: i });
    }
    return store.prompt(state, new SelectPrompt(player.id, GameMessage.WANT_TO_DRAW_CARDS, options.map((c) => c.message), { allowCancel: false }), (choice) => {
      const option = options[choice];
      const numCardsToDraw = option.value;
      player.deck.moveTo(player.hand, numCardsToDraw);
      return initNextTurn(store, state);
    });
  }
  if (opponentCardsToDraw > 0) {
    const options = [];
    for (let i = opponentCardsToDraw; i >= 0; i--) {
      options.push({ message: `Draw ${i} card(s)`, value: i });
    }
    return store.prompt(state, new SelectPrompt(opponent.id, GameMessage.WANT_TO_DRAW_CARDS, options.map((c) => c.message), { allowCancel: false }), (choice) => {
      const option = options[choice];
      const numCardsToDraw = option.value;
      opponent.deck.moveTo(opponent.hand, numCardsToDraw);
      return initNextTurn(store, state);
    });
  }
  return initNextTurn(store, state);
}
function createPlayer(id, name) {
  const player = new Player();
  player.id = id;
  player.name = name;
  for (let i = 0; i < 6; i++) {
    const prize = new CardList();
    prize.isSecret = true;
    player.prizes.push(prize);
  }
  for (let i = 0; i < 5; i++) {
    const bench = new PokemonCardList();
    bench.isPublic = true;
    player.bench.push(bench);
  }
  player.active.isPublic = true;
  player.discard.isPublic = true;
  player.lostzone.isPublic = true;
  player.stadium.isPublic = true;
  player.supporter.isPublic = true;
  return player;
}
function setupPhaseReducer(store, state, action) {
  if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {
    if (action instanceof AddPlayerAction) {
      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }
      if (state.players.length == 1 && state.players[0].id === action.clientId) {
        throw new GameError(GameMessage.ALREADY_PLAYING);
      }
      const deckAnalyser = new DeckAnalyser(action.deck);
      if (!deckAnalyser.isValid()) {
        throw new GameError(GameMessage.INVALID_DECK);
      }
      const player = createPlayer(action.clientId, action.name);
      player.deck = CardList.fromList(action.deck);
      player.deck.isSecret = true;
      player.deck.cards.forEach((c) => {
        state.cardNames.push(c.fullName);
        c.id = state.cardNames.length - 1;
      });
      state.players.push(player);
      if (state.players.length === 2) {
        state.phase = GamePhase.SETUP;
        const generator = setupGame(() => generator.next(), store, state);
        return generator.next().value;
      }
      return state;
    }
    if (action instanceof InvitePlayerAction) {
      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }
      if (state.players.length == 1 && state.players[0].id === action.clientId) {
        throw new GameError(GameMessage.ALREADY_PLAYING);
      }
      const player = createPlayer(action.clientId, action.name);
      state.players.push(player);
      state = store.prompt(state, new InvitePlayerPrompt(player.id, GameMessage.INVITATION_MESSAGE), (deck) => {
        if (deck === null) {
          store.log(state, GameLog.LOG_INVITATION_NOT_ACCEPTED, { name: player.name });
          const winner = GameWinner.NONE;
          state = endGame(store, state, winner);
          return;
        }
        const deckAnalyser = new DeckAnalyser(deck);
        if (!deckAnalyser.isValid()) {
          throw new GameError(GameMessage.INVALID_DECK);
        }
        player.deck = CardList.fromList(deck);
        player.deck.isSecret = true;
        player.deck.cards.forEach((c) => {
          state.cardNames.push(c.fullName);
          c.id = state.cardNames.length - 1;
        });
        if (state.players.length === 2) {
          state.phase = GamePhase.SETUP;
          const generator = setupGame(() => generator.next(), store, state);
          return generator.next().value;
        }
      });
      return state;
    }
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/effect-reducers/check-effect.js
function findKoPokemons(store, state) {
  const pokemons = [];
  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      const checkHpEffect = new CheckHpEffect(player, cardList);
      store.reduceEffect(state, checkHpEffect);
      if (cardList.damage >= checkHpEffect.hp) {
        pokemons.push({ playerNum: i, cardList });
      }
    });
  }
  return pokemons;
}
function handleBenchSizeChange(store, state, benchSizes) {
  if (state.benchSizeChangeHandled) {
    return state;
  }
  state.players.forEach((player, index) => {
    const benchSize = benchSizes[index];
    while (player.bench.length < benchSize) {
      const bench = new PokemonCardList();
      bench.isPublic = true;
      player.bench.push(bench);
    }
    if (player.bench.length === benchSize) {
      return;
    }
    const empty = [];
    for (let index2 = player.bench.length - 1; index2 >= 0; index2--) {
      const bench = player.bench[index2];
      const isEmpty = bench.cards.length === 0;
      if (player.bench.length - empty.length > benchSize && isEmpty) {
        empty.push(bench);
      }
    }
    if (player.bench.length - empty.length <= benchSize) {
      for (let i = player.bench.length - 1; i >= 0; i--) {
        if (empty.includes(player.bench[i])) {
          player.bench.splice(i, 1);
        }
      }
      return;
    }
    const count = player.bench.length - empty.length - benchSize;
    store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_DISCARD, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH], { min: count, max: count, allowCancel: false }), (results) => {
      results = results || [];
      const selected = [...empty, ...results];
      for (let i = player.bench.length - 1; i >= 0; i--) {
        if (selected.includes(player.bench[i])) {
          player.bench[i].moveTo(player.discard);
          player.bench.splice(i, 1);
        }
      }
    });
  });
  state.benchSizeChangeHandled = true;
  return state;
}
function chooseActivePokemons(state) {
  const prompts = [];
  for (const player of state.players) {
    const hasActive = player.active.cards.length > 0;
    const hasBenched = player.bench.some((bench) => bench.cards.length > 0);
    if (!hasActive && hasBenched) {
      const choose = new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH], { min: 1, allowCancel: false });
      prompts.push(choose);
    }
  }
  return prompts;
}
function choosePrizeCards(store, state, prizeGroups) {
  const prompts = [];
  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    for (const group of prizeGroups[i]) {
      const prizeLeft = player.getPrizeLeft();
      if (group.count > 0 && state.isSuddenDeath) {
        endGame(store, state, i === 0 ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2);
        return [];
      }
      if (group.count >= prizeLeft && prizeLeft > 0) {
        player.prizes.forEach((prizeList) => {
          prizeList.moveTo(group.destination || player.hand);
        });
        endGame(store, state, i === 0 ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2);
        return [];
      }
      if (group.count > prizeLeft) {
        group.count = prizeLeft;
      }
      if (group.count > 0) {
        let message = GameMessage.CHOOSE_PRIZE_CARD;
        if (group.destination === player.discard) {
          message = GameMessage.CHOOSE_PRIZE_CARD_TO_DISCARD;
        }
        const prompt = new ChoosePrizePrompt(player.id, message, {
          isSecret: player.prizes[0].isSecret,
          count: group.count,
          destination: group.destination
        });
        prompts.push(prompt);
      }
    }
  }
  return prompts;
}
function endGame(store, state, winner) {
  if (state.players.length !== 2) {
    return state;
  }
  if ([
    GamePhase.WAITING_FOR_PLAYERS,
    GamePhase.PLAYER_TURN,
    GamePhase.ATTACK,
    GamePhase.BETWEEN_TURNS
  ].includes(state.phase) === false) {
    return state;
  }
  switch (winner) {
    case GameWinner.NONE:
      store.log(state, GameLog.LOG_GAME_FINISHED);
      break;
    case GameWinner.DRAW:
      store.log(state, GameLog.LOG_GAME_FINISHED_DRAW);
      break;
    case GameWinner.PLAYER_1:
    case GameWinner.PLAYER_2: {
      const winnerName = winner === GameWinner.PLAYER_1 ? state.players[0].name : state.players[1].name;
      store.log(state, GameLog.LOG_GAME_FINISHED_WINNER, { name: winnerName });
      break;
    }
  }
  state.winner = winner;
  state.phase = GamePhase.FINISHED;
  return state;
}
function checkWinner(store, state, onComplete) {
  const points = [0, 0];
  const reasons = [[], []];
  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    if (player.active.cards.length === 0) {
      store.log(state, GameLog.LOG_PLAYER_NO_ACTIVE_POKEMON, { name: player.name });
      points[i === 0 ? 1 : 0]++;
      reasons[i === 0 ? 1 : 0].push("no_active");
    }
    if (player.prizes.every((p) => p.cards.length === 0)) {
      store.log(state, GameLog.LOG_PLAYER_NO_PRIZE_CARD, { name: player.name });
      points[i]++;
      reasons[i].push("no_prizes");
    }
  }
  if (points[0] > 0 && points[1] > 0) {
    return initiateSuddenDeath(store, state);
  }
  if (points[0] + points[1] === 0) {
    if (onComplete) {
      onComplete();
    }
    return state;
  }
  let winner = GameWinner.DRAW;
  if (points[0] > points[1]) {
    winner = GameWinner.PLAYER_1;
  } else if (points[1] > points[0]) {
    winner = GameWinner.PLAYER_2;
  }
  state = endGame(store, state, winner);
  if (onComplete) {
    onComplete();
  }
  return state;
}
function initiateSuddenDeath(store, state) {
  store.log(state, GameLog.LOG_SUDDEN_DEATH);
  state.players.forEach((player) => {
    [player.active, ...player.bench, player.discard, ...player.prizes, player.hand, player.lostzone, player.stadium].forEach((cardList) => cardList.moveTo(player.deck));
    player.usedGX = false;
    player.usedVSTAR = false;
    return store.prompt(state, new ShuffleDeckPrompt(player.id), (order) => {
      player.deck.applyOrder(order);
    });
  });
  return store.prompt(state, new CoinFlipPrompt(state.players[0].id, GameMessage.SETUP_WHO_BEGINS_FLIP), (result) => {
    const firstPlayer = result ? 0 : 1;
    setupSuddenDeathGame(store, state, firstPlayer);
  });
}
function setupSuddenDeathGame(store, state, firstPlayer) {
  state.activePlayer = firstPlayer;
  state.turn = 0;
  state.phase = GamePhase.SETUP;
  state.isSuddenDeath = true;
  const generator = setupGame(() => generator.next(), store, state);
  return generator.next().value;
}
function* executeCheckState(next, store, state, onComplete) {
  const prizeGroups = state.players.map(() => []);
  const pokemonsToDiscard = findKoPokemons(store, state);
  for (const pokemonToDiscard of pokemonsToDiscard) {
    const owner = state.players[pokemonToDiscard.playerNum];
    const knockOutEffect = new KnockOutEffect(owner, pokemonToDiscard.cardList);
    state = store.reduceEffect(state, knockOutEffect);
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
    if (knockOutEffect.preventDefault === false) {
      const opponentIndex = pokemonToDiscard.playerNum === 0 ? 1 : 0;
      const defaultDestination = state.players[opponentIndex].hand;
      const destination = knockOutEffect.prizeDestination || defaultDestination;
      let group = prizeGroups[opponentIndex].find((g) => g.destination === destination);
      if (!group) {
        group = { destination, count: 0 };
        prizeGroups[opponentIndex].push(group);
      }
      group.count += knockOutEffect.prizeCount;
    }
  }
  const checkTableStateEffect = new CheckTableStateEffect([5, 5]);
  store.reduceEffect(state, checkTableStateEffect);
  handleBenchSizeChange(store, state, checkTableStateEffect.benchSizes);
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }
  if (state.phase === GamePhase.FINISHED) {
    return state;
  }
  const prizePrompts = choosePrizeCards(store, state, prizeGroups);
  for (const prompt of prizePrompts) {
    const player = state.players.find((p) => p.id === prompt.playerId);
    if (!player) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    state = store.prompt(state, prompt, (result) => {
      const destination = prompt.options.destination || player.hand;
      TAKE_SPECIFIC_PRIZES(store, state, player, result, { destination });
    });
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
  }
  const activePrompts = chooseActivePokemons(state);
  for (const prompt of activePrompts) {
    const player = state.players.find((p) => p.id === prompt.playerId);
    if (!player) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    state = store.prompt(state, prompt, (result) => {
      const selectedPokemon = result;
      if (selectedPokemon.length !== 1) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const benchIndex = player.bench.indexOf(selectedPokemon[0]);
      if (benchIndex === -1 || player.active.cards.length > 0) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const temp = player.active;
      const playerActive = player.active.getPokemonCard();
      player.active = player.bench[benchIndex];
      if (playerActive) {
        playerActive.movedToActiveThisTurn = true;
      }
      player.bench[benchIndex] = temp;
    });
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
  }
  checkWinner(store, state, onComplete);
  state.benchSizeChangeHandled = false;
  return state;
}
function checkState(store, state, onComplete) {
  if ([GamePhase.PLAYER_TURN, GamePhase.ATTACK, GamePhase.BETWEEN_TURNS].includes(state.phase) === false) {
    if (onComplete !== void 0) {
      onComplete();
    }
    return state;
  }
  const generator = executeCheckState(() => generator.next(), store, state, onComplete);
  return generator.next().value;
}
function checkStateReducer(store, state, effect) {
  if (effect instanceof CheckProvidedEnergyEffect) {
    effect.source.cards.forEach((c) => {
      if (c instanceof EnergyCard && !effect.energyMap.some((e) => e.card === c)) {
        effect.energyMap.push({ card: c, provides: c.provides });
      }
    });
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/effect-reducers/game-phase-effect.js
function getActivePlayer(state) {
  return state.players[state.activePlayer];
}
function betweenTurns(store, state, onComplete) {
  if (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK) {
    state.phase = GamePhase.BETWEEN_TURNS;
  }
  for (const player of state.players) {
    store.reduceEffect(state, new BetweenTurnsEffect(player));
  }
  if (store.hasPrompts()) {
    return store.waitPrompt(state, () => {
      checkState(store, state, () => onComplete());
    });
  }
  return checkState(store, state, () => onComplete());
}
function initNextTurn(store, state) {
  if ([GamePhase.SETUP, GamePhase.BETWEEN_TURNS].indexOf(state.phase) === -1) {
    return state;
  }
  let player = getActivePlayer(state);
  if (state.phase === GamePhase.SETUP) {
    state.phase = GamePhase.PLAYER_TURN;
  }
  if (state.phase === GamePhase.BETWEEN_TURNS) {
    if (player.usedTurnSkip) {
      state.activePlayer = state.activePlayer;
    } else {
      state.activePlayer = state.activePlayer ? 0 : 1;
    }
    state.phase = GamePhase.PLAYER_TURN;
    player = getActivePlayer(state);
  }
  state.turn++;
  store.log(state, GameLog.LOG_TURN, { turn: state.turn });
  if (state.turn === 1 && !state.rules.firstTurnDrawCard) {
    return state;
  }
  store.log(state, GameLog.LOG_PLAYER_DRAWS_CARD, { name: player.name });
  if (player.deck.cards.length === 0) {
    store.log(state, GameLog.LOG_PLAYER_NO_CARDS_IN_DECK, { name: player.name });
    const winner = state.activePlayer ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2;
    state = endGame(store, state, winner);
    return state;
  }
  try {
    const beginTurn = new BeginTurnEffect(player);
    store.reduceEffect(state, beginTurn);
  } catch (_a) {
    return state;
  }
  player.deck.moveTo(player.hand, 1);
  const drawnCard = player.hand.cards[player.hand.cards.length - 1];
  try {
    const drewTopdeck = new DrewTopdeckEffect(player, drawnCard);
    store.reduceEffect(state, drewTopdeck);
  } catch (_b) {
    return state;
  }
  return state;
}
function startNextTurn(store, state) {
  const player = state.players[state.activePlayer];
  store.log(state, GameLog.LOG_PLAYER_ENDS_TURN, { name: player.name });
  player.active.removeSpecialCondition(SpecialCondition.PARALYZED);
  player.supporter.moveTo(player.discard);
  return betweenTurns(store, state, () => {
    if (state.phase !== GamePhase.FINISHED) {
      return initNextTurn(store, state);
    }
  });
}
function handleSpecialConditions(store, state, effect) {
  const player = effect.player;
  for (const sp of player.active.specialConditions) {
    const flipsForSleep = [];
    switch (sp) {
      case SpecialCondition.POISONED:
        player.active.damage += effect.poisonDamage;
        break;
      case SpecialCondition.BURNED:
        player.active.damage += effect.burnDamage;
        if (effect.burnFlipResult === true) {
          break;
        }
        if (effect.burnFlipResult === false) {
          player.active.damage += effect.burnDamage;
          break;
        }
        store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.FLIP_BURNED), (result) => {
          if (result === true) {
            player.active.removeSpecialCondition(SpecialCondition.BURNED);
          }
        });
        break;
      case SpecialCondition.ASLEEP:
        if (effect.asleepFlipResult === true) {
          player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
          break;
        }
        if (effect.asleepFlipResult === false) {
          break;
        }
        for (let i = 0; i < effect.player.active.sleepFlips; i++) {
          store.log(state, GameLog.LOG_FLIP_ASLEEP, { name: player.name });
          flipsForSleep.push(new CoinFlipPrompt(player.id, GameMessage.FLIP_ASLEEP));
        }
        if (flipsForSleep.length > 0) {
          store.prompt(state, flipsForSleep, (results) => {
            const wakesUp = Array.isArray(results) ? results.every((r) => r) : results;
            if (wakesUp) {
              player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
            }
          });
        } else {
          player.active.removeSpecialCondition(SpecialCondition.ASLEEP);
        }
        break;
    }
  }
}
function gamePhaseReducer(store, state, effect) {
  if (effect instanceof EndTurnEffect) {
    const player = state.players[state.activePlayer];
    player.canEvolve = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
      cardList.removeSpecialCondition(SpecialCondition.ABILITY_USED);
      cardList.removeBoardEffect(BoardEffect.ABILITY_USED);
    });
    effect.player.marker.removeMarker(effect.player.DAMAGE_DEALT_MARKER);
    player.supporterTurn = 0;
    if (player === void 0) {
      throw new GameError(GameMessage.NOT_YOUR_TURN);
    }
    state = checkState(store, state, () => {
      if (state.phase === GamePhase.FINISHED) {
        return;
      }
      return startNextTurn(store, state);
    });
    return state;
  }
  if (effect instanceof BetweenTurnsEffect) {
    handleSpecialConditions(store, state, effect);
  }
  return state;
}

// ../ptcg-server/dist/game/store/effect-reducers/game-effect.js
function applyWeaknessAndResistance(damage, cardTypes, additionalCardTypes, weakness, resistance) {
  let multiply = 1;
  let modifier = 0;
  const allTypes = [...cardTypes, ...additionalCardTypes];
  for (const item of weakness) {
    if (allTypes.includes(item.type)) {
      if (item.value === void 0) {
        multiply *= 2;
      } else {
        modifier += item.value;
      }
    }
  }
  for (const item of resistance) {
    if (allTypes.includes(item.type)) {
      modifier += item.value;
    }
  }
  return damage * multiply + modifier;
}
function* useAttack(next, store, state, effect) {
  var _a;
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  if (state.turn === 1 && effect.attack.canUseOnFirstTurn !== true && state.rules.attackFirstTurn == false) {
    throw new GameError(GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
  }
  const sp = player.active.specialConditions;
  if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
    throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
  }
  const attack = effect.attack;
  let attackingPokemon = player.active;
  player.bench.forEach((benchSlot) => {
    const benchPokemon = benchSlot.getPokemonCard();
    if (benchPokemon && benchPokemon.attacks.some((a) => a.name === attack.name && a.useOnBench)) {
      attackingPokemon = benchSlot;
    }
  });
  const checkAttackCost = new CheckAttackCostEffect(player, attack);
  state = store.reduceEffect(state, checkAttackCost);
  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, attackingPokemon);
  state = store.reduceEffect(state, checkProvidedEnergy);
  if (StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
    throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
  }
  if (sp.includes(SpecialCondition.CONFUSED)) {
    let flip = false;
    store.log(state, GameLog.LOG_FLIP_CONFUSION, { name: player.name });
    yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.FLIP_CONFUSION), (result) => {
      flip = result;
      next();
    });
    if (flip === false) {
      store.log(state, GameLog.LOG_HURTS_ITSELF);
      player.active.damage += 30;
      state = store.reduceEffect(state, new EndTurnEffect(player));
      return state;
    }
  }
  store.log(state, GameLog.LOG_PLAYER_USES_ATTACK, { name: player.name, attack: attack.name });
  state.phase = GamePhase.ATTACK;
  const attackEffect = effect instanceof AttackEffect ? effect : new AttackEffect(player, opponent, attack);
  state = store.reduceEffect(state, attackEffect);
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }
  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }
  const afterAttackEffect = new AfterAttackEffect(effect.player);
  store.reduceEffect(state, afterAttackEffect);
  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }
  state = checkState(store, state);
  if (opponent.active.cards.length === 0) {
    yield store.waitPrompt(state, () => next());
  }
  const attackThisTurn = player.active.attacksThisTurn;
  const playerActive = player.active.getPokemonCard();
  const canAttackAgain = playerActive && playerActive.canAttackTwice && attackThisTurn && attackThisTurn < 2;
  const hasBarrageAbility = (_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.powers.some((power) => power.barrage === true);
  if (canAttackAgain || hasBarrageAbility) {
    yield store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_ATTACK_AGAIN), (wantToAttackAgain) => {
      if (wantToAttackAgain) {
        if (hasBarrageAbility) {
          const attackableCards = player.active.cards.filter((card) => card.superType === SuperType.POKEMON || card.superType === SuperType.TRAINER && card instanceof TrainerCard && card.trainerType === TrainerType.TOOL && card.attacks.length > 0);
          store.prompt(state, new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, attackableCards, { allowCancel: false }), (selectedAttack) => {
            if (selectedAttack) {
              const secondAttackEffect = new AttackEffect(player, opponent, selectedAttack);
              state = useAttack(() => next(), store, state, secondAttackEffect).next().value;
              if (store.hasPrompts()) {
                state = store.waitPrompt(state, () => next());
              }
              if (secondAttackEffect.damage > 0) {
                const dealDamage = new DealDamageEffect(secondAttackEffect, secondAttackEffect.damage);
                state = store.reduceEffect(state, dealDamage);
              }
              state = store.reduceEffect(state, new EndTurnEffect(player));
              return state;
            }
            next();
          });
        } else {
          const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
          state = store.reduceEffect(state, dealDamage);
          state = store.reduceEffect(state, new EndTurnEffect(player));
        }
      } else {
        state = store.reduceEffect(state, new EndTurnEffect(player));
      }
      next();
    });
  }
  if (!canAttackAgain && !hasBarrageAbility) {
    return store.reduceEffect(state, new EndTurnEffect(player));
  }
}
function gameReducer(store, state, effect) {
  if (effect instanceof KnockOutEffect) {
    const card = effect.target.getPokemonCard();
    if (card !== void 0) {
      if (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex) || card.tags.includes(CardTag.POKEMON_GX)) {
        effect.prizeCount += 1;
      }
      if (card.tags.includes(CardTag.POKEMON_SV_MEGA) || card.tags.includes(CardTag.TAG_TEAM) || card.tags.includes(CardTag.DUAL_LEGEND)) {
        effect.prizeCount += 1;
      }
      if (card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.POKEMON_VUNION)) {
        effect.prizeCount += 2;
      }
      store.log(state, GameLog.LOG_POKEMON_KO, { name: card.name });
      if (effect.target.marker.hasMarker("LOST_CITY_MARKER") || card.tags.includes(CardTag.PRISM_STAR)) {
        const lostZoned = new CardList();
        const attachedCards = new CardList();
        const pokemonIndices = effect.target.cards.map((card2, index) => index);
        effect.target.damage = 0;
        effect.target.clearEffects();
        for (let i = pokemonIndices.length - 1; i >= 0; i--) {
          const removedCard = effect.target.cards.splice(pokemonIndices[i], 1)[0];
          if (removedCard.cards) {
            const cards = removedCard.cards;
            while (cards.cards.length > 0) {
              const card2 = cards.cards[0];
              attachedCards.cards.push(card2);
              cards.cards.splice(0, 1);
            }
          }
          if (removedCard.superType === SuperType.POKEMON || removedCard.stage === Stage.BASIC || removedCard.tags.includes(CardTag.PRISM_STAR)) {
            lostZoned.cards.push(removedCard);
          } else {
            attachedCards.cards.push(removedCard);
          }
        }
        if (attachedCards.cards.length > 0) {
          state = MOVE_CARDS(store, state, attachedCards, effect.player.discard);
        }
        if (lostZoned.cards.length > 0) {
          state = MOVE_CARDS(store, state, lostZoned, effect.player.lostzone);
        }
      } else {
        effect.target.clearEffects();
        state = MOVE_CARDS(store, state, effect.target, effect.player.discard);
      }
    }
  }
  if (effect instanceof ApplyWeaknessEffect) {
    const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
    state = store.reduceEffect(state, checkPokemonType);
    const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
    state = store.reduceEffect(state, checkPokemonStats);
    const cardType = checkPokemonType.cardTypes;
    const additionalCardTypes = checkPokemonType.cardTypes;
    const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
    const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
    effect.damage = applyWeaknessAndResistance(effect.damage, cardType, additionalCardTypes, weakness, resistance);
    return state;
  }
  if (effect instanceof UseAttackEffect) {
    const generator = useAttack(() => generator.next(), store, state, effect);
    return generator.next().value;
  }
  if (effect instanceof UsePowerEffect) {
    const player = effect.player;
    const power = effect.power;
    const card = effect.card;
    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
    state = store.reduceEffect(state, new PowerEffect(player, power, card));
    return state;
  }
  if (effect instanceof UseTrainerPowerEffect) {
    const player = effect.player;
    const power = effect.power;
    const card = effect.card;
    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
    state = store.reduceEffect(state, new TrainerPowerEffect(player, power, card));
    return state;
  }
  if (effect instanceof AddSpecialConditionsPowerEffect) {
    const target = effect.target;
    effect.specialConditions.forEach((sp) => {
      target.addSpecialCondition(sp);
    });
    if (effect.poisonDamage !== void 0) {
      target.poisonDamage = effect.poisonDamage;
    }
    if (effect.burnDamage !== void 0) {
      target.burnDamage = effect.burnDamage;
    }
    if (effect.sleepFlips !== void 0) {
      target.sleepFlips = effect.sleepFlips;
    }
    return state;
  }
  if (effect instanceof UseStadiumEffect) {
    const player = effect.player;
    store.log(state, GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
    player.stadiumUsedTurn = state.turn;
  }
  if (effect instanceof HealEffect) {
    effect.target.damage = Math.max(0, effect.target.damage - effect.damage);
    return state;
  }
  if (effect instanceof EvolveEffect) {
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === void 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    store.log(state, GameLog.LOG_PLAYER_EVOLVES_POKEMON, {
      name: effect.player.name,
      pokemon: pokemonCard.name,
      card: effect.pokemonCard.name
    });
    effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
    effect.target.pokemonPlayedTurn = state.turn;
    effect.target.specialConditions = [];
    effect.target.marker.markers = [];
    effect.target.marker.markers = [];
    effect.target.marker.markers = [];
  }
  if (effect instanceof MoveCardsEffect) {
    const source = effect.source;
    const destination = effect.destination;
    if (source instanceof PokemonCardList) {
      source.clearEffects();
      source.damage = 0;
      source.specialConditions = [];
      source.marker.markers = [];
      source.tool = void 0;
      source.removeBoardEffect(BoardEffect.ABILITY_USED);
    }
    if (effect.cards) {
      if (source instanceof PokemonCardList) {
        source.moveCardsTo(effect.cards, destination);
        if (effect.toBottom) {
          destination.cards = [...destination.cards.slice(effect.cards.length), ...effect.cards];
        } else if (effect.toTop) {
          destination.cards = [...effect.cards, ...destination.cards];
        }
      } else {
        source.moveCardsTo(effect.cards, destination);
        if (effect.toBottom) {
          destination.cards = [...destination.cards.slice(effect.cards.length), ...effect.cards];
        } else if (effect.toTop) {
          destination.cards = [...effect.cards, ...destination.cards];
        }
      }
    } else if (effect.count !== void 0) {
      const cards = source.cards.slice(0, effect.count);
      source.moveCardsTo(cards, destination);
      if (effect.toBottom) {
        destination.cards = [...destination.cards.slice(cards.length), ...cards];
      } else if (effect.toTop) {
        destination.cards = [...cards, ...destination.cards];
      }
    } else {
      if (effect.toTop) {
        source.moveToTopOfDestination(destination);
      } else {
        source.moveTo(destination);
      }
    }
    if (source instanceof PokemonCardList && source.getPokemons().length === 0) {
      const player = StateUtils.findOwner(state, source);
      source.moveTo(player.discard);
    }
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/reducers/player-state-reducer.js
function playerStateReducer(store, state, action) {
  if (action instanceof ReorderBenchAction) {
    const player = state.players.find((p) => p.id === action.id);
    if (player === void 0 || player.bench[action.from] === void 0) {
      return state;
    }
    const temp = player.bench[action.from];
    player.bench[action.from] = player.bench[action.to];
    player.bench[action.to] = temp;
    return state;
  }
  if (action instanceof ChangeAvatarAction) {
    const player = state.players.find((p) => p.id === action.id);
    if (player === void 0) {
      return state;
    }
    player.avatarName = action.avatarName;
    if (action.log) {
      store.log(state, action.log.message, action.log.params, player.id);
    }
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/effect-reducers/retreat-effect.js
function retreatPokemon(store, state, effect) {
  const player = effect.player;
  const activePokemon = player.active.getPokemonCard();
  const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
  if (activePokemon === void 0 || benchedPokemon === void 0) {
    return;
  }
  store.log(state, GameLog.LOG_PLAYER_RETREATS, {
    name: player.name,
    active: activePokemon.name,
    benched: benchedPokemon.name
  });
  player.retreatedTurn = state.turn;
  player.switchPokemon(player.bench[effect.benchIndex]);
}
function flatMap(array, fn) {
  return array.reduce((acc, item) => acc.concat(fn(item)), []);
}
function retreatReducer(store, state, effect) {
  if (effect instanceof RetreatEffect) {
    const player = effect.player;
    if (player.bench[effect.benchIndex].cards.length === 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    const sp = player.active.specialConditions;
    if ((sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) && !effect.ignoreStatusConditions) {
      throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
    }
    if (player.retreatedTurn === state.turn) {
      throw new GameError(GameMessage.RETREAT_ALREADY_USED);
    }
    const checkRetreatCost = new CheckRetreatCostEffect(effect.player);
    state = store.reduceEffect(state, checkRetreatCost);
    if (checkRetreatCost.cost.length === 0) {
      player.active.clearEffects();
      retreatPokemon(store, state, effect);
      return state;
    }
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    const enoughEnergies = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
    if (enoughEnergies === false) {
      throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
    }
    if (StateUtils.checkExactEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost)) {
      const cards = flatMap(checkProvidedEnergy.energyMap, (e) => Array.from({ length: e.provides.length }, () => e.card));
      player.active.clearEffects();
      player.active.moveCardsTo(cards, effect.moveRetreatCostTo);
      retreatPokemon(store, state, effect);
      const activePokemonCard = player.active.getPokemonCard();
      activePokemonCard.movedToActiveThisTurn = true;
      return state;
    }
    return store.prompt(state, new ChooseEnergyPrompt(player.id, GameMessage.CHOOSE_ENERGY_TO_PAY_RETREAT_COST, checkProvidedEnergy.energyMap, checkRetreatCost.cost), (energy) => {
      if (energy === null) {
        return;
      }
      const activePokemon = player.active.getPokemonCard();
      const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
      if (activePokemon === void 0 || benchedPokemon === void 0) {
        return;
      }
      const cards = energy.map((e) => e.card);
      player.active.clearEffects();
      player.active.moveCardsTo(cards, effect.moveRetreatCostTo);
      retreatPokemon(store, state, effect);
      const activePokemonCard = player.active.getPokemonCard();
      activePokemonCard.movedToActiveThisTurn = true;
    });
  }
  return state;
}

// ../ptcg-server/dist/game/store/reducers/abort-game-reducer.js
function abortGameReducer(store, state, action) {
  if ((state.phase === GamePhase.WAITING_FOR_PLAYERS || state.phase === GamePhase.SETUP) && action instanceof AbortGameAction) {
    store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
    state.phase = GamePhase.FINISHED;
    state.winner = GameWinner.NONE;
    state.prompts.forEach((prompt) => {
      prompt.result = null;
    });
    return state;
  }
  if (state.phase !== GamePhase.FINISHED && action instanceof AbortGameAction) {
    const culprit = state.players.find((p) => p.id === action.culpritId);
    if (culprit === void 0) {
      return state;
    }
    state.prompts.forEach((prompt) => {
      if (prompt.result === void 0) {
        prompt.result = null;
      }
    });
    switch (action.reason) {
      case AbortGameReason.TIME_ELAPSED:
        store.log(state, GameLog.LOG_TIME_ELAPSED, { name: culprit.name });
        break;
      case AbortGameReason.ILLEGAL_MOVES:
        store.log(state, GameLog.LOG_BANNED_BY_ARBITER, { name: culprit.name });
        break;
      case AbortGameReason.DISCONNECTED:
        store.log(state, GameLog.LOG_PLAYER_LEFT_THE_GAME, { name: culprit.name });
        break;
    }
    const winner = culprit === state.players[0] ? GameWinner.PLAYER_2 : GameWinner.PLAYER_1;
    state = endGame(store, state, winner);
    return state;
  }
  return state;
}

// ../ptcg-server/dist/game/store/store.js
var Store = class {
  constructor(handler) {
    this.handler = handler;
    this.state = new State();
    this.promptItems = [];
    this.waitItems = [];
    this.logId = 0;
  }
  dispatch(action) {
    let state = this.state;
    if (action instanceof AbortGameAction) {
      state = abortGameReducer(this, state, action);
      this.handler.onStateChange(state);
      return state;
    }
    if (action instanceof ReorderHandAction || action instanceof ReorderBenchAction || action instanceof ChangeAvatarAction) {
      state = playerStateReducer(this, state, action);
      this.handler.onStateChange(state);
      return state;
    }
    if (action instanceof ResolvePromptAction) {
      state = this.reducePrompt(state, action);
      if (this.promptItems.length === 0) {
        state = checkState(this, state);
      }
      this.handler.onStateChange(state);
      return state;
    }
    if (action instanceof AppendLogAction) {
      this.log(state, action.message, action.params, action.id);
      this.handler.onStateChange(state);
      return state;
    }
    if (state.prompts.some((p) => p.result === void 0)) {
      throw new GameError(GameMessage.ACTION_IN_PROGRESS);
    }
    state = this.reduce(state, action);
    return state;
  }
  reduceEffect(state, effect) {
    state = this.propagateEffect(state, effect);
    if (effect.preventDefault === true) {
      return state;
    }
    state = gamePhaseReducer(this, state, effect);
    state = playEnergyReducer(this, state, effect);
    state = playPokemonReducer(this, state, effect);
    state = playTrainerReducer(this, state, effect);
    state = retreatReducer(this, state, effect);
    state = gameReducer(this, state, effect);
    state = attackReducer(this, state, effect);
    state = checkStateReducer(this, state, effect);
    return state;
  }
  compareEffects(effect1, effect2) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (effect1.type !== effect2.type) {
      return false;
    }
    const effect1CardId = (_b = (_a = effect1) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.id;
    const effect2CardId = (_d = (_c = effect2) === null || _c === void 0 ? void 0 : _c.card) === null || _d === void 0 ? void 0 : _d.id;
    const effect1CardPlayerId = (_f = (_e = effect1) === null || _e === void 0 ? void 0 : _e.player) === null || _f === void 0 ? void 0 : _f.id;
    const effect2CardPlayerId = (_h = (_g = effect2) === null || _g === void 0 ? void 0 : _g.player) === null || _h === void 0 ? void 0 : _h.id;
    return effect1CardId === effect2CardId && effect1CardPlayerId === effect2CardPlayerId;
  }
  prompt(state, prompts, then) {
    if (!(prompts instanceof Array)) {
      prompts = [prompts];
    }
    for (let i = 0; i < prompts.length; i++) {
      const id = generateId(state.prompts);
      prompts[i].id = id;
      state.prompts.push(prompts[i]);
    }
    const promptItem = {
      ids: prompts.map((prompt) => prompt.id),
      then
    };
    this.promptItems.push(promptItem);
    return state;
  }
  waitPrompt(state, callback) {
    this.waitItems.push(callback);
    return state;
  }
  log(state, message, params, client) {
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).toString();
    const log = new StateLog(message, params, client);
    log.params = Object.assign(Object.assign({}, params), { timestamp });
    log.id = ++this.logId;
    state.logs.push(log);
  }
  reducePrompt(state, action) {
    const prompt = state.prompts.find((item) => item.id === action.id);
    const promptItem = this.promptItems.find((item) => item.ids.indexOf(action.id) !== -1);
    if (prompt === void 0 || promptItem === void 0) {
      return state;
    }
    if (prompt.result !== void 0) {
      throw new GameError(GameMessage.PROMPT_ALREADY_RESOLVED);
    }
    try {
      prompt.result = action.result;
      const results = promptItem.ids.map((id) => {
        const p = state.prompts.find((item) => item.id === id);
        return p === void 0 ? void 0 : p.result;
      });
      if (action.log !== void 0) {
        this.log(state, action.log.message, action.log.params, action.log.client);
      }
      if (results.every((result) => result !== void 0)) {
        const itemIndex = this.promptItems.indexOf(promptItem);
        promptItem.then(results.length === 1 ? results[0] : results);
        this.promptItems.splice(itemIndex, 1);
      }
      this.resolveWaitItems();
    } catch (storeError) {
      prompt.result = void 0;
      throw storeError;
    }
    return state;
  }
  resolveWaitItems() {
    while (this.promptItems.length === 0 && this.waitItems.length > 0) {
      const waitItem = this.waitItems.pop();
      if (waitItem !== void 0) {
        waitItem();
      }
    }
  }
  hasPrompts() {
    return this.promptItems.length > 0;
  }
  cleanup() {
    this.promptItems = [];
    this.waitItems = [];
    this.logId = 0;
    this.state = new State();
  }
  reduce(state, action) {
    const stateBackup = deepClone(state, [Card]);
    this.promptItems.length = 0;
    try {
      state = setupPhaseReducer(this, state, action);
      state = playCardReducer(this, state, action);
      state = playerTurnReducer(this, state, action);
      this.resolveWaitItems();
      if (this.promptItems.length === 0) {
        state = checkState(this, state);
      }
    } catch (storeError) {
      this.state = stateBackup;
      this.promptItems.length = 0;
      throw storeError;
    }
    this.handler.onStateChange(state);
    return state;
  }
  propagateEffect(state, effect) {
    const cards = [];
    for (const player of state.players) {
      player.stadium.cards.forEach((c) => cards.push(c));
      player.supporter.cards.forEach((c) => cards.push(c));
      player.active.cards.forEach((c) => cards.push(c));
      for (const bench of player.bench) {
        bench.cards.forEach((c) => cards.push(c));
      }
      for (const prize of player.prizes) {
        prize.cards.forEach((c) => cards.push(c));
      }
      player.hand.cards.forEach((c) => cards.push(c));
      player.deck.cards.forEach((c) => cards.push(c));
      player.discard.cards.forEach((c) => cards.push(c));
    }
    cards.sort((c) => c.superType);
    cards.forEach((c) => {
      state = c.reduceEffect(this, state, effect);
    });
    return state;
  }
};
export {
  AddPlayerAction,
  AlertPrompt,
  ApiErrorEnum,
  AppendLogAction,
  Archetype,
  AttachEnergyPrompt,
  AttachEnergyPromptType,
  AttackAction,
  Base64,
  BoardEffect,
  Card,
  CardList,
  CardManager,
  CardTag,
  CardType,
  ChangeAvatarAction,
  ChooseAttackPrompt,
  ChooseAttackPromptType,
  ChooseCardsPrompt,
  ChooseCardsPromptType,
  ChooseEnergyPrompt,
  ChooseEnergyPromptType,
  ChoosePokemonPrompt,
  ChoosePokemonPromptType,
  ChoosePrizePrompt,
  ChoosePrizePromptType,
  CoinFlipPrompt,
  ConfirmPrompt,
  DeckAnalyser,
  DiscardEnergyPrompt,
  DiscardEnergyPromptType,
  Energy,
  EnergyCard,
  EnergyType,
  Format,
  GameCardMessage,
  GameCoreError,
  GameError,
  GameLog,
  GameMessage,
  GamePhase,
  GameSettings,
  GameStoreMessage,
  GameWinner,
  InvitePlayerAction,
  InvitePlayerPrompt,
  MoveDamagePrompt,
  MoveDamagePromptType,
  MoveEnergyPrompt,
  MoveEnergyPromptType,
  OrderCardsPrompt,
  OrderCardsPromptType,
  PassTurnAction,
  PlayCardAction,
  Player,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  PokemonType,
  PowerType,
  Prompt,
  PutDamagePrompt,
  PutDamagePromptType,
  Rank,
  RemoveDamagePrompt,
  RemoveDamagePromptType,
  ReorderBenchAction,
  ReorderHandAction,
  Replay,
  ResolvePromptAction,
  RetreatAction,
  Rules,
  SelectOptionPrompt,
  SelectPrompt,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  SlotType,
  SpecialCondition,
  StadiumDirection,
  Stage,
  State,
  StateLog,
  StateSerializer,
  StateUtils,
  Store,
  SuperType,
  TrainerCard,
  TrainerType,
  UseAbilityAction,
  UseStadiumAction,
  UseTrainerAbilityAction,
  rankLevels
};
//# sourceMappingURL=ptcg-server.js.map
