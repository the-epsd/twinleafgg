"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Colorful Friends',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 3 Pokémon of different types, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Skip',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '133';
        this.name = 'Eevee';
        this.fullName = 'Eevee MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: true, differentTypes: true }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Eevee = Eevee;
