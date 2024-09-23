"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronThorns = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IronThorns extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.FUTURE];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Destructo-Press',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 70,
                damageCalculation: 'x',
                text: 'Reveal the top 5 cards of your deck. This attack does 70 damage times for each Future card you find there. Then, discard the revealed Future cards and shuffle the other cards back into your deck.'
            },
            {
                name: 'Megaton Lariat',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 140,
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 80 more damage.'
            }
        ];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Iron Thorns';
        this.fullName = 'Iron Thorns TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            // Filter for item cards
            const futureCards = deckTop.cards.filter(c => c instanceof pokemon_card_1.PokemonCard &&
                c.tags.includes(card_types_1.CardTag.FUTURE));
            if (futureCards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, futureCards), () => state);
            }
            if (futureCards.length > 0) {
                state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, futureCards), () => state);
            }
            // Move item cards to hand
            deckTop.moveCardsTo(futureCards, player.discard);
            // Move all cards to discard
            deckTop.moveTo(player.deck, deckTop.cards.length);
            effect.damage = 70 * futureCards.length;
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
                return state;
            });
        }
        return state;
    }
}
exports.IronThorns = IronThorns;
