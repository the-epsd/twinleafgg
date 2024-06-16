import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Spidopsex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Trap Territory',
    powerType: PowerType.ABILITY,
    text: ''
  }];

  public attacks = [{
    name: 'Wire Hang',
    cost: [ CardType.GRASS, CardType.COLORLESS ],
    damage: 90,
    damageCalculation: '+',
    text: ''
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public name: string = 'Spidops ex';

  public fullName: string = 'Spidops ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      let isSpidopsexInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpidopsexInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpidopsexInPlay = true;
        }
      });

      if (!isSpidopsexInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
    
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => {
        // Add 1 more Colorless energy to the opponent's Active Pokemon's retreat cost
        effect.cost.push(CardType.COLORLESS);
      });
    }
    return state;
  }
}

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
