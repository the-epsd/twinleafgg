"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuckyEnergy = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class LuckyEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Lucky Energy';
        this.fullName = 'Lucky Energy CRE';
        this.text = 'As long as this card is attached to a Pokémon, it provides [C] Energy. ' +
            '' +
            'If the Pokémon this card is attached to is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if it is Knocked Out), draw a card.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            // It's not an attack
            if (state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            const player = game_1.StateUtils.findOwner(state, effect.target);
            // Check if damage target is owned by this card's owner 
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (targetPlayer === player) {
                player.deck.moveTo(player.hand, 1);
            }
            return state;
        }
        return state;
    }
}
exports.LuckyEnergy = LuckyEnergy;
