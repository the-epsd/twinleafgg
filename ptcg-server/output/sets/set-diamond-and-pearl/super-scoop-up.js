"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperScoopUp = void 0;
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    let coinResult = false;
    yield store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), result => {
        coinResult = result;
        next();
    });
    if (coinResult === false) {
        return state;
    }
    return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), result => {
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
            prefabs_1.MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
        }
    });
}
class SuperScoopUp extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'DP';
        this.name = 'Super Scoop Up';
        this.fullName = 'Super Scoop Up DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '115';
        this.text = 'Flip a coin. If heads, put 1 of your Pokemon ' +
            'and all cards attached to it into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.SuperScoopUp = SuperScoopUp;
