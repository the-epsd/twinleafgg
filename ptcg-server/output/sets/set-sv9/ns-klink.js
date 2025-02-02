"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsKlink = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class NsKlink extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = M;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Double Spin',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 10 damage for each heads.'
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '64';
        this.name = 'N\'s Klink';
        this.fullName = 'N\'s Klink SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 10 * heads;
            });
        }
        return state;
    }
}
exports.NsKlink = NsKlink;
