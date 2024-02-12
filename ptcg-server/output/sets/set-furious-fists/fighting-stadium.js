"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FightingStadium = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class FightingStadium extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'FFI';
        this.name = 'Fighting Stadium';
        this.fullName = 'Fighting Stadium FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.text = 'The attacks of each F Pokemon in play (both yours and your opponent\'s) ' +
            'do 20 more damage to the Defending Pokemon-EX (before applying Weakness ' +
            'and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Not opponent's active pokemon
            if (effect.target !== opponent.active) {
                return state;
            }
            // Not attacking Pokemon EX
            const targetCard = effect.target.getPokemonCard();
            if (!targetCard || !targetCard.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                return state;
            }
            // Attack not made by the Fighting Pokemon
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.FIGHTING)) {
                return state;
            }
            effect.damage += 20;
        }
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
        }
        return state;
    }
}
exports.FightingStadium = FightingStadium;
