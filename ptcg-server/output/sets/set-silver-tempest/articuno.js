"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ice Wing',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: ''
            },
            {
                name: 'Wild Freeze',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 70,
                text: 'This Pokémon also does 50 damage to itself. Your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Articuno';
        this.fullName = 'Articuno SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 50);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Articuno = Articuno;
