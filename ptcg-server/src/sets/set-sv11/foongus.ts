import { PokemonCard, Stage, CardType, State, StoreLike } from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class Foongus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Poison Spore',
    cost: [C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Foongus';
  public fullName: string = 'Foongus SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    return state;
  }
}
