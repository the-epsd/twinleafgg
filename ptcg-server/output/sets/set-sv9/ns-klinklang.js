"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsKlinklang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class NsKlinklang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'N\'s Klang';
        this.cardType = M;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [
            { name: 'Magnetic Blast', cost: [C], damage: 50, text: '' },
            {
                name: 'Triple Smash',
                cost: [M, M, C],
                damage: 120,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 120 damage for each heads.'
            }
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'N\'s Klinklang';
        this.fullName = 'N\'s Klinklang SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage += 120 * heads;
            });
        }
        return state;
    }
}
exports.NsKlinklang = NsKlinklang;
