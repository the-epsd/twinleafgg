"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snubbull = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Snubbull extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Make a Mess',
                cost: [Y],
                damage: 20,
                damageCalculation: 'x',
                text: 'Discard up to 2 Trainer cards from your hand. This attack does 20 damage for each card you discarded in this way.'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Snubbull';
        this.fullName = 'Snubbull LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hand = player.hand;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, hand, {}, { min: 0, max: 2, allowCancel: false }), selected => {
                const discardCount = selected || [];
                // Operation canceled by the user
                if (discardCount.length === 0) {
                    return state;
                }
                player.hand.moveCardsTo(discardCount, player.discard);
                effect.damage = 20 * discardCount.length;
            });
        }
        return state;
    }
}
exports.Snubbull = Snubbull;
