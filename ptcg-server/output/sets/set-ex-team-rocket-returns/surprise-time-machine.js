"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurpriseTimeMachine = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SurpriseTimeMachine extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'TRR';
        this.name = 'Surprise! Time Machine';
        this.fullName = 'Surprise! Time Machine TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.text = 'Choose 1 of your Evolved Pokémon, remove the highest Stage Evolution card from it, and shuffle it into your deck (this counts as devolving that Pokémon). If that Pokémon remains in play, search your deck for an Evolution card that evolves from that Pokémon and put it onto that Pokémon (this counts as evolving that Pokémon). Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            let canDevolve = false;
            const player = effect.player;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (list.getPokemons().length > 1) {
                    canDevolve = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!canDevolve) {
                throw new game_1.GameError(game_1.GameStoreMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1, blocked }), (results) => {
                if (results && results.length > 0) {
                    const targetPokemon = results[0];
                    //Devolve
                    targetPokemon.moveCardsTo([targetPokemon.cards[targetPokemon.cards.length - 1]], player.deck);
                    //Evolve
                    const blocked2 = [];
                    player.deck.cards.forEach((card, index) => {
                        if (card instanceof game_1.PokemonCard && card.evolvesFrom !== targetPokemon.cards[targetPokemon.cards.length - 1].name) {
                            blocked2.push(index);
                        }
                    });
                    //Death Check?
                    const checkHpEffect = new check_effects_1.CheckHpEffect(player, targetPokemon);
                    store.reduceEffect(state, checkHpEffect);
                    if (targetPokemon.damage >= checkHpEffect.hp) {
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                        player.supporter.moveCardTo(effect.trainerCard, player.discard);
                        return state;
                    }
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked: blocked2 }), selected => {
                        cards = selected || [];
                        if (cards.length !== 0) {
                            const evolution = cards[0];
                            player.deck.moveCardTo(evolution, targetPokemon);
                        }
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                    });
                    targetPokemon.clearEffects();
                    targetPokemon.pokemonPlayedTurn = state.turn;
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.SurpriseTimeMachine = SurpriseTimeMachine;
