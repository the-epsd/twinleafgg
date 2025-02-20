"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianHeavyBall = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HisuianHeavyBall extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.name = 'Hisuian Heavy Ball';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '146';
        this.fullName = 'Hisuian Heavy Ball ASR';
        this.text = 'Look at your face-down Prize cards. You may reveal a Basic Pokémon you find there, put it into your hand, and put this Hisuian Heavy Ball in its place as a face-down Prize card. (If you don\'t reveal a Basic Pokémon, put this card in the discard pile.) Then, shuffle your face-down Prize cards.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizes = player.prizes.filter(p => p.isSecret);
            // Keep track of which prizes were originally face down
            const originallyFaceDown = player.prizes.map(p => p.isSecret);
            // Make prizes no longer secret before displaying prompt
            prizes.forEach(p => { p.isSecret = false; });
            // Prevent default effect and move the trainer card to the supporter area
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // Gather all prize cards for the prompt
            const allPrizeCards = new game_1.CardList();
            player.prizes.forEach(prizeList => {
                allPrizeCards.cards.push(...prizeList.cards);
            });
            // Prompt the player to choose a Pokémon from their prizes
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, allPrizeCards, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: false }), chosenPrize => {
                // Handle the case where no Pokémon is chosen
                if (!chosenPrize || chosenPrize.length === 0) {
                    player.prizes.forEach((p, index) => {
                        if (originallyFaceDown[index]) {
                            p.isSecret = true;
                        }
                    });
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    this.shuffleFaceDownPrizeCards(player.prizes.filter((p, index) => originallyFaceDown[index]));
                    return state;
                }
                const prizePokemon = chosenPrize[0];
                const chosenPrizeList = player.prizes.find(prizeList => prizeList.cards.includes(prizePokemon));
                // Show the chosen Pokémon to the opponent
                if (chosenPrize.length > 0) {
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenPrize), () => { });
                }
                // Move the chosen Pokémon to the player's hand & move the Hisuian Heavy Ball to the prize cards
                if (chosenPrizeList) {
                    chosenPrizeList.moveCardTo(prizePokemon, player.hand);
                    player.supporter.moveCardTo(effect.trainerCard, chosenPrizeList);
                }
                // Reset the face-down prizes
                player.prizes.forEach((p, index) => {
                    if (originallyFaceDown[index]) {
                        p.isSecret = true;
                    }
                });
                // Shuffle only the face-down prize cards
                this.shuffleFaceDownPrizeCards(player.prizes.filter((p, index) => originallyFaceDown[index]));
                return state;
            });
        }
        return state;
    }
    shuffleFaceDownPrizeCards(array) {
        const faceDownPrizeCards = array.filter(p => p.isSecret && p.cards.length > 0);
        for (let i = faceDownPrizeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = faceDownPrizeCards[i];
            faceDownPrizeCards[i] = faceDownPrizeCards[j];
            faceDownPrizeCards[j] = temp;
        }
        const prizePositions = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].cards.length === 0 || !array[i].isSecret) {
                prizePositions.push(array[i]);
                continue;
            }
            prizePositions.push(faceDownPrizeCards.splice(0, 1)[0]);
        }
        return prizePositions;
    }
}
exports.HisuianHeavyBall = HisuianHeavyBall;
