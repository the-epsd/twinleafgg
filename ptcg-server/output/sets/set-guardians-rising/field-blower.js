"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldBlower = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class FieldBlower extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'GRI';
        this.name = 'Field Blower';
        this.fullName = 'Field Blower GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '125';
        this.text = 'Choose up to 2 in any combination of Pokémon Tool cards and Stadium cards in play (yours or your opponent\'s) and discard them.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let pokemonsWithTool = 0;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.tool !== undefined) {
                    pokemonsWithTool += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.tool !== undefined) {
                    pokemonsWithTool += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (pokemonsWithTool === 0 && stadiumCard == undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            if (pokemonsWithTool >= 1 && stadiumCard !== undefined) {
                const options = [
                    {
                        message: game_1.GameMessage.YES,
                        action: () => {
                            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                            const stadiumPlayer = game_1.StateUtils.findOwner(state, cardList);
                            cardList.moveTo(stadiumPlayer.discard);
                            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name });
                            let targets = [];
                            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 0, max: 1, allowCancel: false, blocked }), results => {
                                targets = results || [];
                                if (targets.length === 0) {
                                    player.supporter.moveCardTo(this, player.discard);
                                    return state;
                                }
                                targets.forEach(target => {
                                    const owner = game_1.StateUtils.findOwner(state, target);
                                    if (target.tool !== undefined) {
                                        target.moveCardTo(target.tool, owner.discard);
                                        store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: target.tool.name });
                                        target.tool = undefined;
                                    }
                                    player.supporter.moveCardTo(this, player.discard);
                                    return state;
                                });
                                return state;
                            });
                        }
                    },
                    {
                        message: game_1.GameMessage.NO,
                        action: () => {
                            const max = Math.min(2, pokemonsWithTool);
                            let targets = [];
                            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false, blocked }), results => {
                                targets = results || [];
                                if (targets.length === 0) {
                                    player.supporter.moveCardTo(this, player.discard);
                                    return state;
                                }
                                targets.forEach(target => {
                                    const owner = game_1.StateUtils.findOwner(state, target);
                                    if (target.tool !== undefined) {
                                        target.moveCardTo(target.tool, owner.discard);
                                        store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: target.tool.name });
                                        target.tool = undefined;
                                    }
                                    return state;
                                });
                                player.supporter.moveCardTo(this, player.discard);
                                return state;
                            });
                        }
                    }
                ];
                return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.WANT_TO_DISCARD_STADIUM, options.map(c => c.message), { allowCancel: false }), choice => {
                    const option = options[choice];
                    if (option.action) {
                        option.action();
                    }
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                });
            }
            else if (pokemonsWithTool === 0 && stadiumCard !== undefined) {
                // Discard Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(owner.discard);
                store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: stadiumCard.name });
                player.supporter.moveCardTo(this, player.discard);
                return state;
            }
            else if (pokemonsWithTool >= 1 && stadiumCard == undefined) {
                // We will discard this card after prompt confirmation
                effect.preventDefault = true;
                const max = Math.min(2, pokemonsWithTool);
                let targets = [];
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false, blocked }), results => {
                    targets = results || [];
                    if (targets.length === 0) {
                        return state;
                    }
                    targets.forEach(target => {
                        const owner = game_1.StateUtils.findOwner(state, target);
                        if (target.tool !== undefined) {
                            target.moveCardTo(target.tool, owner.discard);
                            store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_WITH_FIELD_BLOWER, { name: player.name, card: target.tool.name });
                            target.tool = undefined;
                        }
                        player.supporter.moveCardTo(this, player.discard);
                        return state;
                    });
                });
            }
            return state;
        }
        return state;
    }
}
exports.FieldBlower = FieldBlower;
