"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thorton = void 0;
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Thorton extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '167';
        this.name = 'Thorton';
        this.fullName = 'Thorton LOR';
        this.text = 'Choose a Basic Pokémon in your discard pile and switch it with 1 of your Basic Pokémon in play. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon. You may play only 1 Supporter card during your turn.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            const hasBasicInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.PokemonCard && card_types_1.Stage.BASIC;
            });
            if (!hasBasicInDiscard) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.stage !== card_types_1.Stage.BASIC) {
                    blocked.push();
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), selected => {
                const targets = selected || [];
                if (targets.length === 0) {
                    throw new game_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                }
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selectedCards => {
                    const card = selectedCards[0];
                    if (!card) {
                        throw new game_1.GameError(game_message_1.GameMessage.INVALID_TARGET);
                    }
                    // Move the first selected Pokémon to the discard pile
                    const targetList = targets[0];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        targetList.removeBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    });
                    targetList.moveCardTo(targetList.cards[0], player.discard);
                    // Move the selected card from the discard to the target slot
                    player.discard.moveCardTo(card, targetList);
                    // Move Thorton to the discard pile
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                });
            });
        }
        return state;
    }
}
exports.Thorton = Thorton;
