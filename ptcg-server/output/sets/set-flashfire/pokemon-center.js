"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCenter = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class PokemonCenter extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'FLF';
        this.name = 'Pokemon Center';
        this.fullName = 'Pokemon Center NXD';
        this.text = 'Once during each player\'s turn, that player may heal 20 damage ' +
            'from 1 of his or her Benched Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && state_utils_1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const blocked = [];
            let hasPokemonWithDamage = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList === player.active) {
                    return;
                }
                if (cardList.damage === 0) {
                    blocked.push(target);
                }
                else {
                    hasPokemonWithDamage = true;
                }
            });
            if (hasPokemonWithDamage === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_STADIUM);
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: true, blocked }), results => {
                const targets = results || [];
                if (targets.length === 0) {
                    return state;
                }
                targets.forEach(target => {
                    // Heal Pokemon
                    const healEffect = new game_effects_1.HealEffect(player, target, 20);
                    store.reduceEffect(state, healEffect);
                });
            });
        }
        return state;
    }
}
exports.PokemonCenter = PokemonCenter;
