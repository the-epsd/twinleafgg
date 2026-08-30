import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Glameow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gentle Bite',
    cost: [C],
    damage: 10,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 40 less damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'UPR';
  public setNumber: string = '108';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Glameow';
  public fullName: string = 'Glameow UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gentle Bite
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 40);
    }

    return state;
  }
}
