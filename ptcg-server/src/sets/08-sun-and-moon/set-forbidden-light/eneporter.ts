import { TrainerType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  StateUtils,
  GameMessage,
  GameError,
  PlayerType,
  SlotType,
  MoveEnergyPrompt,
  Player,
  EnergyCard,
  TrainerCard,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class Eneporter extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Eneporter';
  public fullName: string = 'Eneporter FLI';
  public text: string =
    "Move a Special Energy from 1 of your opponent's Pokémon to another of their Pokémon.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);

    // The opponent needs at least 2 Pokémon and at least 1 Special Energy attached
    let totalPokemon = 0;
    let hasSpecialEnergy = false;
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
      totalPokemon++;
      if (
        cardList.cards.some((c) => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)
      ) {
        hasSpecialEnergy = true;
      }
    });
    return totalPokemon >= 2 && hasSpecialEnergy;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      store.prompt(
        state,
        new MoveEnergyPrompt(
          player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
          { allowCancel: false, min: 1, max: 1 },
        ),
        (transfers) => {
          if (transfers === null) {
            return;
          }

          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, opponent, transfer.from);
            const target = StateUtils.getTarget(state, opponent, transfer.to);
            MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this });
          }
        },
      );
    }

    return state;
  }
}
