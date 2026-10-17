import { Card, ChooseCardsPrompt, GameError, GameMessage, Player, PokemonCard, PokemonCardList, State, StoreLike } from '../../../game';
import { CardTag, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Brigette extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '134';
  public name: string = 'Brigette';
  public fullName: string = 'Brigette BKT';
  public text: string = 'Search your deck for 1 Basic Pokémon-EX or 3 Basic Pokémon (except for Pokémon-EX) and put them onto your Bench. Shuffle your deck afterward.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    if (!player.bench.some((b) => b.cards.length === 0)) {
      return false;
    }
    return player.deck.cards.some((c) => c instanceof PokemonCard && c.stage === Stage.BASIC);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const slots: PokemonCardList[] = player.bench.filter((b) => b.cards.length === 0);

      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block any card that is not a Basic Pokémon (EX or non-EX allowed)
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (!(c instanceof PokemonCard && c.stage === Stage.BASIC)) {
          blocked.push(index);
        }
      });

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let cards: Card[] = [];

      const maxCards = Math.min(3, slots.length);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.deck,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 0, max: maxCards, allowCancel: false, blocked },
        ),
        (selectedCards) => {
          cards = selectedCards || [];

          // If an EX was chosen together with other cards, re-prompt to choose a single Basic Pokémon (EX or non-EX)
          if (cards.length > 1 && cards.some((card) => (card as PokemonCard).hasTag(CardTag.POKEMON_EX))) {
            return store.prompt(
              state,
              new ChooseCardsPrompt(
                player,
                GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
                player.deck,
                { superType: SuperType.POKEMON, stage: Stage.BASIC },
                { min: 1, max: 1, allowCancel: false, blocked },
              ),
              (singleCards) => {
                const chosen = singleCards || [];
                if (chosen.length === 0) {
                  return state;
                }

                MOVE_CARDS(store, state, player.deck, slots[0], {
                  cards: [chosen[0]],
                  sourceCard: this,
                });
                slots[0].pokemonPlayedTurn = state.turn;

                return SHUFFLE_DECK(store, state, player);
              },
            );
          }

          // Move each selected card specifically (don't move the whole deck)
          cards.forEach((card, index) => {
            MOVE_CARDS(store, state, player.deck, slots[index], {
              cards: [card],
              sourceCard: this,
            });
            slots[index].pokemonPlayedTurn = state.turn;
          });

          return SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
