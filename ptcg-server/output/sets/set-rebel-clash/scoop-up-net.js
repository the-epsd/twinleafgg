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
        this.setNumber = '71';
        this.set = 'RCL';
        this.fullName = 'Scoop Up Net RCL';
        this.superType = card_types_1.SuperType.TRAINER;
        this.trainerType = card_types_1.TrainerType.ITEM;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(effect.player.id, game_1.GameMessage.CHOOSE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), (results) => {
                if (results && results.length > 0) {
                    const targetPokemon = results[0];
                    if (targetPokemon === effect.player.active) {
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                            const cardList = result[0];
                            targetPokemon.clearEffects();
                            targetPokemon.cards.forEach((card, index) => {
                                if (card instanceof game_1.PokemonCard) {
                                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: card.name });
                                }
                            });
                            player.switchPokemon(cardList);
                            const scoopedPokemon = targetPokemon.cards.filter(c => c instanceof game_1.PokemonCard)[0];
                            const benchedCardList = player.bench.find(b => b.cards.includes(scoopedPokemon));
                            benchedCardList.moveCardsTo(benchedCardList.cards.filter(c => c instanceof game_1.PokemonCard), effect.player.hand);
                            benchedCardList.moveCardsTo(benchedCardList.cards.filter(c => !(c instanceof game_1.PokemonCard)), effect.player.discard);
                        });
                    }
                    else {
                        targetPokemon.moveCardsTo(targetPokemon.cards.filter(c => c instanceof game_1.PokemonCard), effect.player.hand);
                        targetPokemon.moveCardsTo(targetPokemon.cards.filter(c => !(c instanceof game_1.PokemonCard)), effect.player.discard);
                        targetPokemon.clearEffects();
                        targetPokemon.cards.forEach((card, index) => {
                            if (card instanceof game_1.PokemonCard) {
                                store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: card.name });
                            }
                        });
                    }
                }
                return state;
            });
        }
        return state;
    }
}
exports.ScoopUpNet = ScoopUpNet;
