import { EnergyCard, PokemonCard, ShowCardsPrompt, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardTag, EnergyType, Stage, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    // eslint-disable-next-line no-empty    
    if ((card instanceof PokemonCard && card.stage === Stage.BASIC && card.cardTag.includes(CardTag.TEAM_MAGMA)) ||
      (card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Fighting Energy')) {
      /**/
    } else {
      blocked.push(index);
    }
  });
  
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    { min: 0, max: 1, allowCancel: true, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Operation canceled by the user
  if (cards.length === 0) {
    return state;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, player.hand);
  });

  cards.forEach((card, index) => {
    store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
  });
  
  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  player.supporter.moveCardTo(effect.trainerCard, player.discard);
  
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });

}
export class TeamMagmasGreatBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'DCR';

  public name: string = 'Team Magma\'s Great Ball';

  public fullName: string = 'Team Magma\'s Great Ball DCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public text: string =
    'Search your deck for a Basic Team Magma Pokémon and a basic [F] Energy card, reveal them, and put them into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
