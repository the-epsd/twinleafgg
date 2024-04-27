import { Card } from '../../game/store/card/card';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard, GameError } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const blocked1: number[] = [];
  player.discard.cards.forEach((card, index) => {
    if (card instanceof PokemonCard) {
      blocked1.push(index);
    }
  });

  const blocked2: number[] = [];
  player.discard.cards.forEach((card, index) => {
    if (card instanceof TrainerCard && card.trainerType !== TrainerType.TOOL) {
      blocked2.push(index);
    }
  });

  const blocked3: number[] = [];
  player.discard.cards.forEach((card, index) => {
    if (card instanceof TrainerCard && card.trainerType !== TrainerType.STADIUM) {
      blocked3.push(index);
    }
  });

  const blocked4: number[] = [];
  player.discard.cards.forEach((card, index) => {
    if (card instanceof EnergyCard) {
      blocked4.push(index);
    }
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.POKEMON },
    { min: 0, max: 1, allowCancel: false, blocked: blocked1 }
  ), selected => {
    cards = selected || [];
    next();
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
    { min: 0, max: 1, allowCancel: false, blocked: blocked2 }
  ), selected => {
    cards = selected || [];
    next();
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.TRAINER, trainerType: TrainerType.STADIUM },
    { min: 0, max: 1, allowCancel: false, blocked: blocked3 }
  ), selected => {
    cards = selected || [];
    next();
  });

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    { superType: SuperType.ENERGY },
    { min: 0, max: 1, allowCancel: false, blocked: blocked4 }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.discard.moveCardsTo(cards, player.deck);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  player.supporterTurn = 1;

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class RoseannesBackup extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BRS';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '148';

  public name: string = 'Roseanne\'s Backup';

  public fullName: string = 'Roseanne\'s Backup BRS';

  public text: string =
    'Choose 1 or more:' +
    '' +
    '• Shuffle a Pokémon from your discard pile into your deck.' +
    '• Shuffle a Pokémon Tool card from your discard pile into your deck.' +
    '• Shuffle a Stadium card from your discard pile into your deck.' +
    '• Shuffle an Energy card from your discard pile into your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
