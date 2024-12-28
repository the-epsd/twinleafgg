import { Card } from '../../game/store/card/card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PokemonCard } from '../../game';

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

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.POKEMON },
    { min: 0, max: 2, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length == 2 && cards instanceof PokemonCard && cards.stage !== Stage.BASIC) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }

  player.deck.moveCardsTo(cards, player.hand);
  player.supporter.moveCardTo(effect.trainerCard, player.discard);


  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class BrocksRecruitment extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Brock\'s Recruitment';

  public fullName: string = 'Brock\'s Recruitment SV9';

  public text: string =
    'Search your deck for either up to 2 Basic Pokémon or 1 Evolution Pokémon, reveal them, and put them into your hand. Then shuffle your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
