"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tynamo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Tynamo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Call Sign',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: ' Search your deck for a [L] Pokémon, reveal it, and put it into your hand. Then, shuffle your deck. '
            },
            {
                name: 'Tiny Charge',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 10,
                text: ''
            }];
        this.set = 'LOR';
        this.setNumber = '59';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tynamo';
        this.fullName = 'Tynamo LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.LIGHTNING }, { min: 0, max: 2, allowCancel: true }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                });
                return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
            });
        }
        return state;
    }
}
exports.Tynamo = Tynamo;
