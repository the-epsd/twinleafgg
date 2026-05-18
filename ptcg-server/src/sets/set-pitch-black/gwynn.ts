import { PokemonCard } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function pokemonCardHasRuleBox(card: PokemonCard): boolean {
  return (
    card.tags.includes(CardTag.POKEMON_ex) ||
    card.tags.includes(CardTag.POKEMON_EX) ||
    card.tags.includes(CardTag.POKEMON_V) ||
    card.tags.includes(CardTag.POKEMON_VMAX) ||
    card.tags.includes(CardTag.POKEMON_VSTAR) ||
    card.tags.includes(CardTag.POKEMON_VUNION) ||
    card.tags.includes(CardTag.POKEMON_GX) ||
    card.tags.includes(CardTag.TAG_TEAM) ||
    card.tags.includes(CardTag.POKEMON_LV_X) ||
    card.tags.includes(CardTag.BREAK) ||
    card.tags.includes(CardTag.PRISM_STAR) ||
    card.tags.includes(CardTag.MEGA) ||
    card.tags.includes(CardTag.POKEMON_SV_MEGA) ||
    card.tags.includes(CardTag.LEGEND) ||
    card.tags.includes(CardTag.RADIANT)
  );
}

function* playGwynn(next: Function, store: StoreLike, state: State, effect: TrainerEffect, self: Gwynn): IterableIterator<State> {
  const player = effect.player;

  const blocked: number[] = [];
  player.hand.cards.forEach((c, i) => {
    if (!(c instanceof PokemonCard) || pokemonCardHasRuleBox(c)) {
      blocked.push(i);
    }
  });

  const selectableCount = player.hand.cards.length - blocked.length;
  if (selectableCount < 2) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let cards: typeof player.hand.cards = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_DISCARD,
    player.hand,
    {},
    { min: 2, max: 2, allowCancel: false, blocked },
  ), selected => {
    cards = selected || [];
    next();
  });

  MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: self });
  DRAW_CARDS(player, cards.length * 3);
  CLEAN_UP_SUPPORTER(store, effect, player);
}

export class Gwynn extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'J';
  public set: string = 'M5';
  public setNumber: string = '78';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gwynn';
  public fullName: string = 'Gwynn M5';
  public text: string = 'Discard 2 Pokémon from your hand (excluding any Rule Box Pokémon). Draw 3 cards for each Pokémon discarded in this way.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const generator = playGwynn(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    return state;
  }
}
