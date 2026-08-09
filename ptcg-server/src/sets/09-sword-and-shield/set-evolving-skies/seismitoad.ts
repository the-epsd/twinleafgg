import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_ATTACKS_COST_MORE, DEFENDING_POKEMON_RETREAT_COSTS_MORE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Seismitoad extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Palpitoad';
  public cardType: CardType = F;
  public hp: number = 170;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];


  public attacks = [{
    name: 'Shaky Wave',
    cost: [F],
    damage: 60,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks cost Colorless more, and its Retreat Cost is Colorless more.'
  },
  {
    name: 'Hyper Voice',
    cost: [F, C, C, C],
    damage: 160,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '90';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = DEFENDING_POKEMON_ATTACKS_COST_MORE(store, state, effect, 1);
      state = DEFENDING_POKEMON_RETREAT_COSTS_MORE(store, state, effect, 1);
    }

    return state;
  }
}
