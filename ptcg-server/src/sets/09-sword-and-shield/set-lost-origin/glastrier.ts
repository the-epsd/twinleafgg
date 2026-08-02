import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  DEFENDING_POKEMON_CANNOT_ATTACK,
} from '../../../game/store/prefabs/prefabs';

export class Glastrier extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Freeze Down',
    cost: [W, C],
    damage: 40,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  }, {
    name: 'Wild Tackle',
    cost: [W, W, C],
    damage: 130,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Glastrier';
  public fullName: string = 'Glastrier LOR 51';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Freeze Down
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    // Wild Tackle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    }

    return state;
  }
}
