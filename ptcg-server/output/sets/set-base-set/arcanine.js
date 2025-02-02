"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arcanine = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Arcanine extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Arcanine';
        this.set = 'BS';
        this.fullName = 'Arcanine BS';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Growlithe';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flamethrower',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Discard 1 {R} Energy attached to Arcanine in order to use this attack.'
            },
            {
                name: 'Take Down',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Arcanine does 30 damage to itself.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.FIRE, 1);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const damage = new attack_effects_1.DealDamageEffect(effect, 30);
            damage.target = effect.player.active;
            store.reduceEffect(state, damage);
        }
        return state;
    }
}
exports.Arcanine = Arcanine;
