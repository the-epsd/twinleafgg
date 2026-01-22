import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, ADD_POISON_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';

export class Scolipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Whirlipede';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Toxic Claws',
      cost: [P, C],
      damage: 30,
      text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
    },
    {
      name: 'Wild Horn',
      cost: [P, C, C],
      damage: 50,
      damageCalculation: '+',
      text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Scolipede';
  public fullName: string = 'Scolipede EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 20);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        (effect as AttackEffect).damage += 20 * heads;
      });
    }

    return state;
  }
}
