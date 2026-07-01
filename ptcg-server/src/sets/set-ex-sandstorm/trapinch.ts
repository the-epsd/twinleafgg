import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Trapinch extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Sand Pit',
    cost: [C],
    damage: 10,
    text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
  }, {
    name: 'Irongrip',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Trapinch';
  public fullName: string = 'Trapinch SS';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}