import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_RETREAT, DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chatot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Mimic',
    cost: [],
    damage: 0,
    text: 'Shuffle your hand into your deck. Then, draw a number of cards equal to the number of cards in your opponent\'s hand.'
  },
  {
    name: 'Chatter',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Chatot';
  public fullName: string = 'Chatot MD';

  public readonly CHATTER_MARKER: string = 'CHATTER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, player.hand, player.deck);
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(store, state, player, opponent.hand.cards.length);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    return state;
  }
}