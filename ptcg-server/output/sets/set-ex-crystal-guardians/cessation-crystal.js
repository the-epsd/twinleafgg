"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CessationCrystal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
class CessationCrystal extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'CG';
        this.name = 'Cessation Crystal';
        this.fullName = 'Cessation Crystal CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.text = 'Attach Cessation Crystal to 1 of your Pokémon (excluding Pokémon-ex) that doesn\’t already have a Pokémon Tool attached to it. If the Pokémon Cessation Crystal is attached to is a Pokémon-ex, discard this card.\n\nAs long as Cessation Crystal is attached to an Active Pokémon, each player\’s Pokémon(both yours and your opponent\’s) can\’t use any Poké - Powers or Poké - Bodies.';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        if (effect instanceof game_effects_1.PowerEffect
            && (effect.power.powerType === game_1.PowerType.POKEBODY || effect.power.powerType === game_1.PowerType.POKEPOWER)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let isActive = false;
            if (player.active.tool === this && !prefabs_1.IS_TOOL_BLOCKED(store, state, player, this)) {
                if ((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    player.active.moveCardTo(this, player.discard);
                }
                else {
                    isActive = true;
                }
            }
            if (opponent.active.tool === this && !prefabs_1.IS_TOOL_BLOCKED(store, state, opponent, this)) {
                if ((_b = opponent.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    opponent.active.moveCardTo(this, opponent.discard);
                }
                else {
                    isActive = true;
                }
            }
            if (isActive) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect && effect.trainerCard == this) {
            if ((_c = effect.target.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        return state;
    }
}
exports.CessationCrystal = CessationCrystal;
