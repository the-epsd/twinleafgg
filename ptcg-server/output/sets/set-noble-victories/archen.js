"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Archen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.RESTORED;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Rock Throw',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            }, {
                name: 'Acrobatics',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
            }];
        this.set = 'NVI';
        this.name = 'Archen';
        this.fullName = 'Archen NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 20 * heads;
            });
        }
        return state;
    }
}
exports.Archen = Archen;
