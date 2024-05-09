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
            state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, { count: 1, allowCancel: true }), chosenPrize => {
                if (chosenPrize === null) {
                    return state;
                }
                // if (!(chosenPrize[0] instanceof PokemonCard) || !(chosenPrize[0].stage === Stage.BASIC)) {
                //   throw new GameError(GameMessage.INVALID_TARGET);
                // }
                const prizePokemon = chosenPrize[0];
                const hand = player.hand;
                const heavyBall = effect.trainerCard;
                prizePokemon.moveTo(hand);
                const chosenPrizeIndex = player.prizes.indexOf(chosenPrize[0]);
                player.supporter.moveCardTo(heavyBall, player.prizes[chosenPrizeIndex]);
                // const shuffledPrizes = player.prizes.slice().sort(() => Math.random() - 0.5);
                // player.prizes = shuffledPrizes;
                prizes.forEach(p => { p.isSecret = true; });
                // prizes.forEach(p => { p.applyOrder([chosenPrize[0].cards[0].id]); });
                // return store.prompt(state, new ShuffleHandPrompt(player.id), order => {
                //   prizes.forEach(p => { p.applyOrder([order[0]]); });
                // });
            });
            return state;
        }
        return state;
    }
}
exports.HisuianHeavyBall = HisuianHeavyBall;
