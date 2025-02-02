import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ShowCardsPrompt, StateUtils } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Player has no Basic Energy in the discard pile
  let basicEnergyCards = 0;
  player.discard.cards.forEach(c => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      basicEnergyCards++;
    }
  });
  if (basicEnergyCards === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const min = Math.min(basicEnergyCards, 2);
  return store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 1, max: min, allowCancel: false }
  ), cards => {
    cards = cards || [];

    if (cards.length > 0) {
      player.discard.moveCardsTo(cards, player.hand);
      cards.forEach((card, index) => {
        store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
      });
      if (cards.length > 0) {
        state = store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards), () => state);
      }
    }

    if (cards.length > 0) {
      // Recover discarded Pokemon
      player.discard.moveCardsTo(cards, player.hand);
      // Discard item card
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }
  });
}

export class EnergyRetrieval extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '171';

  public name: string = 'Energy Retrieval';

  public fullName: string = 'Energy Retrieval SVI';

  public text: string =
    'Put 2 basic Energy cards from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
