"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyogre = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Kyogre extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Amazing Surge',
                cost: [W, L, M, C],
                damage: 0,
                text: 'This attack does 80 damage to each of your opponent\’s Pokémon. (Don\’t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'SHF';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Kyogre';
        this.fullName = 'Kyogre SHF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            const activeDamageEffect = new attack_effects_1.DealDamageEffect(effect, 80);
            store.reduceEffect(state, activeDamageEffect);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 80);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Kyogre = Kyogre;
