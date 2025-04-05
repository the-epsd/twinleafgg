"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillsTeleporter = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_prefabs_1 = require("../../game/store/prefabs/trainer-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class BillsTeleporter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'N1';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Bill\'s Teleporter';
        this.fullName = 'Bill\'s Teleporter N1';
        this.text = 'Flip a coin. If heads, draw 4 cards.';
    }
    reduceEffect(store, state, effect) {
        if (trainer_prefabs_1.WAS_TRAINER_USED(effect, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    const player = effect.player;
                    prefabs_1.DRAW_CARDS(player, 4);
                }
            }));
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
        return state;
    }
}
exports.BillsTeleporter = BillsTeleporter;
