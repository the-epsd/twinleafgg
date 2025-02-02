"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guzma = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    // Don't allow to play both Guzmas when opponen has an empty bench
    const benchCount = opponent.bench.reduce((sum, b) => {
        return sum + (b.cards.length > 0 ? 1 : 0);
    }, 0);
    //let playTwoCards = false;
    if (benchCount > 0) {
        try {
            const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
            store.reduceEffect(state, supporterEffect);
        }
        catch (_a) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        // playTwoCards = true;
        return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            opponent.active.clearEffects();
            opponent.switchPokemon(targets[0]);
            store.log(state, game_message_1.GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE, { name: player.name, card: targets[0].getPokemonCard().name });
            next();
            // Do not discard the card yet
            effect.preventDefault = true;
            const playerHasBench = player.bench.some(b => b.cards.length > 0);
            if (!playerHasBench) {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            let target = [];
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), results => {
                target = results || [];
                next();
                if (target.length === 0) {
                    return state;
                }
                const cardList = results[0];
                if (cardList.stage == card_types_1.Stage.BASIC) {
                    try {
                        const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
                        store.reduceEffect(state, supporterEffect);
                    }
                    catch (_a) {
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    }
                }
                player.active.clearEffects();
                player.switchPokemon(target[0]);
                store.log(state, game_message_1.GameLog.LOG_PLAYER_SWITCHES_POKEMON_TO_ACTIVE, { name: player.name, card: target[0].getPokemonCard().name });
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        });
    }
}
class Guzma extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.set = 'BUS';
        this.name = 'Guzma';
        this.fullName = 'Guzma BUS';
        this.text = 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. If you do, switch your Active Pokémon with 1 of your Benched Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Guzma = Guzma;
