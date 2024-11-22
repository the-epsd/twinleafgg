"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidorina = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Nidorina extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nidoran F';
        this.cardType = game_1.CardType.DARK;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fetch Family',
                cost: [game_1.CardType.DARK],
                damage: 0,
                text: 'Search your deck for up to 3 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Sharp Fang',
                cost: [game_1.CardType.DARK, game_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Nidorina';
        this.fullName = 'Nidorina MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.POKEMON }, { min: 0, max: 3, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        player.deck.moveCardsTo(cards, player.hand);
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Nidorina = Nidorina;
