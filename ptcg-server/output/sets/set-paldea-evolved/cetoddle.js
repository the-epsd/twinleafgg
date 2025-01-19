"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cetoddle = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Cetoddle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Avalanche',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.name = 'Cetoddle';
        this.fullName = 'Cetoddle PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Cetoddle = Cetoddle;
