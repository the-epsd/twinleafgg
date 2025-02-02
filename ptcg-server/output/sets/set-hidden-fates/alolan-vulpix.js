"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanVulpix = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanVulpix extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 60;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Beacon',
                cost: [],
                damage: 0,
                text: 'Search your deck for up to 2 Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            }, {
                name: 'Icy Snow',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'HIF';
        this.name = 'Alolan Vulpix';
        this.fullName = 'Alolan Vulpix HIF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.POKEMON }, { min: 0, max: 2, allowCancel: true }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.AlolanVulpix = AlolanVulpix;
