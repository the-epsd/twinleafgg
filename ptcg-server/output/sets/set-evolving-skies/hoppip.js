"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Hoppip extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.attacks = [{
                name: 'Continuous Spin',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Flip a coin until you get tails. This attack does 20 damage for each heads. '
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            let numHeads = 0;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    numHeads++;
                    return this.reduceEffect(store, state, effect);
                }
                effect.damage = numHeads * 20;
                return state;
            });
        }
        return state;
    }
}
exports.Hoppip = Hoppip;
