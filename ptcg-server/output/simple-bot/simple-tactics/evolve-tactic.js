"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolveTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class EvolveTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        const pokemons = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList.pokemonPlayedTurn !== state.turn) {
                pokemons.push({ card, target });
            }
        });
        for (let i = 0; i < pokemons.length; i++) {
            const evolution = player.hand.cards.find(c => {
                return c instanceof game_1.PokemonCard && c.evolvesFrom === pokemons[i].card.name;
            });
            if (evolution) {
                return new game_1.PlayCardAction(player.id, player.hand.cards.indexOf(evolution), pokemons[i].target);
            }
        }
    }
}
exports.EvolveTactic = EvolveTactic;
