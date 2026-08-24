import { State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';

export class Aipom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Astonish',
    cost: [C, C],
    damage: 20,
    text: 'Choose a random card from your opponent\'s hand, and your opponent reveals that card and shuffles it into their deck.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Aipom';
  public fullName: string = 'Aipom PFL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Astonish
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
      MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[0] });
      SHUFFLE_DECK(store, state, opponent);
    }

    return state;
  }
}
