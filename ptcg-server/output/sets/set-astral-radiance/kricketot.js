"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
class Kricketot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Trip Over',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Kricketot';
        this.fullName = 'Kricketot ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    effect.damage += 20;
                }
                return state;
            });
        }
        return state;
    }
}
exports.Kricketot = Kricketot;
