"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Slowbro extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = game_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tumbling Tackle',
                cost: [game_1.CardType.COLORLESS],
                damage: 20,
                text: 'Both Active Pokémon are now Asleep.'
            },
            {
                name: 'Twilight Inspiration',
                cost: [],
                damage: 0,
                text: 'You can use this attack only if your opponent has exactly 1 Prize card remaining. Take 2 Prize cards.'
            }
        ];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialConditionEffect);
            const player = effect.player;
            specialConditionEffect.target = player.active;
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // const opponent = StateUtils.getOpponent(state, player);
            // const prizesTaken = 6 - opponent.getPrizeLeft();
            // if (prizesTaken === 1) {
            const prizes = player.prizes;
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, prizes, {}, { min: 2, allowCancel: true }), selected => {
                cards = selected || [];
            });
            prizes.moveCardsTo(cards, player.hand);
            return state;
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
