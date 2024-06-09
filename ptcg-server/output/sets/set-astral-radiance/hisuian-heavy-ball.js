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
            const prizes = player.prizes.filter(p => p.isSecret);
            const cards = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
            // Make prizes no more secret, before displaying prompt
            prizes.forEach(p => { p.isSecret = false; });
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const blocked = [];
            player.prizes.map(p => p.cards[0]).forEach((c, index) => {
                if (!(c instanceof game_1.PokemonCard && c.stage === game_1.Stage.BASIC)) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, { count: 1, blocked: blocked, allowCancel: true }), chosenPrize => {
                if (chosenPrize === null || chosenPrize.length === 0) {
                    prizes.forEach(p => { p.isSecret = true; });
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    player.prizes = this.shuffleArray(player.prizes);
                    return state;
                }
                const opponent = game_1.StateUtils.getOpponent(state, player);
                store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, chosenPrize[0].cards), () => {
                    const prizePokemon = chosenPrize[0];
                    const hand = player.hand;
                    const heavyBall = effect.trainerCard;
                    store.log(state, game_1.GameLog.LOG_HISUIAN_HEAVY_BALL, { name: player.name, card: chosenPrize[0].cards[0].name });
                    prizePokemon.moveTo(hand);
                    const chosenPrizeIndex = player.prizes.indexOf(chosenPrize[0]);
                    player.supporter.moveCardTo(heavyBall, player.prizes[chosenPrizeIndex]);
                    player.prizes = this.shuffleArray(player.prizes);
                    prizes.forEach(p => { p.isSecret = true; });
                });
            });
            return state;
        }
        return state;
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}
exports.HisuianHeavyBall = HisuianHeavyBall;
