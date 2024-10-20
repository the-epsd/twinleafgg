import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils,
  GameMessage,
  CardList,
  OrderCardsPrompt,
  SelectPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Absolex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 210;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Future Sight',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Look at the top 3 cards of either player\'s deck and put them back in any order.'
    },
    {
      name: 'Cursed Slug',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'If your opponent has 3 or fewer cards in their hand, this attack does 120 more damage.'
    }
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '135';

  public name: string = 'Absol ex';

  public fullName: string = 'Absol ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.CHOOSE_OPTION,
          action: () => {

            const opponentDeckTop = new CardList();
            opponent.deck.moveTo(opponentDeckTop, 3);

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              opponentDeckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              opponentDeckTop.applyOrder(order);
              opponentDeckTop.moveToTopOfDestination(opponent.deck);

            });
          }
        },
        {
          message: GameMessage.CHOOSE_OPTION,
          action: () => {
            const player = effect.player;

            const playerDeckTop = new CardList();
            player.deck.moveTo(playerDeckTop, 3);

            return store.prompt(state, new OrderCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARDS_ORDER,
              playerDeckTop,
              { allowCancel: false },
            ), order => {
              if (order === null) {
                return state;
              }

              playerDeckTop.applyOrder(order);
              playerDeckTop.moveToTopOfDestination(player.deck);
            });
          }
        }
      ];
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const handCount = opponent.hand.cards.length;
      if (handCount <= 3) {
        effect.damage += 120;
      }
    }
    return state;
  }
}