import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card, ChooseCardsPrompt, GameMessage, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Meowth';

  public attacks = [{
    name: 'Make \'Em Pay',
    cost: [CardType.COLORLESS],
    damage: 20,
    text: ' If your opponent has 4 or more cards in their hand, they reveal their hand.'
      + 'Discard cards you find there until your opponent has exactly 4 cards in their hand. '
  },
  {
    name: 'Sharp Claws',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ' Flip a coin. If heads, this attack does 60 more damage.'
  }];

  public set = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '126';
  public name = 'Persian';
  public fullName = 'Persian TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let cards: Card[] = [];

      if (opponent.hand.cards.length >= 4) {
        let minMaxDiscardAmt = opponent.hand.cards.length - 4;

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.hand,
          {},
          { min: minMaxDiscardAmt, max: minMaxDiscardAmt, allowCancel: false }
        ), selected => {
          cards = selected || [];
          opponent.hand.moveCardsTo(cards, opponent.discard);
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          effect.damage += 60;
        }
      });
    }

    return state;
  }

}