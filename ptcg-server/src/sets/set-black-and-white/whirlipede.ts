import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, ADD_POISON_TO_PLAYER_ACTIVE } from '../../game/store/prefabs/prefabs';

export class Whirlipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venipede';
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Toxic Claws',
      cost: [P, C],
      damage: 30,
      text: 'The Defending Pokemon is now Poisoned. Put 2 damage counters instead of 1 on that Pokemon between turns.'
    },
    {
      name: 'Steamroller',
      cost: [P, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Whirlipede';
  public fullName: string = 'Whirlipede BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 20);
    }
    return state;
  }
}
