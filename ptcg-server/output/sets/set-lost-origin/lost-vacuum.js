"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostVacuum = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class LostVacuum extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.regulationMark = 'F';
        this.name = 'Lost Vacuum';
        this.fullName = 'Lost Vacuum LOR';
        this.text = 'You can use this card only if you put another card from your hand in the Lost Zone.' +
            '' +
            'Choose a Pokémon Tool attached to any Pokémon, or any Stadium in play, and put it in the Lost Zone.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const options = [
                {
                    message: game_1.GameMessage.CHOOSE_TOOL,
                    action: () => {
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
                        if (pokemonsWithTool === 0) {
                            throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                        }
                        // We will discard this card after prompt confirmation
                        effect.preventDefault = true;
                        const max = Math.min(1, pokemonsWithTool);
                        let targets = [];
                        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.ANY, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: true, blocked }), results => {
                            targets = results || [];
                            if (targets.length === 0) {
                                return state;
                            }
                            // Discard trainer only when user selected a Pokemon
                            player.hand.moveCardTo(effect.trainerCard, player.discard);
                            targets.forEach(target => {
                                const owner = game_1.StateUtils.findOwner(state, target);
                                if (target.tool !== undefined) {
                                    target.moveCardTo(target.tool, owner.discard);
                                    target.tool = undefined;
                                }
                                return state;
                            });
                            return state;
                        });
                    }
                },
                {
                    message: game_1.GameMessage.CHOOSE_STADIUM,
                    action: () => {
                        const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                        if (stadiumCard !== undefined) {
                            // Discard Stadium
                            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                            const player = game_1.StateUtils.findOwner(state, cardList);
                            cardList.moveTo(player.discard);
                            return state;
                        }
                        return state;
                    }
                }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_SPECIAL_CONDITION, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (option.action) {
                    option.action();
                }
                return state;
            });
        }
        return state;
    }
}
exports.LostVacuum = LostVacuum;
