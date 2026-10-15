import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Drampa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [C, C],
    damage: 50,
    text: ''
  },
{
    name: 'Dragon Strike',
    cost: [C, C, C],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t use Dragon Strike.'
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '176';
  public name: string = 'Drampa';
  public fullName: string = 'Drampa ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dragon Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(effect.player, this.attacks[1]);
    }

    return state;
  }
}
