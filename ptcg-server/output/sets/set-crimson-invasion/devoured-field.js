"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevouredField = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class DevouredField extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'CIN';
        this.name = 'Devoured Field';
        this.fullName = 'Devoured Field CIN';
        this.text = 'The attacks of [D] Pokémon and [N] Pokémon (both yours and your opponent\'s) do 10 more damage to the opponent\'s Active Pokémon (before applying Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(player.active);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.DRAGON) &&
                !checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK)) {
                return state;
            }
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.DevouredField = DevouredField;
