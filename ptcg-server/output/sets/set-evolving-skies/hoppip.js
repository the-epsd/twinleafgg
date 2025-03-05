"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hoppip = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
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
                text: 'Flip a coin until you get tails. This attack does 20 damage for each heads.'
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Hoppip';
        this.fullName = 'Hoppip EVS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            let numHeads = 0;
            let result = true;
            while (result) {
                const generator = flipGenerator(store, state, effect);
                let flipResult = generator.next().value;
                if (flipResult[1]) {
                    numHeads++;
                }
                else {
                    result = false;
                }
                state = flipResult[0];
            }
            effect.damage = numHeads * 20;
        }
        return state;
    }
}
exports.Hoppip = Hoppip;
function* flipGenerator(store, state, effect) {
    return store.prompt(state, [
        new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
    ], result => {
        yield [state, result];
    });
}
