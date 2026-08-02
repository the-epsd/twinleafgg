import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_CANNOT_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ursaring extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Teddiursa';
  public cardType: CardType = C;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Hammer In',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Heavy Hold',
    cost: [C, C, C, C],
    damage: 120,
    text: 'The Defending Pokémon can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'CEC';
  public setNumber: string = '172';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ursaring';
  public fullName: string = 'Ursaring CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Heavy Hold
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
    }

    return state;
  }
}
