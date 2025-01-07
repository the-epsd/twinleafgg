"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ponyta = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Ponyta extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Ponyta';
        this.cardImage = 'assets/cardback.png';
        this.set = 'CEC';
        this.setNumber = '23';
        this.cardType = card_types_1.CardType.FIRE;
        this.fullName = 'Ponyta CEC';
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Minor Errand-Running',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Flare',
                cost: [card_types_1.CardType.FIRE],
                damage: 10,
                text: ''
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
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
exports.Ponyta = Ponyta;
