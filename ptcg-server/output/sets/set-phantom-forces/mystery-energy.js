"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysteryEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
class MysteryEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'PHF';
        this.name = 'Mystery Energy';
        this.fullName = 'Mystery Energy PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.STRONG_ENERGY_MAREKER = 'STRONG_ENERGY_MAREKER';
        this.text = 'This card can only be attached to P Pokemon. This card provides P ' +
            'Energy, but only while this card is attached to a P Pokemon. ' +
            'The Retreat Cost of the Pokemon this card is attached to is 2 less. ' +
            '(If this card is attached to anything other than a P Pokemon, discard ' +
            'this card.)';
    }
    reduceEffect(store, state, effect) {
        // Cannot attach to other than Psychic Pokemon
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return state;
        }
        // Provide energy when attached to Psychic Pokemon
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.source);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                effect.energyMap.push({ card: this, provides: [card_types_1.CardType.PSYCHIC] });
            }
            return state;
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            if (player.active.cards.includes(this)) {
                for (let i = 0; i < 2; i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        return state;
    }
}
exports.MysteryEnergy = MysteryEnergy;
