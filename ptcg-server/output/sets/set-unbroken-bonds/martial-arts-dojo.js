"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MartialArtsDojo = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MartialArtsDojo extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '179';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'UNB';
        this.name = 'Martial Arts Dojo';
        this.fullName = 'Martial Arts Dojo UNB';
        this.text = 'The attacks of non-Ultra Beast Pokémon that have any basic [F] Energy attached to them (both yours and your opponent\'s) do 10 more damage to the opponent\'s Active Pokémon (before applying Weakness and Resistance). If the attacking player has more Prize cards remaining than their opponent, those attacks do 40 more damage instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBasicFightingEnergy = player.active.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Fighting Energy').length > 0;
            if (player.active.cards.some(c => c.tags.includes(card_types_1.CardTag.ULTRA_BEAST)) ||
                !hasBasicFightingEnergy) {
                return state;
            }
            if (effect.damage > 0 && effect.target === opponent.active) {
                effect.damage += player.getPrizeLeft() > opponent.getPrizeLeft() ? 40 : 10;
            }
        }
        return state;
    }
}
exports.MartialArtsDojo = MartialArtsDojo;
