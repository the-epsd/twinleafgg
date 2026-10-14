import { Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  Card,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  PokemonCard,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { PlayPokemonFromDiscardEffect } from '../../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Revive extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Revive';
  public fullName: string = 'Revive BLW';
  public text: string = 'Put a Basic Pokemon from your discard pile onto your Bench.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    const openSlots = player.bench.filter((b) => b.cards.length === 0);
    if (openSlots.length === 0) {
      return false;
    }
    return player.discard.cards.some(
      (c) => c instanceof PokemonCard && c.stage === Stage.BASIC,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const openSlots = player.bench.filter((b) => b.cards.length === 0);

      if (openSlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (
        !player.discard.cards.some(
          (c) => c instanceof PokemonCard && c.stage === Stage.BASIC,
        )
      ) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      let cards: Card[] = [];
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
          player.discard,
          { superType: SuperType.POKEMON, stage: Stage.BASIC },
          { min: 1, max: 1, allowCancel: true },
        ),
        (selected) => {
          cards = selected || [];
          cards.forEach((card, index) => {
            store.reduceEffect(
              state,
              new PlayPokemonFromDiscardEffect(
                player,
                card as PokemonCard,
                openSlots[index],
              ),
            );
          });
        },
      );
    }

    return state;
  }
}
