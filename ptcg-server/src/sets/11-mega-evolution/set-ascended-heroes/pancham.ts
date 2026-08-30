import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pancham extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Reckless Charge',
    cost: [C],
    damage: 20,
    text: 'This Pokémon also does 10 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '115';
  public name: string = 'Pancham';
  public fullName: string = 'Pancham ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reckless Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}
