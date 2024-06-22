import { PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

function* playCard(next: Function, store: StoreLike, state: State, self: LanasFishingRod, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  
  const pokemonAndTools = player.discard.cards.filter(c => {
    return (c instanceof PokemonCard || (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL));
  }).length;

  if (pokemonAndTools === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c instanceof PokemonCard || (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL)) {
      /**/ 
    } else {
      blocked.push(index);
    }
  });
  
  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  const min = Math.min(2, pokemonAndTools);
  
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_DECK,
    player.discard,
    {  },
    { min, max: 2, allowCancel: false, blocked }
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

export class LanasFishingRod extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CEC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '195';

  public name: string = 'Lanas Fishing Rod';

  public fullName: string = 'Lanas Fishing Rod CEC';

  public text: string =
    'Shuffle a Pokémon and a Pokémon Tool card from your discard pile into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }

}
