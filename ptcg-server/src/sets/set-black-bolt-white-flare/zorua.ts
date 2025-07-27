import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zorua extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Take Down',
    cost: [D],
    damage: 30,
    text: 'This Pokémon also does 10 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zorua';
  public fullName: string = 'Zorua SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }
    return state;
  }
}
