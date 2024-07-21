import { Card } from '../../game/store/card/card';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { EnergyCard, GameError, PokemonCard } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: NightlyStretcher, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];



  let pokemons = 0;
  let energies = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      energies += 1;
    } else if (c instanceof PokemonCard) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  // Player does not have correct cards in discard
  if (pokemons === 0 && energies === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const maxPokemons = Math.min(pokemons, 1);
  const maxEnergies = Math.min(energies, 1);

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;
  player.hand.moveCardTo(effect.trainerCard, player.supporter);

  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.discard,
    {},
    { min: 0, max: 1, allowCancel: false, blocked, maxPokemons, maxEnergies }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.discard.moveCardsTo(cards, player.hand);

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

export class NightlyStretcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public regulationMark = 'H';

  public name: string = 'Nightly Stretcher';

  public fullName: string = 'Nightly Stretcher SV6a';

  public text: string =
    'Put a Pokémon or a Basic Energy Card from your discard pile into your hand.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }

}