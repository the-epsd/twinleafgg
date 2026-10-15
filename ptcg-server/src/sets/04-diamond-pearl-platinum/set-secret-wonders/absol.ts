import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, TrainerType } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Absol extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Baleful Wind',
    cost: [C],
    damage: 0,
    text: 'Choose a card from your opponent\'s hand without looking and discard it. If you discarded a Trainer, Supporter, or Stadium card, choose 1 more card from your opponent\'s hand without looking and discard it.'
  },
  {
    name: 'Raid',
    cost: [D],
    damage: 10,
    text: 'If you played Absol from your hand during this turn, this attack\'s base damage is 40 instead of 10.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Absol';
  public fullName: string = 'Absol SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Baleful Wind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.hand.cards.length === 0) {
        return state;
      }

      const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
      const randomCard = opponent.hand.cards[randomIndex];
      MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
        cards: [randomCard],
        sourceCard: this,
      });

      const isTrainerCard = randomCard instanceof TrainerCard && (
        randomCard.trainerType === TrainerType.ITEM ||
        randomCard.trainerType === TrainerType.SUPPORTER ||
        randomCard.trainerType === TrainerType.STADIUM
      );

      if (isTrainerCard && opponent.hand.cards.length > 0) {
        const secondIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const secondCard = opponent.hand.cards[secondIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
          cards: [secondCard],
          sourceCard: this,
        });
      }
    }

    // Raid
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.pokemonPlayedTurn === state.turn) {
        effect.damage = 40;
      }
    }

    return state;
  }
}
