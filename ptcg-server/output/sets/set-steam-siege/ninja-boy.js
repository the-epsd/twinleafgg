"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NinjaBoy = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class NinjaBoy extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '103';
        this.name = 'Ninja Boy';
        this.fullName = 'Ninja Boy STS';
        this.text = 'Choose 1 of your Basic Pokémon in play. Search your deck for a Basic Pokémon and switch it with that Pokémon. (Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon.) Shuffle the first Pokémon into your deck.';
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
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card.stage !== card_types_1.Stage.BASIC) {
                    blocked.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                const target = results || [];
                if (target.length === 0) {
                    return state;
                }
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selectedCards => {
                    cards = selectedCards || [];
                    if (cards.length === 0) {
                        return state;
                    }
                    cards.forEach((card, index) => {
                        target[0].moveCardTo(card, player.deck);
                        player.deck.moveCardTo(card, target[0]);
                    });
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_SWITCHES_POKEMON_WITH_POKEMON_FROM_DECK, { name: player.name, card: target[0].getPokemonCard().name, secondCard: cards[0].name });
                    player.supporter.moveCardTo(effect.trainerCard, player.discard);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
        }
        return state;
    }
}
exports.NinjaBoy = NinjaBoy;
