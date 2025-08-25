import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Meowth extends PokemonCard {
  public cardType = D;
  public additionalCardTypes = [M];
  public stage = Stage.BASIC;
  public hp = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Pay Day',
    cost: [M, C],
    damage: 10,
    text: 'Draw a card.'
  }];

  public set = 'HP';
  public setNumber = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meowth';
  public fullName = 'Meowth HP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }
}