import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Groudon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 140;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hammer In',
    cost: [F, F, C],
    damage: 80,
    text: ''
  },
  {
    name: 'Megaton Fall',
    cost: [F, F, C, C],
    damage: 150,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Groudon';
  public fullName: string = 'Groudon ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Megaton Fall
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
