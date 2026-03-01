import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: P }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Bite',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Poison Spray',
    cost: [G],
    damage: 0,
    text: 'The Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'N3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat N3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}