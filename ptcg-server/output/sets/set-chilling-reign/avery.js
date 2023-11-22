"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avery = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
//Avery is not done yet!! have to add the "remove from bench" logic
class Avery extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CRE';
        this.set2 = 'chillingreign';
        this.setNumber = '130';
        this.regulationMark = 'E';
        this.name = 'Avery';
        this.fullName = 'Avery CRE';
        this.text = 'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            // Draw 3 cards
            player.deck.moveTo(player.hand, 3);
            // Get opponent
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Get opponent's bench length
            const opponentBenchLength = opponent.bench.length;
            let PokemonToDiscard = 0;
            if (opponentBenchLength === 4) {
                PokemonToDiscard = 1;
            }
            if (opponentBenchLength === 5) {
                PokemonToDiscard = 2;
            }
            let targets = [];
            if (PokemonToDiscard === 0) {
                return state;
            }
            // Prompt opponent to discard Pokemon from bench
            if (PokemonToDiscard === 1) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), results => {
                    targets = results || [];
                    targets.forEach(target => {
                        target.moveTo(opponent.discard);
                    });
                });
            }
            // Prompt opponent to discard Pokemon from bench
            if (PokemonToDiscard === 2) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 2, max: 2 }), results => {
                    targets = results || [];
                    targets.forEach(target => {
                        target.moveTo(opponent.discard);
                    });
                });
            }
            return state;
        }
        return state;
    }
}
exports.Avery = Avery;
