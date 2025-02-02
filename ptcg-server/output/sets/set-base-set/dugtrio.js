"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dugtrio = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Dugtrio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Dugtrio';
        this.set = 'BS';
        this.fullName = 'Dugtrio BS';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.hp = 70;
        this.weakness = [{
                type: card_types_1.CardType.GRASS
            }];
        this.resistance = [{
                type: card_types_1.CardType.LIGHTNING,
                value: -30
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Slash',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            },
            {
                name: 'Earthquake',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 70,
                text: 'Does 10 damage to each of your own Benched Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            effect.player.bench.forEach(b => {
                const benchDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                benchDamage.target = b;
                store.reduceEffect(state, benchDamage);
            });
        }
        return state;
    }
}
exports.Dugtrio = Dugtrio;
