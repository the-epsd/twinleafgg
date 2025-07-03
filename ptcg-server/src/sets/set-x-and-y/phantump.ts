import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Phantump extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Astonish',
    cost: [P],
    damage: 0,
    text: 'Choose a random card from your opponent\'s hand. Your opponent ' +
      'reveals that card and shuffles it into his or her deck.'
  }, {
    name: 'Hook',
    cost: [P, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'XY';
  public name: string = 'Phantump';
  public fullName: string = 'Phantump XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
        MOVE_CARD_TO(state, randomCard, opponent.deck);
        SHUFFLE_DECK(store, state, opponent);
      }
    }

    return state;
  }

}
