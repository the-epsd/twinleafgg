"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CherensCare = void 0;
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    const supporterTurn = player.supporterTurn;
    if (supporterTurn > 0) {
        throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    // We will discard this card after prompt confirmation
    effect.preventDefault = true;
    // Create list of non - Pokemon SP slots
    const blocked = [];
    let hasColorlessPokemon = false;
    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        const isColorlessPokemon = card.cardType === card_types_1.CardType.COLORLESS;
        hasColorlessPokemon = hasColorlessPokemon || isColorlessPokemon;
        if (!isColorlessPokemon) {
            blocked.push(target);
        }
    });
    if (!hasColorlessPokemon) {
        throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: true, blocked }), result => {
        const cardList = result.length > 0 ? result[0] : null;
        if (cardList !== null) {
            const pokemons = cardList.getPokemons();
            const otherCards = cardList.cards.filter(card => !(card instanceof game_1.PokemonCard)); // Ensure only non-PokemonCard types
            // Move other cards to hand
            if (otherCards.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: otherCards });
            }
            // Move Pokémon to hand
            if (pokemons.length > 0) {
                prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: pokemons });
            }
            prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
        }
    });
}
class CherensCare extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '134';
        this.name = 'Cheren\'s Care';
        this.fullName = 'Cheren\'s Care BRS';
        this.text = 'Put 1 of your [C] Pokémon that has any damage counters on it and all attached cards into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.CherensCare = CherensCare;
