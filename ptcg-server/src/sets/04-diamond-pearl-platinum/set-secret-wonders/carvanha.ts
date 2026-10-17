import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Carvanha extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Bite Away',
    cost: [D, C],
    damage: 20,
    text: 'Flip a coin. If heads, choose a card from your opponent\'s hand without looking and discard it.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Carvanha';
  public fullName: string = 'Carvanha SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bite Away
    if (WAS_ATTACK_USED(effect, 1, this)) {
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
