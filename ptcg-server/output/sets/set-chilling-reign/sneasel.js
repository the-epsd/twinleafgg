"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sneasel extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.RAPID_STRIKE];
        this.cardType = game_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Cut Down',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    // Defending Pokemon has no energy cards attached
                    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                        return state;
                    }
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        opponent.active.moveCardTo(card, opponent.discard);
                        return state;
                    });
                }
            });
            return state;
        }
        return state;
    }
}
exports.Sneasel = Sneasel;
