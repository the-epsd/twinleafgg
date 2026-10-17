import { CardList, GameError, GameMessage, OrderCardsPrompt, PlayerType, PokemonCard, PokemonCardList, SelectPrompt, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Cresselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Future Sight',
    cost: [C],
    damage: 0,
    text: 'Look at the top 5 cards of either player\'s deck and put them back on top of that player\'s deck in any order.'
  },
  {
    name: 'Healing Light',
    cost: [P, P, C],
    damage: 40,
    text: 'Remove 1 damage counter from each of your Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Cresselia';
  public fullName: string = 'Cresselia MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Future Sight
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const options: { message: GameMessage, action: () => void }[] = [
      {
      message: GameMessage.ORDER_YOUR_DECK,
      action: () => {
      if (player.deck.cards.length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 5, sourceCard: this });
      return store.prompt(state, new OrderCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARDS_ORDER,
      deckTop,
      { allowCancel: false },
      ), order => {
      if (order === null) {
      return state;
      }
      deckTop.applyOrder(order);
      deckTop.moveToTopOfDestination(player.deck);
      });
      }
      },
      {
      message: GameMessage.ORDER_OPPONENT_DECK,
      action: () => {
      if (opponent.deck.cards.length === 0) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const deckTop = new CardList();
      MOVE_CARDS(store, state, opponent.deck, deckTop, { count: 5, sourceCard: this });
      return store.prompt(state, new OrderCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARDS_ORDER,
      deckTop,
      { allowCancel: false },
      ), order => {
      if (order === null) {
      return state;
      }
      deckTop.applyOrder(order);
      deckTop.moveToTopOfDestination(opponent.deck);
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

    // Healing Light
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
      const healEffect = new HealEffect(player, cardList, 10);
      state = store.reduceEffect(state, healEffect);
      return state;
      });
    }

    return state;
  }
}
