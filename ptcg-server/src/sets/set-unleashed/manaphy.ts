import { AFTER_ATTACK, DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';

export class Manaphy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [];

  public attacks = [{
    name: 'Deep Sea Swirl',
    cost: [C],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw 5 cards.'
  },
  {
    name: 'Rain Splash',
    cost: [W],
    damage: 20,
    text: ''
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Manaphy';
  public fullName: string = 'Manaphy UL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      MOVE_CARDS(store, state, player.hand, player.deck, {});
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 5);
    }

    return state;
  }
}