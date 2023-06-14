"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandScore = void 0;
const game_1 = require("../../game");
const score_1 = require("./score");
const energy_card_1 = require("../../game/store/card/energy-card");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
class HandScore extends score_1.SimpleScore {
    getScore(state, playerId) {
        const player = this.getPlayer(state, playerId);
        const scores = this.options.scores.hand;
        const isBenchEmpty = player.bench.every(b => b.cards.length === 0);
        const pokemonsToEvolve = [];
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            if (cardList.pokemonPlayedTurn < state.turn) {
                pokemonsToEvolve.push(card.name);
            }
        });
        let score = 0;
        let hasEnergy = false;
        let hasPokemon = false;
        let hasBasic = false;
        let hasSupporter = false;
        player.hand.cards.forEach(c => {
            if (c instanceof energy_card_1.EnergyCard) {
                hasEnergy = true;
                score += scores.cardScore;
            }
            else if (c instanceof pokemon_card_1.PokemonCard) {
                hasPokemon = true;
                score += scores.cardScore;
                if (c.stage === card_types_1.Stage.BASIC) {
                    hasBasic = true;
                }
                const index = pokemonsToEvolve.indexOf(c.evolvesFrom);
                if (index !== -1) {
                    score += scores.evolutionScore;
                    pokemonsToEvolve.splice(index, 1);
                }
            }
            else if (c instanceof trainer_card_1.TrainerCard) {
                if (c.trainerType === card_types_1.TrainerType.SUPPORTER) {
                    hasSupporter = true;
                }
                score += scores.itemScore;
            }
        });
        if (hasEnergy) {
            score += scores.hasEnergy;
        }
        if (hasPokemon) {
            score += scores.hasPokemon;
        }
        if (hasBasic && isBenchEmpty) {
            score += scores.hasBasicWhenBenchEmpty;
        }
        if (hasSupporter) {
            score += scores.hasSupporter;
        }
        return score;
    }
}
exports.HandScore = HandScore;
