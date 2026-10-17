import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StoreLike,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class FossilResearcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FFI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';
  public name: string = 'Fossil Researcher';
  public fullName: string = 'Fossil Researcher FFI';
  public text: string =
    'Search your deck for up to 2 in any combination of Amaura or Tyrunt and put them onto your bench. Shuffle your deck afterward. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return player.bench.some((b) => b.cards.length === 0);
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

      const slots = player.bench.filter((b) => b.cards.length === 0);
      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block cards that are not Amaura or Tyrunt
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || (card.name !== 'Amaura' && card.name !== 'Tyrunt')) {
          blocked.push(index);
        }
      });

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.deck,
          {},
          { min: 0, max: Math.min(2, slots.length), allowCancel: false, blocked },
        ),
        (selected) => {
          const cards = selected || [];

          cards.slice(0, slots.length).forEach((card, index) => {
            store.reduceEffect(
              state,
              new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]),
            );
          });

          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
