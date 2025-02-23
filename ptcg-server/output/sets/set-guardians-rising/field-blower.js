"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldBlower = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class FieldBlower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GRI';
        this.name = 'Field Blower';
        this.fullName = 'Field Blower GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.text = 'Choose up to 2 in any combination of Pokémon Tool cards and Stadium cards in play (yours or your opponent\'s) and discard them.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let allTools = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                allTools.push(...cardList.tools);
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                allTools.push(...cardList.tools);
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (allTools.length === 0 && stadiumCard == undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (stadiumCard !== undefined) {
                state = prefabs_1.SELECT_PROMPT_WITH_OPTIONS(store, state, player, game_1.GameMessage.WANT_TO_DISCARD_STADIUM, [
                    {
                        message: game_1.GameMessage.YES,
                        action: () => {
                            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                            const stadiumPlayer = game_1.StateUtils.findOwner(state, cardList);
                            cardList.moveTo(stadiumPlayer.discard);
                            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name });
                            if (allTools.length > 0) {
                                state = prefabs_1.CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, game_1.PlayerType.ANY, game_1.SlotType.DISCARD, 0, 1);
                            }
                        }
                    },
                    {
                        message: game_1.GameMessage.NO,
                        action: () => {
                            if (allTools.length > 0) {
                                state = prefabs_1.CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, game_1.PlayerType.ANY, game_1.SlotType.DISCARD, 0, 2);
                            }
                        }
                    }
                ]);
                player.supporter.moveCardTo(this, player.discard);
            }
            else {
                state = prefabs_1.CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, player, game_1.PlayerType.ANY, game_1.SlotType.DISCARD, 0, 2);
            }
            return state;
        }
        return state;
    }
}
exports.FieldBlower = FieldBlower;
