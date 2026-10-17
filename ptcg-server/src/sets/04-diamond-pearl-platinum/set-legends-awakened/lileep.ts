import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lileep extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Root Fossil';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Astonish',
    cost: [C],
    damage: 20,
    text: 'Choose 1 card from your opponent\'s hand without looking. Look at that card you chose, then have your opponent shuffle that card into his or her deck.'
  },
  {
    name: 'Absorb',
    cost: [G, C],
    damage: 30,
    text: 'Remove 2 damage counters from Lileep.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Lileep';
  public fullName: string = 'Lileep LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Astonish
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.hand.cards.length === 0) {
        return state;
      }
      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];
      SHOW_CARDS_TO_PLAYER(store, state, player, [randomCard]);
      MOVE_CARDS(store, state, opponent.hand, opponent.deck, {
        cards: [randomCard],
        sourceCard: this,
        sourceEffect: this.attacks[0],
      });
      SHUFFLE_DECK(store, state, opponent);
    }

    // Absorb
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
