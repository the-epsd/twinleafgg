import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

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

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      DRAW_CARDS(player, 1);
    }

    return state;
  }
}