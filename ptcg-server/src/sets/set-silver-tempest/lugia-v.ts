import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, ChooseCardsPrompt,
  StateUtils, GameMessage, ConfirmPrompt
} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class LugiaV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 220;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Read the Wind',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Discard a card from your hand. If you do, draw 3 cards.'
    },
    {
      name: 'Aero Dive',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 130,
      text: 'You may discard a Stadium in play.'
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '138';

  public name: string = 'Lugia V';

  public fullName: string = 'Lugia V SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 3);
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {

            // Discard Stadium
            const cardList = StateUtils.findCardList(state, stadiumCard);
            const player = StateUtils.findOwner(state, cardList);
            cardList.moveTo(player.discard);
            return state;
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}