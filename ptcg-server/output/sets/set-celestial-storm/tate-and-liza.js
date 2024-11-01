"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TateAndLiza = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class TateAndLiza extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '148';
        this.name = 'Tate & Liza';
        this.fullName = 'Tate & Liza CES';
        this.text = 'Choose 1:' +
            '• Shuffle your hand into your deck. Then, draw 5 cards.' +
            '• Switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [
                {
                    message: game_message_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                            const cardList = result[0];
                            player.switchPokemon(cardList);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.SHUFFLE_AND_DRAW_5_CARDS,
                    action: () => {
                        if (player.hand.cards.length > 0) {
                            player.hand.moveCardsTo(player.hand.cards.filter(c => c !== this), player.deck);
                        }
                        store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                        player.deck.moveTo(player.hand, 5);
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    }
                }
            ];
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                options.splice(0, 1);
            }
            if (player.deck.cards.length === 0) {
                options.splice(1, 1);
            }
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.TateAndLiza = TateAndLiza;
