import { Player, PokemonCard, StateUtils } from '../../../game';
import { GameMessage } from '../../../game/game-message';
import { Card } from '../../../game/store/card/card';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: LanasFishingRod,
  effect: TrainerEffect,
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  let cards: Card[] = [];

  let tools = 0;
  let pokemons = 0;
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    if (c instanceof TrainerCard && c.trainerType === TrainerType.TOOL) {
      tools += 1;
    } else if (c instanceof PokemonCard) {
      pokemons += 1;
    } else {
      blocked.push(index);
    }
  });

  const hasBoth = tools > 0 && pokemons > 0;
  const minCount = hasBoth ? 2 : tools > 0 || pokemons > 0 ? 1 : 0;
  const maxCount = hasBoth ? 2 : 1;

  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player,
      GameMessage.CHOOSE_CARD_TO_DECK,
      player.discard,
      {},
      { min: minCount, max: maxCount, allowCancel: false, blocked, maxTools: 1, maxPokemons: 1 },
    ),
    (selected) => {
      cards = selected || [];
      next();
    },
  );

  MOVE_CARDS(store, state, player.discard, player.deck, { cards, sourceCard: self });
  SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);

  return SHUFFLE_DECK(store, state, player);
}

export class LanasFishingRod extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '195';
  public name: string = "Lana's Fishing Rod";
  public fullName: string = "Lana's Fishing Rod CEC";
  public text: string =
    'Shuffle a Pokémon and a Pokémon Tool card from your discard pile into your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}
