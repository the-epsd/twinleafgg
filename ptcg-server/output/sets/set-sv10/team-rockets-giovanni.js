"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsGiovanni = void 0;
const game_1 = require("../../game");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const state_utils_1 = require("../../game/store/state-utils");
class TeamRocketsGiovanni extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Team Rocket\'s Giovanni';
        this.fullName = 'Team Rocket\'s Giovanni SV10';
        this.text = 'Switch your Active Team Rocket\'s Pokemon with 1 of your Benched Team Rocket\'s Pokemon. If you do, then switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Check if active Pokémon is a Team Rocket's Pokémon
            const activePokemon = player.active.getPokemonCard();
            if (!activePokemon ||
                !activePokemon.tags ||
                !activePokemon.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Create a blocked array for non-Team Rocket Pokémon
            const blocked = [];
            let teamRocketBenchCount = 0;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (target.slot === play_card_action_1.SlotType.BENCH) {
                    if (!card.tags || !card.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                        blocked.push(target);
                    }
                    else {
                        teamRocketBenchCount++;
                    }
                }
            });
            if (teamRocketBenchCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if opponent has benched Pokémon
            const benchCount = opponent.bench.reduce((sum, b) => {
                return sum + (b.cards.length > 0 ? 1 : 0);
            }, 0);
            if (benchCount === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // First, have player choose which Team Rocket's Pokémon to switch to
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], {
                allowCancel: false,
                blocked: blocked
            }), targets => {
                if (!targets || targets.length === 0) {
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
                // Switch player's Pokémon
                player.active.clearEffects();
                player.switchPokemon(targets[0]);
                // Then have player choose which of opponent's benched Pokémon to switch to active
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), oppTargets => {
                    if (!oppTargets || oppTargets.length === 0) {
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    }
                    // Switch opponent's Pokémon
                    opponent.active.clearEffects();
                    opponent.switchPokemon(oppTargets[0]);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                });
            });
        }
        return state;
    }
}
exports.TeamRocketsGiovanni = TeamRocketsGiovanni;
