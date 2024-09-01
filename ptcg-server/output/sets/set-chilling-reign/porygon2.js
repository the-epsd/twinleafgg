"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Porygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Porygon';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tri-Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculator: 'x',
                text: 'Flip 3 coins. This attack does 30 damage for each heads.'
            }
        ];
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.name = 'Porygon2';
        this.fullName = 'Porygon2 CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 30 * heads;
            });
        }
        return state;
    }
}
exports.Porygon2 = Porygon2;
