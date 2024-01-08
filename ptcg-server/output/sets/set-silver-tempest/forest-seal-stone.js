"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForestSealStone = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ForestSealStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '156';
        this.regulationMark = 'F';
        this.name = 'Forest Seal Stone';
        this.fullName = 'Forest Seal Stone SIT';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList === effect.target) {
                    return;
                }
                if (cardList.tool instanceof ForestSealStone) {
                    // Create a new class extending cardList
                    class ForestSealStone {
                        constructor() {
                            this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS,];
                        }
                        reduceEffect(store, state, effect) {
                            throw new Error('Method not implemented.');
                        }
                    }
                    // Instantiate the new class
                    const newCardList = new ForestSealStone();
                    // Copy the properties from the old cardList
                    newCardList.retreat = cardList.tool.retreat;
                    // Push the new cardList to the target
                    cardList.cards.push(newCardList);
                }
            });
        }
        return state;
    }
}
exports.ForestSealStone = ForestSealStone;
