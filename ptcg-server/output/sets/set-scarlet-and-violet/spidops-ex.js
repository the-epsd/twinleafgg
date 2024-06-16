"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spidopsex = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Spidopsex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 260;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Trap Territory',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }];
        this.attacks = [{
                name: 'Wire Hang',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: ''
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
        this.name = 'Spidops ex';
        this.fullName = 'Spidops ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSpidopsexInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpidopsexInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSpidopsexInPlay = true;
                }
            });
            if (!isSpidopsexInPlay) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, () => {
                // Add 1 more Colorless energy to the opponent's Active Pokemon's retreat cost
                effect.cost.push(game_1.CardType.COLORLESS);
            });
        }
        return state;
    }
}
exports.Spidopsex = Spidopsex;
// if (effect instanceof CheckRetreatCostEffect) {
//   const player = effect.player;
//   const opponent = StateUtils.getOpponent(state, player);
//   let playerSpidopsExCount = 0;
//   let opponentSpidopsExCount = 0;
//   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
//     if (card === this) {
//       playerSpidopsExCount++;
//     }
//   });
//   opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
//     if (card === this) {
//       opponentSpidopsExCount++;
//     }
//   });
//   // Try to reduce PowerEffect, to check if something is blocking our ability
//   try {
//     const powerEffect = new PowerEffect(player, this.powers[0], this);
//     store.reduceEffect(state, powerEffect);
//   } catch {
//     return state;
//   }
//   // Add Colorless energy to the opponent's Active Pokemon's retreat cost
//   if (player.active === this) {
//     for (let i = 0; i < playerSpidopsExCount; i++) {
//       effect.cost.push(CardType.COLORLESS);
//     }
//   } else {
//     for (let i = 0; i < opponentSpidopsExCount; i++) {
//       effect.cost.push(CardType.COLORLESS);
//     }
//   }
// }
// return state;
