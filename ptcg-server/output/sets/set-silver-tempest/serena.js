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
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const options = [
                {
                    message: game_message_1.GameMessage.DISCARD_AND_DRAW,
                    action: () => {
                        let cards = [];
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: 1, max: 3, allowCancel: true }), selected => {
                            cards = selected || [];
                            player.hand.moveCardsTo(cards, player.discard);
                            while (player.hand.cards.length < 5) {
                                if (player.deck.cards.length === 0) {
                                    break;
                                }
                                player.deck.moveTo(player.hand, 1);
                                player.supporter.moveCardTo(effect.trainerCard, player.discard);
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
                            if (card instanceof game_1.PokemonCard && !((card.cardTag[0] == card_types_1.CardTag.POKEMON_V) || (card.cardTag[0] == card_types_1.CardTag.POKEMON_VMAX) || (card.cardTag[0] == card_types_1.CardTag.POKEMON_VSTAR))) {
                                blocked.push({ player: game_1.PlayerType.TOP_PLAYER, slot: game_1.SlotType.BENCH, index });
                            }
                        });
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked }), result => {
                            var _a, _b, _c;
                            const cardList = result[0];
                            if (cardList.stage == card_types_1.Stage.BASIC) {
                                try {
                                    const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
                                    store.reduceEffect(state, supporterEffect);
                                }
                                catch (_d) {
                                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                                    return state;
                                }
                            }
                            if (!((_a = result[0].getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_V)) && !((_b = result[0].getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) && !((_c = result[0].getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR))) {
                                throw new game_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                            }
                            opponent.switchPokemon(cardList);
                            player.supporter.moveCardTo(effect.trainerCard, player.discard);
                            return state;
                        });
                    }
                }
            ];
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                options.splice(1, 1);
            }
            const hasVPokeBench = opponent.bench.some(b => { var _a, _b, _c; return ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_V)) || ((_b = b.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) || ((_c = b.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)); });
            if (!hasVPokeBench) {
                options.splice(1, 1);
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
