"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostVacuum = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LostVacuum extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.regulationMark = 'F';
        this.name = 'Lost Vacuum';
        this.fullName = 'Lost Vacuum LOR';
        this.text = 'You can use this card only if you put another card from your hand in the Lost Zone.' +
            '' +
            'Choose a Pokémon Tool attached to any Pokémon, or any Stadium in play, and put it in the Lost Zone.';
    }
    // Add the need to select 1 card to lost zone from hand, then send to lost zone
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const allTools = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                allTools.push(...cardList.tools);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                allTools.push(...cardList.tools);
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (allTools.length === 0 && stadiumCard === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            cards = player.hand.cards;
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // prepare card list without Junk Arm
            const handTemp = new game_1.CardList();
            handTemp.cards = player.hand.cards;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                player.hand.moveCardsTo(cards, player.lostzone);
            });
            if (allTools.length > 0 && stadiumCard !== undefined) {
                const options = [
                    {
                        message: game_1.GameMessage.CHOICE_TOOL,
                        action: () => {
                            return prefabs_1.CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, game_1.PlayerType.ANY, game_1.SlotType.LOSTZONE, 1, 1);
                        }
                    },
                    {
                        message: game_1.GameMessage.CHOICE_STADIUM,
                        action: () => {
                            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                            if (stadiumCard == undefined) {
                                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                            }
                            // Discard Stadium
                            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                            const owner = game_1.StateUtils.findOwner(state, cardList);
                            cardList.moveTo(owner.lostzone);
                            player.supporter.moveCardTo(this, player.discard);
                            return state;
                        }
                    }
                ];
                return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.DISCARD_STADIUM_OR_TOOL, options.map(c => c.message), { allowCancel: false }), choice => {
                    const option = options[choice];
                    if (option.action) {
                        option.action();
                    }
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                });
            }
            if (allTools.length === 0 && stadiumCard !== undefined) {
                const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                if (stadiumCard == undefined) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                }
                // Discard Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(owner.lostzone);
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            if (allTools.length >= 1 && stadiumCard == undefined) {
                return prefabs_1.CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, game_1.PlayerType.ANY, game_1.SlotType.LOSTZONE, 1, 1);
            }
            return state;
        }
        return state;
    }
}
exports.LostVacuum = LostVacuum;
