"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serena = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Serena extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '164';
        this.regulationMark = 'F';
        this.name = 'Serena';
        this.fullName = 'Serena SIT';
        this.text = 'Choose 1:' +
            '• Discard up to 3 cards from your hand. (You must discard at least 1 card.) If you do, draw cards until you have 5 cards in your hand.' +
            '• Switch 1 of your opponent\'s Benched Pokémon V with their Active Pokémon.. Shuffle the other cards back into your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_message_1.GameMessage.DISCARD_AND_DRAW,
                    action: () => {
                        let cards = [];
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 3, allowCancel: true }), selected => {
                            cards = selected || [];
                            player.hand.moveCardsTo(cards, player.discard);
                            while (player.hand.cards.length < 5) {
                                player.deck.moveTo(player.hand, 1);
                            }
                            return state;
                        });
                    }
                },
                {
                    message: game_message_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        const blocked = [];
                        opponent.bench.forEach((card, index) => {
                            if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                                blocked.push({ card, index });
                            }
                        });
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                            const cardList = result[0];
                            opponent.switchPokemon(cardList);
                        });
                    }
                }
            ];
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                options.splice(1, 0);
            }
            let cards = [];
            cards = player.hand.cards;
            if (cards.length < 1) {
                options.splice(0, 1);
            }
            if (player.deck.cards.length === 0) {
                options.splice(0, 1);
            }
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_message_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Serena = Serena;
