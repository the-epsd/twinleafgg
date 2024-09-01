"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarmieV = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class StarmieV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Swift',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Energy Spiral',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each Energy attached to all of your opponent\'s Pokémon.'
            }
        ];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Starmie V';
        this.fullName = 'Starmie V ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Make damage ignore weakness
            effect.ignoreWeakness = true;
            // Make damage ignore resistance
            effect.ignoreResistance = true;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damage = 50;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let energies = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            effect.damage = energies * 50;
        }
        return state;
    }
}
exports.StarmieV = StarmieV;
