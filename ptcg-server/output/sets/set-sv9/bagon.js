"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bagon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Bagon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bite',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Reckless Charge',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER],
                damage: 50,
                text: 'This Pokémon also does 10 damage to itself.'
            },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Bagon';
        this.fullName = 'Bagon SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
            damageEffect.target = player.active;
            store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.Bagon = Bagon;
