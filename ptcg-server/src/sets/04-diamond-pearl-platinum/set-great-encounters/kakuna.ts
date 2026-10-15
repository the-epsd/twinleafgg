import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Kakuna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Weedle';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Stiffen',
    cost: [],
    damage: 0,
    text: 'During your opponent\'s next turn, any damage done to Kakuna by attacks is reduced by 30 (after applying Weakness and Resistance).'
  },
{
    name: 'Spit Poison',
    cost: [G],
    damage: 10,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Kakuna';
  public fullName: string = 'Kakuna GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stiffen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 30);
    }

    // Spit Poison
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    return state;
  }
}
