"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Growlithe = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const card_types_1 = require("../../game/store/card/card-types");
class Growlithe extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 50;
        this.retreat = [C];
        this.weakness = [{ type: W }];
        this.attacks = [
            {
                name: 'Body Slam',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Firebreathing',
                cost: [R, C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 damage plus 20 more damage.'
            }
        ];
        this.set = 'LM';
        this.name = 'Growlithe';
        this.fullName = 'Growlithe LM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            if (effect.attack === this.attacks[0]) {
                const player = effect.player;
                return store.prompt(state, [
                    new game_2.CoinFlipPrompt(player.id, game_2.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                        store.reduceEffect(state, specialConditionEffect);
                    }
                });
            }
            if (effect.attack === this.attacks[1]) {
                const player = effect.player;
                return store.prompt(state, [
                    new game_2.CoinFlipPrompt(player.id, game_2.GameMessage.COIN_FLIP)
                ], result => {
                    if (result === true) {
                        effect.damage += 20;
                    }
                });
            }
        }
        return state;
    }
}
exports.Growlithe = Growlithe;
