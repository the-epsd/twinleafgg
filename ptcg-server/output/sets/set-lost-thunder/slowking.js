"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowking = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Slowking extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Slowpoke';
        this.attacks = [{
                name: 'Memory Melt',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Look at your opponent\'s hand and put a card you find there in the Lost Zone.'
            },
            {
                name: 'Psychic',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 20 more damage times the amount of Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Slowking';
        this.fullName = 'Slowking LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            let cards = [];
            cards = opponent.hand.cards;
            // prepare card list without Junk Arm
            const handTemp = new game_1.CardList();
            handTemp.cards = opponent.hand.cards;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, handTemp, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                opponent.hand.moveCardTo(cards[0], opponent.lostzone);
                cards.forEach((card, index) => {
                    store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_LOST_ZONE, { name: opponent.name, card: card.name });
                });
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let energyAmount = 0;
            opponent.active.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    energyAmount++;
                }
            });
            effect.damage += 20 * energyAmount;
        }
        return state;
    }
}
exports.Slowking = Slowking;
