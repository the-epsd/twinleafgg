import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Card, CardList, ChooseCardsPrompt, GameError, GameMessage, PowerType, SelectPrompt, ShowCardsPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Mankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 30;

  public weakness = [{ type: CardType.PSYCHIC }];

  public powers = [{
    name: 'Peek',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may look at one of the following: the top card of either player\'s deck, a random card from your opponent\'s hand, or one of either player\'s Prizes. This power can\'t be used if Mankey is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '55';

  public name: string = 'Mankey';

  public fullName: string = 'Mankey JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.REVEAL_YOUR_TOP_DECK,
          action: () => {

            const deckTop = new CardList();
            player.deck.moveTo(deckTop, 1);

            state = store.prompt(state, new ShowCardsPrompt(
              player.id,
              GameMessage.REVEAL_YOUR_TOP_DECK,
              deckTop.cards), () => state
            );

            deckTop.moveToTopOfDestination(player.deck);

            return state;
          }
        },
        {
          message: GameMessage.REVEAL_OPPONENT_TOP_DECK,
          action: () => {

            const deckTop = new CardList();
            opponent.deck.moveTo(deckTop, 1);

            state = store.prompt(state, new ShowCardsPrompt(
              player.id,
              GameMessage.REVEAL_OPPONENT_TOP_DECK,
              deckTop.cards), () => state
            );

            deckTop.moveToTopOfDestination(opponent.deck);

            return state;
          }
        },
        {
          message: GameMessage.REVEAL_RANDOM_CARD_IN_OPPONENT_HAND,
          action: () => {
            if (opponent.hand.cards.length === 0) {
              throw new GameError(GameMessage.CANNOT_USE_POWER);
            }

            let cards: Card[] = [];
            state = store.prompt(state, new ChooseCardsPrompt(
              player.id,
              GameMessage.REVEAL_RANDOM_CARD_IN_OPPONENT_HAND,
              opponent.hand,
              {},
              { min: 1, max: 1, allowCancel: false, isSecret: true }
            ), selected => {
              cards = selected || [];

              if (cards.length > 0) {
                state = store.prompt(state, new ShowCardsPrompt(
                  player.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  cards
                ), () => state);
              }
            });
            return state;
          }
        },
        {
          message: GameMessage.REVEAL_AN_OPPONENT_PRIZES,
          action: () => {
            const prizes = opponent.prizes.filter(p => p.isSecret);
            if (prizes.length === 0) {
              throw new GameError(GameMessage.CANNOT_USE_POWER);
            }
            let list = []
            const cards: Card[] = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

            const allPrizeCards = new CardList();
            opponent.prizes.forEach(prizeList => {
              allPrizeCards.cards.push(...prizeList.cards);
            });
            state = store.prompt(state, new ChooseCardsPrompt(
              player.id,
              GameMessage.REVEAL_ONE_OF_YOUR_PRIZES,
              allPrizeCards,
              {},
              { min: 1, max: 1, allowCancel: false, isSecret: true }
            ), chosenPrize => {
              list = chosenPrize || [];

              if (list.length > 0) {
                state = store.prompt(state, new ShowCardsPrompt(
                  player.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  list
                ), () => state);
              }
            });
            return state;
          }
        },
        {
          message: GameMessage.REVEAL_ONE_OF_YOUR_PRIZES,
          action: () => {
            const prizes = player.prizes.filter(p => p.isSecret);
            if (prizes.length === 0) {
              throw new GameError(GameMessage.CANNOT_USE_POWER);
            }
            let list = []
            const cards: Card[] = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

            const allPrizeCards = new CardList();
            player.prizes.forEach(prizeList => {
              allPrizeCards.cards.push(...prizeList.cards);
            });
            state = store.prompt(state, new ChooseCardsPrompt(
              player.id,
              GameMessage.REVEAL_ONE_OF_YOUR_PRIZES,
              allPrizeCards,
              {},
              { min: 1, max: 1, allowCancel: false, isSecret: true }
            ), chosenPrize => {
              list = chosenPrize || [];

              if (list.length > 0) {
                state = store.prompt(state, new ShowCardsPrompt(
                  player.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  list
                ), () => state);
              }
            });
            return state;
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

    return state;
  }
}