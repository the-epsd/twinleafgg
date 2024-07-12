"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeBlower = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const game_message_1 = require("../../game/game-message");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const state_utils_1 = require("../../game/store/state-utils");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const name = effect.trainerCard.name;
    const count = player.hand.cards.reduce((sum, c) => {
        return sum + (c.name === name ? 1 : 0);
    }, 0);
    // Don't allow to play both blowers,
    // when opponen has an empty bench
    const benchCount = opponent.bench.reduce((sum, b) => {
        return sum + (b.cards.length > 0 ? 1 : 0);
    }, 0);
    let playTwoCards = false;
    if (benchCount > 0 && count >= 2) {
        yield store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_message_1.GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE), result => {
            playTwoCards = result;
            next();
        });
    }
    if (playTwoCards === false) {
        let coinFlip = false;
        yield store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
            coinFlip = result;
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            next();
        });
        if (coinFlip === false) {
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false }), targets => {
            if (targets && targets.length > 0) {
                targets[0].damage += 10;
            }
            next();
        });
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    // Discard second Poke-Blower +
    const second = player.hand.cards.find(c => {
        return c.name === name && c !== effect.trainerCard;
    });
    if (second !== undefined) {
        player.hand.moveCardTo(second, player.discard);
    }
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { allowCancel: false }), targets => {
        if (!targets || targets.length === 0) {
            return;
        }
        opponent.switchPokemon(targets[0]);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
    });
}
class PokeBlower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Poke Blower +';
        this.fullName = 'Poke Blower SF';
        this.text = 'You may play 2 Poke Blower + at the same time. If you play 1 ' +
            'Poke Blower +, flip a coin. If heads, put 1 damage counter on 1 of your ' +
            'opponent\'s Pokemon. If you play 2 Poke Blower +, choose 1 of your ' +
            'opponent\'s Benched Pokemon and switch it with 1 of your opponent\'s ' +
            'Active Pokemon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.PokeBlower = PokeBlower;
