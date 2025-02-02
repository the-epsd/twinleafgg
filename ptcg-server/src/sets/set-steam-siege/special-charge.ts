import { EnergyCard, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, self: SpecialCharge, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const specialEnergyCards = player.discard.cards.filter(c => {
    return c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL;
  }).length;

  if (specialEnergyCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  const min = Math.min(2, specialEnergyCards);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
    { min, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    player.discard.moveCardsTo(cards, player.deck);
    cards.forEach((card, index) => {
      store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
      state = store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        cards), () => state);
    }

  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class SpecialCharge extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'STS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name: string = 'Special Charge';

  public fullName: string = 'Special Charge STS';

  public text: string =
    'Shuffle 2 Special Energy cards from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
