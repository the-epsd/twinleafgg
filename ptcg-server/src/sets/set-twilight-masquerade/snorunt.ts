import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Snorunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Astonish',
    cost: [W, C],
    damage: 20,
    text: 'Choose a random card from your opponent\'s hand. Your opponent ' +
      'reveals that card and shuffles it into their deck.'
  }];

  public set: string = 'TWM';
  public name: string = 'Snorunt';
  public fullName: string = 'Snorunt TWM';
  public cardImage: string = 'assets/cardback.png';
  public regulationMark = 'H'
  public setNumber: string = '51';

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
