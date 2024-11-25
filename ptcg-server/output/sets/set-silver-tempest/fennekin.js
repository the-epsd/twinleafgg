"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fennekin = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Fennekin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Lead',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: ' Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck. '
            },
            {
                name: 'Live Coal',
                cost: [card_types_1.CardType.FIRE],
                damage: 10,
                text: ''
            }];
        this.set = 'SIT';
        this.setNumber = '25';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Fennekin';
        this.fullName = 'Fennekin SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        cards.forEach((card, index) => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
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
exports.Fennekin = Fennekin;
