"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZacianV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ZacianV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Piercing Strike',
                cost: [card_types_1.CardType.METAL],
                damage: 40,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance, or by any effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Behemoth Blade',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 160 more damage.'
            },
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Zacian V';
        this.fullName = 'Zacian V CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const damage = 40; // Fixed damage without weakness/resistance
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && opponentActive.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.damage += 160;
            }
        }
        return state;
    }
}
exports.ZacianV = ZacianV;
