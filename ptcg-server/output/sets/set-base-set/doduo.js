"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doduo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Doduo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip 2 coins. This attack does 10 damage times the number of heads.',
            }
        ];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Doduo';
        this.fullName = 'Doduo BS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 10 * heads;
            });
        }
        return state;
    }
}
exports.Doduo = Doduo;
