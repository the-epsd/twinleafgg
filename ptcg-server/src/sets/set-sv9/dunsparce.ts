import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dunsparce extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Trading Places',
      cost: [C],
      damage: 0,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    },
    { name: 'Ram', cost: [C, C], damage: 20, text: '' },
  ];

  public set = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name = 'Dunsparce';
  public fullName = 'Dunsparce SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this))
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    return state;
  }
}