"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchCart = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const hasBench = player.bench.some(b => b.cards.length > 0);
    if (hasBench === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    effect.preventDefault = true;
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    const pokemonCard = player.active.getPokemonCard();
    if (pokemonCard && pokemonCard.stage !== card_types_1.Stage.BASIC) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (pokemonCard && pokemonCard.stage === card_types_1.Stage.BASIC) {
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
class SwitchCart extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Switch Cart';
        this.fullName = 'Switch Cart ASR';
        this.text = 'Switch your Active Basic Pokémon with 1 of your Benched Pokémon. If you do, heal 30 damage from the Pokémon you moved to your Bench.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SwitchCart = SwitchCart;
