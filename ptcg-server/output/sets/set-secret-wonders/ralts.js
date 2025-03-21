"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: +10 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Smack',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: ''
            },
            {
                name: 'Confuse Ray',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'SW';
        this.name = 'Ralts';
        this.fullName = 'Ralts SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '102';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Ralts = Ralts;
