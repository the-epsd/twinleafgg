import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Spidopsex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public evolvesFrom = 'Tarountula';

  public powers = [{
    name: 'Trap Territory',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Pokémon\'s Retreat Cost is [C] more.'
  }];

  public attacks = [{
    name: 'Wire Hang',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 90,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Spidops ex';

  public fullName: string = 'Spidops ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSpidopsexInPlay = false;
      /*player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isSpidopsexInPlay = true;
        }
      });*/
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
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      const pokemonCard = opponent.active.getPokemonCard();

      /*opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => {
        // Add 1 more Colorless energy to the opponent's Active Pokemon's retreat cost
        effect.cost.push(CardType.COLORLESS);
      });*/

      if (pokemonCard) {
        effect.cost.push(CardType.COLORLESS);
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveCard = opponent.active.getPokemonCard();
      if (opponentActiveCard) {
        const retreatCost = opponentActiveCard.retreat.filter(c => c === CardType.COLORLESS).length;

        effect.damage += retreatCost * 30;
      }
      return state;
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
//     const stub = new PowerEffect(player, {
//   name: 'test',
//   powerType: PowerType.ABILITY,
//   text: ''
// }, this);
// store.reduceEffect(state, stub);
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
