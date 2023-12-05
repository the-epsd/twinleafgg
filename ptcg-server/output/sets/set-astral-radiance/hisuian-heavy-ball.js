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
        this.set2 = 'astralradiance';
        this.setNumber = '146';
        this.fullName = 'Hisuian Heavy Ball ASR';
        this.text = 'Attach a basic D Energy card from your discard pile to 1 of your ' +
            'Benched D Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const prizesWithPokemon = player.prizes.filter(p => p.cards[0].superType === game_1.SuperType.POKEMON);
            if (prizesWithPokemon.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, { count: 1, allowCancel: false }), chosenPrize => {
                const prizePokemon = chosenPrize[0].cards[0];
                chosenPrize[0].cards = [this];
                player.discard.moveCardTo(prizePokemon, player.hand);
            });
        }
        return state;
    }
}
exports.HisuianHeavyBall = HisuianHeavyBall;
