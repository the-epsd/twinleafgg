import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Nuzleaf extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Seedot';

  public attacks = [{
    name: 'Pound',
    cost: [CardType.GRASS],
    damage: 20,
    text: ''
  },
  {
    name: 'Clear the Room',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Your opponent reveals their hand. Choose a Supporter card you find there. Your opponent shuffles that card into their deck. '
  }];

  public set = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name = 'Nuzleaf';
  public fullName = 'Nuzleaf CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      if (opponent.hand.cards.length > 0) {
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_SHUFFLE,
          opponent.hand,
          { trainerType: TrainerType.SUPPORTER },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          cards = selected || [];

          opponent.hand.moveCardsTo(cards, opponent.deck);

          //Shuffle deck afterward.
          return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
            opponent.deck.applyOrder(order);
          });
        });
      }

    }

    return state;
  }
}