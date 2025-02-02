"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchRaft = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const hasBench = player.bench.some(b => b.cards.length > 0);
    const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(player.active);
    store.reduceEffect(state, checkPokemonTypeEffect);
    const activeIsNotWater = !checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.WATER);
    if (hasBench === false || activeIsNotWater) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const pokemonCard = player.active.getPokemonCard();
    if (pokemonCard) {
        let targets = [];
        yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
            targets = results || [];
            next();
        });
        if (targets.length === 0) {
            return state;
        }
        // Discard trainer only when user selected a Pokemon
        const healEffect = new game_effects_1.HealEffect(player, player.active, 30);
        store.reduceEffect(state, healEffect);
        player.active.clearEffects();
        player.switchPokemon(targets[0]);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
    }
    return state;
}
class SwitchRaft extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DRM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Switch Raft';
        this.fullName = 'Switch Raft DRM';
        this.text = 'Switch your Active [W] Pokémon with 1 of your Benched Pokémon. If you do, heal 30 damage from the Pokémon you moved to your Bench.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SwitchRaft = SwitchRaft;
