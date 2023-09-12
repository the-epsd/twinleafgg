"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_utils_1 = require("../../game/store/state-utils");
class SingleStrikeEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.cardTag = [card_types_1.CardTag.SINGLE_STRIKE];
        this.provides = [card_types_1.CardType.DARK | card_types_1.CardType.FIGHTING];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'BST';
        this.name = 'Single Strike Energy';
        this.fullName = 'Single Strike Energy BST';
        this.text = 'This card can only be attached to a Single Strike Pokémon.' +
            'If this card is attached to anything other than a Single ' +
            'Strike Pokémon, discard this card. ' +
            '' +
            'As long as this card is attached to a Pokémon, it provides ' +
            'F and D Energy but provides only 1 Energy at a time, and the ' +
            'attacks of the Pokémon this card is attached to do 20 more ' +
            'damage to your opponent\'s Active Pokémon (before applying ' +
            'Weakness and Resistance).';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            if (effect.source.cards.includes(this)) {
                const player = effect.player;
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                if (effect.target !== opponent.active) {
                    return state;
                }
                const source = effect.source; // Get source Pokemon
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(source);
                store.reduceEffect(state, checkPokemonType);
                const card = source.getPokemonCard(); // Get source Pokemon card
                if (card && !card.tags.includes(card_types_1.CardTag.SINGLE_STRIKE)) {
                    // If attached Pokemon is not Single Strike, discard energy
                    player.discard.moveCardTo(this, player.discard);
                    return state;
                }
                if (checkPokemonType.cardTypes.includes(card_types_1.CardType.FIGHTING) || checkPokemonType.cardTypes.includes(card_types_1.CardType.DARK)) {
                    effect.damage += 20;
                }
                return state;
            }
        }
        return state;
    }
}
exports.SingleStrikeEnergy = SingleStrikeEnergy;
