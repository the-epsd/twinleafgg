import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, GameMessage, ChooseCardsPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class NsPurrloin extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Pilfer',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 20,
      text: 'Your opponent reveals their hand. Put a card you find there on the bottom of their deck.'
    }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';

  public name: string = 'N\'s Purrloin';
  public fullName: string = 'N\'s Purrloin SV9';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent has no cards in the hand
      if (opponent.hand.cards.length === 0) {
        return state;
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];
        opponent.hand.moveCardsTo(cards, opponent.deck);
      });
    }

    return state;
  }

}