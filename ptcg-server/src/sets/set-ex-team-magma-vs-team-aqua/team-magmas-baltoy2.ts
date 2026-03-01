import { State, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamMagmasBaltoy2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_MAGMA];
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Night Attack',
    cost: [F],
    damage: 0,
    text: 'Put 1 damage counter on 1 of your opponent\'s Pokémon.'
  },
  {
    name: 'Spinning Attack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Team Magma\'s Baltoy';
  public fullName: string = 'Team Magma\'s Baltoy MA 61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(1, store, state, effect);
    }

    return state;
  }
}