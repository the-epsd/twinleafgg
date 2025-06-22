import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARD_TO, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game';

export class PokeParksWhismur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Astonish',
    cost: [C],
    damage: 0,
    text: 'Choose a random card from your opponent\'s hand.Your opponent reveals that card and shuffles it into his or her deck.'
  },
  {
    name: 'Hyper Voice',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'PCGP';
  public name: string = 'PokéPark\'s Whismur';
  public fullName: string = 'PokéPark\'s Whismur PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';

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
