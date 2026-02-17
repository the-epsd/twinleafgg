import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Stunfisk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Trap Bolt',
      cost: [F],
      damage: 30,
      damageCalculation: '+' as '+',
      text: 'If, before doing damage, your opponent\'s Active Pokémon has more remaining HP than this Pokémon, this attack does 30 more damage.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Stunfisk';
  public fullName: string = 'Stunfisk UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Trap Bolt
    // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Get opponent's active remaining HP
      const checkHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkHp);
      const opponentRemainingHp = checkHp.hp - opponent.active.damage;

      // Get this Pokemon's remaining HP
      const checkMyHp = new CheckHpEffect(player, player.active);
      store.reduceEffect(state, checkMyHp);
      const myRemainingHp = checkMyHp.hp - player.active.damage;

      if (opponentRemainingHp > myRemainingHp) {
        effect.damage += 30;
      }
    }

    return state;
  }
}
