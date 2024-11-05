"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Froakie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class Froakie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Try Bouncing',
                cost: [W],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Froakie';
        this.fullName = 'Froakie OBF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Froakie = Froakie;
