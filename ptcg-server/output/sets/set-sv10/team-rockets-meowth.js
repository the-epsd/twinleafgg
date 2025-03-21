"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsMeowth = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsMeowth extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Cat Nab',
                cost: [C],
                damage: 0,
                text: 'Choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into their deck.'
            },
            {
                name: 'Wild Scratch',
                cost: [C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 20 damage for each heads.'
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '78';
        this.name = 'Team Rocket\'s Meowth';
        this.fullName = 'Team Rocket\'s Meowth SV10';
    }
    reduceEffect(store, state, effect) {
        // Cat Nab
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1, isSecret: true }), cards => {
                cards = cards || [];
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, player, cards);
                opponent.hand.moveCardsTo(cards, opponent.deck);
                prefabs_1.SHUFFLE_DECK(store, state, opponent);
            });
        }
        // Wild Scratch
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.TeamRocketsMeowth = TeamRocketsMeowth;
