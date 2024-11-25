import { Card } from '../../game/store/card/card';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { EnergyCard, PokemonCard } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  let pokemons = 0;
  let trainers = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Psychic Energy') {
      trainers += 1;
    } else if (c instanceof PokemonCard && c.cardType === CardType.PSYCHIC && c.stage === Stage.BASIC) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  const maxPokemons = Math.min(pokemons, 1);
  const maxTrainers = Math.min(trainers, 1);
  const count = maxPokemons || maxTrainers;

  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

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

export class FogCrystal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'CRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '140';

  public regulationMark = 'E';

  public name: string = 'Fog Crystal';

  public fullName: string = 'Fog Crystal CRE';

  public text: string =
    'Search your deck for a Pokemon with 90 HP or less, reveal it, ' +
    'and put it into your hand. Shuffle your deck afterward.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
