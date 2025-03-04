"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoopUpNet = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ScoopUpNet extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.name = 'Scoop Up Net';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '165';
        this.set = 'RCL';
        this.fullName = 'Scoop Up Net RCL';
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.text = 'Put 1 of your Pokémon that isn\'t a Pokémon V or a Pokémon-GX into your hand. (Discard all attached cards.)';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card instanceof game_1.PokemonCard && (card.tags.includes(card_types_1.CardTag.POKEMON_GX) ||
                    card.tags.includes(card_types_1.CardTag.POKEMON_V) ||
                    card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                    card.tags.includes(card_types_1.CardTag.POKEMON_VMAX))) {
                    blocked.push(target);
                }
            });
            prefabs_1.MOVE_CARD_TO(state, effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), result => {
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
        return state;
    }
}
exports.ScoopUpNet = ScoopUpNet;
