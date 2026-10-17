import { Card, Player, PokemonCardList } from '../../../game';
import { GameMessage } from '../../../game/game-message';
import { CardTag, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

function* useKeepCalling(
  next: Function,
  store: StoreLike,
  state: State,
  self: Brawly,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter((b) => b.cards.length === 0);
  const max = Math.min(slots.length, 3);

  const blocked: number[] = [];
  for (let i = 0; i < player.deck.cards.length; i++) {
    const card = player.deck.cards[i];
    if (!card.hasTag(CardTag.RAPID_STRIKE)) {
      blocked.push(i);
    }
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      player.deck,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 0, max, allowCancel: false, blocked },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    MOVE_CARDS(store, state, player.deck, slots[index], {
      cards: [card],
      sourceCard: self,
      sourceEffect: effect,
    });
    slots[index].pokemonPlayedTurn = state.turn;
  });

  MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [self], sourceCard: self });

  return SHUFFLE_DECK(store, state, player);
}

export class Brawly extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '131';
  public name: string = 'Brawly';
  public fullName: string = 'Brawly CRE';
  public text: string =
    'Search your deck for up to 3 Basic Rapid Strike Pokémon and put them onto your Bench. Then, shuffle your deck.';
  protected _tags = [CardTag.RAPID_STRIKE];

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = useKeepCalling(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    return state;
  }
}
