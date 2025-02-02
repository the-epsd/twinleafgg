"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevolutionSpray = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DevolutionSpray extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Devolution Spray';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '113';
        this.set = 'DRX';
        this.fullName = 'Devolution Spray DRX';
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.text = 'Devolve 1 of your evolved Pokémon and put the highest Stage Evolution card on it into your hand. (That Pokémon can\'t evolve this turn.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            let canDevolve = false;
            const player = effect.player;
            const blocked = [];
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (list.getPokemons().length > 1) {
                    canDevolve = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!canDevolve) {
                throw new game_1.GameError(game_1.GameStoreMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1, blocked }), (results) => {
                if (results && results.length > 0) {
                    const targetPokemon = results[0];
                    targetPokemon.moveCardsTo([targetPokemon.cards[targetPokemon.cards.length - 1]], effect.player.hand);
                    targetPokemon.clearEffects();
                    targetPokemon.pokemonPlayedTurn = state.turn;
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
                return state;
            });
        }
        return state;
    }
}
exports.DevolutionSpray = DevolutionSpray;
