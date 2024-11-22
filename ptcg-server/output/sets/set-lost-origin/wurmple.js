"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wurmple = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
class Wurmple extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sting',
                cost: [card_types_1.CardType.GRASS],
                damage: 10,
                text: ''
            },
            {
                name: 'Creepy-Crawly Congregation',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for any number of Wurmple, Silcoon, Beautifly, Cascoon, and Dustox, reveal them, and put them into your hand. Then, shuffle your deck.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.name = 'Wurmple';
        this.fullName = 'Wurmple LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard &&
                    !['Wurmple', 'Silcoon', 'Cascoon', 'Beautifly', 'Dustox'].includes(card.name)) {
                    blocked.push(index);
                }
            });
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 59, blocked }), cards => {
                cards = cards || [];
                cards.forEach(card => player.deck.moveCardTo(card, player.hand));
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    return player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Wurmple = Wurmple;
