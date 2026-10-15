import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Wooper extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: 20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Yawn',
    cost: [C],
    damage: 0,
    text: 'The Defending Pokémon is now Asleep.'
  },
{
    name: 'Splatter',
    cost: [W],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '118';
  public name: string = 'Wooper';
  public fullName: string = 'Wooper SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Yawn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    // Splatter
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    return state;
  }
}
