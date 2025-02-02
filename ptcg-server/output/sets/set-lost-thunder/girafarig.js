"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Girafarig = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Girafarig extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.PSYCHIC }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Get Lost',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 2 cards from your opponent\'s discard pile in the Lost Zone.'
            },
            {
                name: 'Mind Shock',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 70,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
            }
        ];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Girafarig';
        this.fullName = 'Girafarig LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Get Lost
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.discard, {}, { min: 2, max: 2 }), selected => {
                if (selected && selected.length === 2) {
                    selected.forEach(card => {
                        opponent.discard.moveCardsTo(selected, player.lostzone);
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Mind Shock
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Girafarig = Girafarig;
