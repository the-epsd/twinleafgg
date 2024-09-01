"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 100;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ram',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }, {
                name: 'Dragon Tail',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING],
                damage: 70,
                damageCalculator: 'x',
                text: 'Flip 2 coins. This attack does 70 damage for each heads.'
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 70 * heads;
            });
        }
        return state;
    }
}
exports.Dragonair = Dragonair;
