"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyEnergy = void 0;
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class LegacyEnergy extends game_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [game_1.CardType.COLORLESS];
        this.energyType = game_1.EnergyType.SPECIAL;
        this.tags = [game_1.CardTag.ACE_SPEC];
        this.set = 'TWM';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '167';
        this.name = 'Legacy Energy';
        this.fullName = 'Legacy Energy TWM';
        this.legacyEnergyUsed = false;
        this.text = 'As long as this card is attached to a Pokémon, it provides every type of Energy but provides only 1 Energy at a time.' +
            '' +
            'If the Pokémon this card is attached to is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card. This effect of your Legacy Energy can\'t be applied more than once per game.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [game_1.CardType.ANY] });
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            if (state.phase === state_1.GamePhase.ATTACK) {
                if (this.legacyEnergyUsed == false) {
                    effect.prizeCount -= 1;
                    this.legacyEnergyUsed = true;
                }
            }
        }
        return state;
    }
}
exports.LegacyEnergy = LegacyEnergy;
