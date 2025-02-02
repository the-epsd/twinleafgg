"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorrorPsychicEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const state_1 = require("../../game/store/state/state");
class HorrorPsychicEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'RCL';
        this.name = 'Horror Psychic Energy';
        this.fullName = 'Horror Psychic Energy DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '172';
        this.text = 'As long as this card is attached to a Pokémon, it provides [P] Energy.' +
            '' +
            'If the [P] Pokémon this card is attached to is in the Active Spot and is damaged by an opponent\'s attack (even if it is Knocked Out), put 2 damage counters on the Attacking Pokémon.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.PSYCHIC] });
            return state;
        }
        if (effect instanceof attack_effects_1.AfterDamageEffect && ((_a = effect.target.cards) === null || _a === void 0 ? void 0 : _a.includes(this))) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(targetPlayer.active);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.PSYCHIC)) {
                if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                    return state;
                }
                if (state.phase === state_1.GamePhase.ATTACK) {
                    effect.source.damage += 20;
                }
            }
        }
        return state;
    }
}
exports.HorrorPsychicEnergy = HorrorPsychicEnergy;
