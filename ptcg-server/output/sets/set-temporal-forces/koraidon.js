"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koraidon = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Koraidon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 140;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Primordial Beatdown',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculator: 'x',
                text: 'This attack does 30 damage for each of your Ancient Pokémon in play.'
            },
            {
                name: 'Shred',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 130,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '119';
        this.name = 'Koraidon';
        this.fullName = 'Koraidon TEF';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let ancientPokemonCount = 0;
            if ((_b = (_a = player.active) === null || _a === void 0 ? void 0 : _a.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_2.CardTag.ANCIENT)) {
                ancientPokemonCount++;
            }
            player.bench.forEach(benchSpot => {
                var _a;
                if ((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_2.CardTag.ANCIENT)) {
                    ancientPokemonCount++;
                }
            });
            effect.damage = 30 * ancientPokemonCount;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 130);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Koraidon = Koraidon;
