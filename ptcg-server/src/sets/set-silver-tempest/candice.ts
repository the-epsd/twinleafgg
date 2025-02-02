import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, TrainerType } from '../../game/store/card/card-types';
import { Card, CardList, ChooseCardsPrompt, EnergyCard, GameError, PokemonCard, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Candice, effect: TrainerEffect): IterableIterator<State> {
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

  const deckTop = new CardList();
  player.deck.moveTo(deckTop, 7);

  let pokemons = 0;
  let energies = 0;
  const blocked: number[] = [];
  deckTop.cards.forEach((c, index) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Water Energy') {
      energies += 1;
    } else if (c instanceof PokemonCard && c.cardType === CardType.WATER) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  const maxPokemons = Math.min(pokemons, 7);
  const maxEnergies = Math.min(energies, 7);
  const count = 7;

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    deckTop,
    {},
    { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxEnergies }
  ), selected => {
    cards = selected || [];
    next();
  });

  deckTop.moveCardsTo(cards, player.hand);
  deckTop.moveTo(player.deck);
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

export class Candice extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '152';

  public regulationMark = 'F';

  public name: string = 'Candice';

  public fullName: string = 'Candice SIT';

  public text: string =
    'Look at the top 7 cards of your deck. You may reveal any number of [W] Pokémon and [W] Energy cards you find there and put them into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}