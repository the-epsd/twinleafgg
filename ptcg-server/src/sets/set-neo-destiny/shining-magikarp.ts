import { Card, ChooseCardsPrompt, GameMessage, ShowCardsPrompt, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import {
  CONFIRMATION_PROMPT,
  DRAW_CARDS,
  MOVE_CARDS,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class ShiningMagikarp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Gold Scale',
    cost: [W],
    damage: 0,
    text: 'Your opponent may draw 2 cards. Either way, you may draw 2 cards.',
  },
  {
    name: 'Dragon Bond',
    cost: [P],
    damage: 0,
    text: 'Search your deck for a card named Gyarados, Dark Gyarados, or Shining Gyarados. Show it to your opponent and put it into your hand. Shuffle your deck afterward.',
  }];

  public set: string = 'N4';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shining Magikarp';
  public fullName: string = 'Shining Magikarp N4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gold Scale
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.deck.cards.length > 0) {
        CONFIRMATION_PROMPT(store, state, opponent, result => {
          if (result) {
            DRAW_CARDS(store, state, opponent, 2);
          }
        }, GameMessage.WANT_TO_DRAW_CARDS);
      }

      if (player.deck.cards.length > 0) {
        CONFIRMATION_PROMPT(store, state, player, result => {
          if (result) {
            DRAW_CARDS(store, state, player, 2);
          }
        }, GameMessage.WANT_TO_DRAW_CARDS);
      }
    }

    // Dragon Bond
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        return state;
      }

      const GYARADOS_NAMES = ['Gyarados', 'Dark Gyarados', 'Shining Gyarados'];
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (!GYARADOS_NAMES.includes(c.name)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false, blocked },
      ), selected => {
        const cards: Card[] = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
          store.prompt(state, [new ShowCardsPrompt(
            opponent.id,
            GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
            cards,
          )], () => {});
        }
        return SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
