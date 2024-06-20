"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WashWaterEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class WashWaterEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'VIV';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.name = 'Wash Water Energy';
        this.fullName = 'Wash Water Energy VIV';
        this.text = 'As long as this card is attached to a Pokémon, it provides [W] Energy.' +
            '' +
            'Prevent all effects of attacks from your opponent\'s Pokémon done to the [W] Pokémon this card is attached to. (Existing effects are not removed. Damage is not an effect.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
            const player = effect.player;
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_a) {
                return state;
            }
            effect.energyMap.push({ card: this, provides: [card_types_1.CardType.WATER] });
            return state;
        }
        // Prevent effects of attacks
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const sourceCard = effect.source.getPokemonCard();
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(opponent, this);
                store.reduceEffect(state, energyEffect);
            }
            catch (_b) {
                return state;
            }
            if (sourceCard && sourceCard.cardType === card_types_1.CardType.WATER) {
                if (opponent.specialEnergyBlocked === true) {
                    this.provides = [card_types_1.CardType.COLORLESS];
                }
                // Allow damage
                if (effect instanceof attack_effects_1.PutDamageEffect) {
                    return state;
                }
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.WashWaterEnergy = WashWaterEnergy;
