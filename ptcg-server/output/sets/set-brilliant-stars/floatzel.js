"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floatzel = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Floatzel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Buizel';
        this.attacks = [
            {
                name: 'Floatify',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put up to 2 Item cards from your discard pile into your hand.'
            },
            {
                name: 'Water Gun',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'BRS';
        this.name = 'Floatzel';
        this.fullName = 'Floatzel BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const itemCount = player.discard.cards.filter(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM;
            }).length;
            if (itemCount === 0) {
                return state;
            }
            const max = Math.min(2, itemCount);
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.ITEM }, { min: 1, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                    player.discard.moveCardsTo(cards, player.hand);
                });
                store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                });
            });
        }
        return state;
    }
}
exports.Floatzel = Floatzel;
