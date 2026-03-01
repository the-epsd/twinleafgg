import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Sing',
      cost: [C],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Double-Edge',
      cost: [C, C, C],
      damage: 60,
      text: 'This Pokémon does 30 damage to itself.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '80';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey DEX 80';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sing
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Double-Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
