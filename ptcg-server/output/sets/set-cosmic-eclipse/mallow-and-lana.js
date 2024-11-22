"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MallowAndLana = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MallowAndLana extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'CEC';
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '198';
        this.name = 'Mallow & Lana';
        this.fullName = 'Mallow & Lana CEC';
        this.text = 'Switch your Active Pokémon with 1 of your Benched Pokémon.' +
            '' +
            'When you play this card, you may discard 2 other cards from your hand. If you do, heal 120 damage from the Pokémon you moved to your Bench.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const activeHasDamage = player.active.damage > 0;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            const benchedPokemon = player.bench.filter(b => b.cards.length > 0).length;
            if (benchedPokemon === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                const previousActiveCardList = player.active;
                player.switchPokemon(cardList);
                if (player.hand.cards.length < 2 || !activeHasDamage) {
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return state;
                }
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_HEAL_POKEMON), wantToUse => {
                    if (wantToUse) {
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 2, max: 2 }), cards => {
                            cards = cards || [];
                            player.hand.moveCardsTo(cards, player.discard);
                            cards.forEach((card, index) => {
                                store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
                            });
                            const healEffect = new game_effects_1.HealEffect(player, previousActiveCardList, 120);
                            state = store.reduceEffect(state, healEffect);
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_HEALS_POKEMON, { name: player.name, pokemon: previousActiveCardList.getPokemonCard().name, healingAmount: 120 });
                        });
                    }
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
            });
        }
        return state;
    }
}
exports.MallowAndLana = MallowAndLana;
