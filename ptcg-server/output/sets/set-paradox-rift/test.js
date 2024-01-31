"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Test extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.set = 'TEST';
        this.setNumber = '135';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blaines Quiz';
        this.fullName = 'Blaines Quiz TEST';
        this.text = `
      Put a Pokémon from your hand face down in front of you and tell your opponent its HP. 
      They guess the name of that Pokémon, and then you reveal it. 
      If your opponent guessed right, they draw 4 cards. 
      If they guessed wrong, you draw 4 cards. 
      Return the Pokémon to your hand.
    `;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_1.GameMessage.DISCARD_AND_DRAW,
                    action: () => {
                        const pokemonToShow = [];
                        player.deck.cards.forEach(card => {
                            if (card instanceof game_1.PokemonCard) {
                                if ([70].includes(card.hp)) {
                                    pokemonToShow.push(card);
                                }
                            }
                        });
                        if (pokemonToShow.length > 0) {
                            return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, pokemonToShow), () => {
                                return state;
                            });
                        }
                    }
                },
                {
                    message: game_1.GameMessage.SWITCH_POKEMON,
                    action: () => {
                        return state;
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_OPTION, options.map(opt => opt.message), { allowCancel: false }), choice => {
                const option = options[choice];
                option.action();
            });
        }
        return state;
    }
}
exports.Test = Test;
