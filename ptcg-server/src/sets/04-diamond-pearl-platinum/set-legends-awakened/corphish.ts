import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Corphish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Knock Off',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, choose 1 card from your opponent\'s hand without looking and discard it.'
  },
  {
    name: 'Irongrip',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Corphish';
  public fullName: string = 'Corphish LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Knock Off
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
      if (result && opponent.hand.cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];
      MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
      cards: [randomCard],
      sourceCard: this,
      });
      }
      });
    }

    return state;
  }
}
