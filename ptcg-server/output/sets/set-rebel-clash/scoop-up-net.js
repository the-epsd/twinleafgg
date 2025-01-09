"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoopUpNet = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
        // if (effect instanceof TrainerEffect && effect.trainerCard === this) {
        //   const player = effect.player;
        //   return store.prompt(
        //     state,
        //     new ChoosePokemonPrompt(
        //       effect.player.id,
        //       GameMessage.CHOOSE_POKEMON,
        //       PlayerType.BOTTOM_PLAYER,
        //       [SlotType.ACTIVE, SlotType.BENCH],
        //       { allowCancel: false, min: 1, max: 1 }
        //     ),
        //     (results) => {
        //       if (results && results.length > 0) {
        //         const targetPokemon = results[0];
        //         if (targetPokemon === effect.player.active) {
        //           return store.prompt(state, new ChoosePokemonPrompt(
        //             player.id,
        //             GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        //             PlayerType.BOTTOM_PLAYER,
        //             [SlotType.BENCH],
        //             { allowCancel: false }
        //           ), result => {
        //             const cardList = result[0];
        //             targetPokemon.damage = 0;
        //             targetPokemon.clearEffects();
        //             targetPokemon.cards.forEach((card, index) => {
        //               if (card instanceof PokemonCard) {
        //                 store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: card.name });
        //               }
        //             });
        //             player.switchPokemon(cardList);
        //             const scoopedPokemon = targetPokemon.cards.filter(c => c instanceof PokemonCard)[0];
        //             const benchedCardList = player.bench.find(b => b.cards.includes(scoopedPokemon));
        //             player.supporter.moveCardTo(effect.trainerCard, player.discard);
        //             benchedCardList!.moveCardsTo(benchedCardList!.cards.filter(c => c instanceof PokemonCard), effect.player.hand);
        //             benchedCardList!.moveCardsTo(benchedCardList!.cards.filter(c => !(c instanceof PokemonCard)), effect.player.discard);
        //           });
        //         } else {
        //           targetPokemon.moveCardsTo(targetPokemon.cards.filter(c => c instanceof PokemonCard), effect.player.hand);
        //           targetPokemon.moveCardsTo(targetPokemon.cards.filter(c => !(c instanceof PokemonCard)), effect.player.discard);
        //           targetPokemon.clearEffects();
        //           player.supporter.moveCardTo(effect.trainerCard, player.discard);
        //           targetPokemon.cards.forEach((card, index) => {
        //             if (card instanceof PokemonCard) {
        //               store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: card.name });
        //             }
        //           });
        //         }
        //       }
        //       return state;
        //     }
        //   );
        // }
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.POKEMON_GX) || card.tags.includes(card_types_1.CardTag.POKEMON_V) || card.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || card.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                    blocked.push();
                }
            });
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: blocked }), result => {
                const cardList = result.length > 0 ? result[0] : null;
                if (cardList !== null) {
                    const pokemons = cardList.getPokemons();
                    cardList.clearEffects();
                    cardList.damage = 0;
                    cardList.moveCardsTo(pokemons, player.hand);
                    cardList.moveTo(player.discard);
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                }
            });
        }
        return state;
    }
}
exports.ScoopUpNet = ScoopUpNet;
