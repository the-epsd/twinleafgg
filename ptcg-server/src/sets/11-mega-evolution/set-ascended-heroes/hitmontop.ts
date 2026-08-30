import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Hitmontop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Spin and Draw',
    cost: [C],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw 6 cards.'
  },
  {
    name: 'Low Kick',
    cost: [F, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Hitmontop';
  public fullName: string = 'Hitmontop ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spin and Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MOVE_CARDS(store, state, effect.player.hand, effect.player.deck);
      SHUFFLE_DECK(store, state, effect.player);
      DRAW_CARDS(store, state, effect.player, 6);
    }

    return state;
  }
}
