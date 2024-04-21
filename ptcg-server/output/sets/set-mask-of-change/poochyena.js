"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poochyena = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Poochyena extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Continuous Steps',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                text: 'Flip a coin until you get tails. This attack does 10 damage for each heads.'
            },
            {
                name: 'Darkness Fang',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '66';
        this.name = 'Poochyena';
        this.fullName = 'Poochyena SV6';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), results => {
                let numFlips = 0;
                if (results === true) {
                    numFlips++;
                    store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), results => { });
                }
                if (numFlips === 0) {
                    return state;
                }
                effect.damage = 10 * numFlips;
            });
        }
        return state;
    }
}
exports.Poochyena = Poochyena;
