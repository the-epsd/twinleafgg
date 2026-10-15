import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Rotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Astonish',
    cost: [C, C],
    damage: 20,
    text: 'Choose 1 card from your opponent\'s hand without looking. Look at that card you chose, then have your opponent shuffle that card into his or her deck.'
  },
  {
    name: 'Telebeam',
    cost: [L, L],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage and the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Rotom';
  public fullName: string = 'Rotom GE';

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

    // Telebeam
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
          const addSpecialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, addSpecialCondition);
        }
      });
    }

    return state;
  }
}
