import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  AttachEnergyPrompt,
  Player,
  PlayerType,
  SlotType,
  GameError,
  GameMessage,
  EnergyCard,
  TrainerCard,
  StateUtils,
  State,
  StoreLike,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Bede extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'D';
  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public name: string = 'Bede';
  public fullName: string = 'Bede SSH';
  public text: string = 'Attach a basic Energy card from your hand to 1 of your Benched Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (
      !player.hand.cards.some((c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC)
    ) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (
        !player.hand.cards.some((c) => c instanceof EnergyCard && c.energyType === EnergyType.BASIC)
      ) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will hand this card after prompt confirmation
      effect.preventDefault = true;

      store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 1, max: 1, allowCancel: false },
        ),
        (transfers) => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.hand, target, {
              cards: [transfer.card],
              sourceCard: this,
            });
          }

          return state;
        },
      );

      return state;
    }

    return state;
  }
}
