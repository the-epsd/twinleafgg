"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandslash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Sandslash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sandshrew';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [{ type: card_types_1.CardType.LIGHTNING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Slash',
                cost: [C, C],
                damage: 20,
                text: ''
            },
            {
                name: 'Fury Swipes',
                cost: [F, F],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Sandslash';
        this.fullName = 'Sandslash FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 20 * heads;
            });
            return state;
        }
        return state;
    }
}
exports.Sandslash = Sandslash;
