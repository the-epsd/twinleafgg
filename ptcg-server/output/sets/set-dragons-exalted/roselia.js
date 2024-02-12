"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roselia = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
class Roselia extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.WATER, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Double Whip',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip 2 coins. This attack does 10 damage times the number ' +
                    'of heads.'
            },
            {
                name: 'Relaxing Fragrance',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Heal 30 damage and remove all Special Conditions from ' +
                    'this Pokemon.'
            }
        ];
        this.set = 'DRX';
        this.name = 'Roselia';
        this.fullName = 'Roselia DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 10 * heads;
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
            const removeSpecialCondition = new attack_effects_1.RemoveSpecialConditionsEffect(effect, undefined);
            removeSpecialCondition.target = player.active;
            state = store.reduceEffect(state, removeSpecialCondition);
            return state;
        }
        return state;
    }
}
exports.Roselia = Roselia;
