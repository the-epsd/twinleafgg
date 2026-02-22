import { Attack, CardType, PokemonCard, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AFTER_ATTACK, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Rotom extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [{
    name: 'Astonish',
    cost: [L],
    damage: 20,
    text: 'Choose a random card from your opponent\'s hand. Your opponent reveals it and shuffles it into their deck.'
  }, {
    name: 'Gadget Show',
    cost: [C, C],
    damage: 30,
    text: 'This attack does 30 damage for each Pokémon Tool attached to all of your Pokemon.',
  }];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[0] });
        SHUFFLE_DECK(store, state, opponent);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let toolCount = 0;

      [player.active, ...player.bench].forEach(list => {
        list.cards.forEach(card => {
          if (card instanceof PokemonCard && card.tools.length > 0) {
            toolCount += card.tools.length;
          }
        });
      });
      effect.damage = 30 * toolCount;
    }
    return state;
  }
}