import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  GameError,
  GameMessage,
  MoveEnergyPrompt,
  Player,
  PlayerType,
  SlotType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class MultiSwitch extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Multi Switch';
  public fullName: string = 'Multi Switch GRI';
  public text: string = 'Move an Energy from 1 of your Benched Pokémon to your Active Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // At least one Benched Pokémon must have an Energy attached
    return player.bench.some((b) => b.cards.some((c) => c.superType === SuperType.ENERGY));
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if any benched Pokemon has energy
      const hasEnergy = player.bench.some((b) => b.cards.some((c) => c.superType === SuperType.ENERGY));

      if (!hasEnergy) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Block all energy on Active (can't move from Active)
      const blockedMap: { source: any; blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (target.slot === SlotType.ACTIVE) {
          blockedMap.push({
            source: target,
            blocked: Array.from({ length: cardList.cards.length }, (_, i) => i),
          });
        }
      });

      // Block bench as target (only Active can receive)
      const blockedTo: any[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (target.slot !== SlotType.ACTIVE) {
          blockedTo.push(target);
        }
      });

      return store.prompt(
        state,
        new MoveEnergyPrompt(
          player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 1, max: 1, blockedMap, blockedTo },
        ),
        (transfers) => {
          if (transfers && transfers.length > 0) {
            for (const transfer of transfers) {
              const source = StateUtils.getTarget(state, player, transfer.from);
              MOVE_CARDS(store, state, source, player.active, {
                cards: [transfer.card],
                sourceCard: this,
              });
            }
          }
        },
      );
    }

    return state;
  }
}
