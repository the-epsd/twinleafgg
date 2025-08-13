import { Card } from '../../game/store/card/card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameMessage } from '../../game/game-message';
import { COIN_FLIP_PROMPT, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


function* useAstonish(next: Function, store: StoreLike, state: State,
  effect: AttackEffect, self: Card): IterableIterator<State> {

  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    opponent.hand,
    {},
    { min: 1, max: 1, allowCancel: false, isSecret: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      player.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards, sourceCard: self, sourceEffect: self.attacks[0] });

  return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
    opponent.deck.applyOrder(order);
  });
}

export class Yamask extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [{
    name: 'Astonish',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, choose a card at random from your opponent\'s hand. ' +
      'Your opponent reveals that card and shuffles it into his or her deck.'
  }];

  public set: string = 'DEX';
  public name: string = 'Yamask';
  public fullName: string = 'Yamask DEX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent has no cards in the hand
      if (opponent.hand.cards.length === 0) {
        return state;
      }
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (!result) {
          return state;
        }
        const generator = useAstonish(() => generator.next(), store, state, effect, this);
        return generator.next().value;
      });
    }

    return state;
  }

}
