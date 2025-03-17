"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoopUp = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class ScoopUp extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Scoop Up';
        this.fullName = 'Scoop Up BS';
        this.text = 'Choose 1 of your Pokémon in play and return its Basic Pokémon card to your hand. (Discard all cards attached to that card.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    // Get all Pokémon cards from the cardList
                    const allPokemonCards = cardList.cards.filter(card => card instanceof pokemon_card_1.PokemonCard);
                    // Separate basic Pokémon from evolution Pokémon
                    const basicPokemonCards = allPokemonCards.filter(p => p.stage === card_types_1.Stage.BASIC);
                    const evolutionPokemonCards = allPokemonCards.filter(p => p.stage !== card_types_1.Stage.BASIC);
                    // Get non-Pokémon cards
                    const nonPokemonCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard));
                    // First, move evolution Pokémon to discard
                    if (evolutionPokemonCards.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: evolutionPokemonCards });
                    }
                    // Then, move non-Pokémon cards to discard
                    if (nonPokemonCards.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.discard, { cards: nonPokemonCards });
                    }
                    // Finally, move basic Pokémon to hand
                    if (basicPokemonCards.length > 0) {
                        prefabs_1.MOVE_CARDS(store, state, cardList, player.hand, { cards: basicPokemonCards });
                    }
                    // Move the trainer card to discard
                    prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.ScoopUp = ScoopUp;
