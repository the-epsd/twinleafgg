import { Card } from '../../../game/store/card/card';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType, Stage } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import {
  PlayPokemonFromDeckEffect,
  TrainerEffect,
} from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Player } from '../../../game/store/state/player';
import { SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter((b) => b.cards.length === 0);
  const max = Math.min(slots.length, 3);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC } as any,
      { min: 0, max, allowCancel: true, differentTypes: true },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  cards.forEach((card, index) => {
    store.reduceEffect(
      state,
      new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]),
    );
  });

  return SHUFFLE_DECK(store, state, player);
}

export class ProfessorOaksSetup extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '201';
  public name: string = "Professor Oak's Setup";
  public fullName: string = "Professor Oak's Setup CEC";
  public text: string =
    'Search your deck for up to 3 Basic Pokemon of different types and ' +
    'put them onto your Bench. Then, shuffle your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
