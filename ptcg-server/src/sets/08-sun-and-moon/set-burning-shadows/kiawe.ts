import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { Card, ChoosePokemonPrompt, Player, PlayerType, SlotType } from '../../../game';
import { State } from '../../../game/store/state/state';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  effect: TrainerEffect,
  self: Card,
): IterableIterator<State> {
  const player = effect.player;

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
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
      { min: 0, max: 4, allowCancel: false },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > 0) {
    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, min: 1, max: 1 },
      ),
      (targets) => {
        if (!targets || targets.length === 0) {
          return;
        }
        const target = targets[0];
        MOVE_CARDS(store, state, player.deck, target, { cards, sourceCard: self });
        next();
      },
    );
  }

  SHUFFLE_DECK(store, state, player);

  const endTurnEffect = new EndTurnEffect(player);
  return store.reduceEffect(state, endTurnEffect);
}

export class Kiawe extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Kiawe';
  public fullName: string = 'Kiawe BUS';
  public text: string =
    'Search your deck for up to 4 [R] Energy cards and attach them to 1 of your Pokémon. Then, shuffle your deck. Your turn ends.';

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
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
