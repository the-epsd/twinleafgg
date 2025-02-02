"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Klang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Klink';
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Gear Grind',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: 'x',
                text: 'Flip 2 coins. The attack does 80 damage for each heads.'
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '124';
        this.name = 'Klang';
        this.fullName = 'Klang SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP)
            ], (results) => {
                const heads = results.filter(r => !!r).length;
                effect.damage = 80 * heads;
            });
        }
        return state;
    }
}
exports.Klang = Klang;
