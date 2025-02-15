"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamPlasmaBall = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class TeamPlasmaBall extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.set = 'PLF';
        this.name = 'Team Plasma Ball';
        this.fullName = 'Team Plasma Ball PLF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.text = 'Search your deck for a Team Plasma Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (!(card instanceof game_1.PokemonCard && card.tags.includes(card_types_1.CardTag.TEAM_PLASMA))) {
                    blocked.push(index);
                }
            });
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
                const cards = selected || [];
                if (cards.length === 0) {
                    return state;
                }
                prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, cards);
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        return state;
    }
}
exports.TeamPlasmaBall = TeamPlasmaBall;
