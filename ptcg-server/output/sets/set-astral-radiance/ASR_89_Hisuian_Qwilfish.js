"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianQwilfish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HisuianQwilfish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Spiny Rush',
                cost: [],
                damage: 10,
                text: 'Flip a coin until you get tails. This attack does 10 damage for each heads. '
            }];
        this.set = 'ASR';
        this.setNumber = '89';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hisuian Qwilfish';
        this.fullName = 'Hisuian Qwilfish ASR';
        this.COIN_FLIP_TAILS = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), results => {
                let numFlips = 0;
                if (results === true) {
                    numFlips++;
                    store.prompt(state, [
                        new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
                    ], result => {
                        if (result === true) {
                            numFlips++;
                        }
                    });
                }
                effect.damage = 10 * numFlips;
            });
        }
        return state;
    }
}
exports.HisuianQwilfish = HisuianQwilfish;
