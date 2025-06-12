import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';

export class Horsea extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 40;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Sleepy Ball',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Horsea';
  public fullName: string = 'Horsea DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}