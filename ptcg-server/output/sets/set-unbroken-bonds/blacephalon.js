"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blacephalon = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Blacephalon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.ULTRA_BEAST];
        this.stage = game_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Blazer',
                cost: [R],
                damage: 10,
                damageCalculation: '+',
                text: 'Turn 1 of your face-down Prize cards face up. If it\'s a [R] Energy card, this attack does 50 more damage. (That Prize card remains face up for the rest of the game.) '
            },
            {
                name: 'Fireball Circus',
                cost: [R, R, R],
                damage: 0,
                damageCalculation: 'x',
                text: 'Discard any number of [R] Energy cards from your hand. This attack does 50 damage for each card you discarded in this way.'
            },
        ];
        this.set = 'UNB';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Blacephalon';
        this.fullName = 'Blacephalon UNB';
    }
    reduceEffect(store, state, effect) {
        // Blazer
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, allowCancel: false }), prizes => {
                if (prizes && prizes.length > 0) {
                    const prize = prizes[0];
                    const prizeCard = prize.cards[0];
                    if ((prizeCard.superType == game_1.SuperType.ENERGY) && (prizeCard.name == 'Fire Energy')) {
                        effect.damage += 50;
                    }
                    prize.isPublic = true;
                    prize.isSecret = false;
                }
            });
        }
        // Fireball Circus
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY, name: 'Fire Energy' }, { min: 1, allowCancel: false }), selected => {
                effect.damage += (50 * selected.length);
                player.hand.moveCardsTo(selected, player.discard);
            });
        }
        return state;
    }
}
exports.Blacephalon = Blacephalon;
