"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Okidogi = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Okidogi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Adrena-Power',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has any [D] Energy attached, it gets +100 HP, and the attacks it uses do 100 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }
        ];
        this.attacks = [
            {
                name: 'Good Punch',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Okidogi';
        this.fullName = 'Okidogi TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            if (effect.damage === 0 || game_1.StateUtils.getOpponent(state, player).active !== effect.target) {
                return state;
            }
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // check for basic dark
            const basicDarkEnergy = this.cards.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Darkness Energy');
            if (basicDarkEnergy.length > 0) {
                effect.damage += 100;
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let darkProvided = false;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.ANY) || em.provides.includes(card_types_1.CardType.DARK)) {
                    darkProvided = true;
                }
            });
            if (darkProvided) {
                effect.damage += 100;
            }
            const specialEnergy = this.cards.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)
                .map(c => c);
            if (specialEnergy.length === 0) {
                return state;
            }
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, specialEnergy[0]);
                store.reduceEffect(state, energyEffect);
            }
            catch (_b) {
                return state;
            }
            if (specialEnergy.some(e => e.blendedEnergies.includes(card_types_1.CardType.DARK))) {
                effect.damage += 100;
                return state;
            }
            return state;
        }
        if (effect instanceof check_effects_1.CheckHpEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_c) {
                return state;
            }
            // check for basic dark
            const basicDarkEnergy = this.cards.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Darkness Energy');
            if (basicDarkEnergy.length > 0) {
                effect.hp += 100;
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let darkProvided = false;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.ANY) || em.provides.includes(card_types_1.CardType.DARK)) {
                    darkProvided = true;
                }
            });
            if (darkProvided) {
                effect.hp += 100;
            }
            const specialEnergy = this.cards.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)
                .map(c => c);
            if (specialEnergy.length === 0) {
                return state;
            }
            try {
                const energyEffect = new play_card_effects_1.EnergyEffect(player, specialEnergy[0]);
                store.reduceEffect(state, energyEffect);
            }
            catch (_d) {
                return state;
            }
            if (specialEnergy.some(e => e.blendedEnergies.includes(card_types_1.CardType.DARK))) {
                effect.hp += 100;
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Okidogi = Okidogi;
