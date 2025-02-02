"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoubleDragonEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DoubleDragonEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'ROS';
        this.name = 'Double Dragon Energy';
        this.fullName = 'Double Dragon Energy SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.text = 'This card can only be attached to [N] Pokémon.' +
            '' +
            'This card provides every type of Energy, but provides only 2 Energy at a time, only while this card is attached to a [N] Pokémon.' +
            '' +
            '(If this card is attached to anything other than a [N] Pokémon, discard this card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.ANY, card_types_1.CardType.ANY] });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard === this) {
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (!checkPokemonType.cardTypes.includes(card_types_1.CardType.DRAGON)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        return state;
    }
}
exports.DoubleDragonEnergy = DoubleDragonEnergy;
