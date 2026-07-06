import { Card, GameError, GameMessage, PokemonCard, PokemonCardList, State, StateUtils, StoreLike } from '../../../game';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { UseStadiumEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../../game/store/prompts/shuffle-prompt';

function* useStadium(next: Function, store: StoreLike, state: State, effect: UseStadiumEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  if (player.deck.cards.length === 0 || slots.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  const maxPick = Math.min(2, slots.length);
  const blocked: number[] = [];
  player.deck.cards.forEach((card, index) => {
    if (!(card instanceof TrainerCard && card.name.includes('Antique'))) {
      blocked.push(index);
    }
  });
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.TRAINER },
    { min: 0, max: maxPick, allowCancel: false, blocked }
  ), selected => {
    cards = selected || [];
    next();
  });
  cards.forEach((card, index) => {
    const playFromDeck = new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]);
    store.reduceEffect(state, playFromDeck);
    slots[index].pokemonPlayedTurn = state.turn;
  });
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class FossilExcavationSite extends TrainerCard {
  public trainerType = TrainerType.STADIUM;
  public regulationMark = 'J';
  public set: string = 'M5';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Fossil Excavation Site';
  public fullName = 'Fossil Excavation Site M5';
  public text = 'Once during each player\'s turn, that player may search their deck for up to 2 Trainer cards with "Antique" in their name, put them onto their Bench, and then shuffle their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const generator = useStadium(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}
