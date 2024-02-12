"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litwick = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Litwick extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trip Over',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }
        ];
        this.set = 'PHF';
        this.name = 'Litwick';
        this.fullName = 'Litwick PHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.Litwick = Litwick;
